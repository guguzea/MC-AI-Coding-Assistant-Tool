#!/usr/bin/env node
/**
 * Plan 4 Skill QC：只扫清单内 SKILL.md 的 Markdown 代码块。
 * - ClassName（大写开头标识符）与 methodName(
 * - 同句或紧邻句含「未核实 / 禁止默写 / 以该版文档为准」则豁免
 * - 老加载器黑名单：ModInitializer、DeferredRegister、FabricLoader、net.fabricmc
 * - 老加载器：代码块内类名须出现在同档核实表（verified-api.md / safe-api.md / listeners.md）
 * - Fabric 1.21.11：代码块内禁止实测不存在的配方签名（扫 fabric/1.21.11/.cursor + 非点目录；反例只许写在正文行内码）
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const listArg = process.argv.find((a) => a.startsWith("--list="));
const listPath = listArg ? listArg.slice("--list=".length) : join(here, "lint-skill-verified-api.files.txt");

const EXEMPT = /未核实|禁止默写|以该版文档为准/;
const BLACKLIST = ["ModInitializer", "DeferredRegister", "FabricLoader", "net.fabricmc"];
// 必须允许「字符串开头」：默认清单是仓库相对路径，条目直接以 liteloader/ 开头。
const OLD = /(^|[/\\])(liteloader|rift|modloader)([/\\]|$)/i;

function extractCodeBlocks(md) {
  const blocks = [];
  const re = /```[\w-]*\r?\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(md))) blocks.push({ text: m[1], start: m.index, end: m.index + m[0].length });
  return blocks;
}

function sentencesAround(md, start, end) {
  const before = md.slice(Math.max(0, start - 240), start);
  const after = md.slice(end, Math.min(md.length, end + 240));
  return `${before}\n${after}`;
}

function pascalIds(code) {
  const out = new Set();
  const re = /\b([A-Z][A-Za-z0-9_]*)\b/g;
  let m;
  while ((m = re.exec(code))) {
    const n = m[1];
    if (n === "SKILL" || n.length < 2) continue;
    out.add(n);
  }
  return [...out];
}

function methodCalls(code) {
  const out = [];
  const re = /\b([a-z][A-Za-z0-9_]*)\s*\(/g;
  let m;
  while ((m = re.exec(code))) out.push(m[1]);
  return out;
}

function loadVerifiedNames(skillAbs) {
  const packDir = skillAbs.replace(/[/\\]\.cursor[/\\].*$/, "").replace(/[/\\]\.agents[/\\].*$/, "");
  const candidates = [
    join(packDir, "knowledge", "common", "verified-api.md"),
    join(packDir, "knowledge", "common", "safe-api.md"),
    join(packDir, "knowledge", "common", "listeners.md"),
    join(packDir, "knowledge", "common", "qsl-verified.md"),
  ];
  let text = "";
  for (const p of candidates) {
    if (existsSync(p)) text += `\n${readFileSync(p, "utf8")}`;
  }
  const names = new Set();
  const re = /`([^`]+)`/g;
  let m;
  while ((m = re.exec(text))) {
    const raw = m[1];
    for (const part of raw.split(/[#.\s/,()<>]+/)) {
      if (/^[A-Z][A-Za-z0-9_]*$/.test(part)) names.add(part);
    }
  }
  return names;
}

/* ---- Plan 5 S1：Fabric 1.21.11 配方签名门禁（反编译实测，结论逐条落在 fabric/1.21.11/.cursor/rules/07-datagen.mdc） ---- */
const RECIPE_NEEDLES = [
  { re: /buildRecipes\s*\(\s*RecipeOutput/, why: "1.21.11 buildRecipes 无参且在 FabricRecipeProvider 返回的 vanilla 生成器上" },
  { re: /void\s+generate\s*\(\s*RecipeExporter/, why: "FabricRecipeProvider 无 generate(RecipeExporter) 覆写，抽象工厂是 getRecipeGenerator(...)" },
  { re: /(Shaped|Shapeless)RecipeJsonBuilder\s*\.\s*create\s*\(\s*RecipeCategory/, why: "create 首参必需 RegistryEntryLookup<Item>" },
  { re: /FabricRecipeProvider\s*\.\s*createRecipeProvider\s*\(/, why: "无静态 createRecipeProvider 工厂，addProvider 直接传构造引用" },
  { re: /\.offerTo\s*\(\s*[A-Za-z_]\w*\s*\)\s*[.;]/, why: "offerTo 只有 (RecipeExporter, String) 与 (RecipeExporter, RegistryKey) 两参形态" },
];
const RECIPE_ROOT = join(repoRoot, "fabric", "1.21.11");

function collectRecipeDocs(dir, out) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (ent.name.startsWith(".") && ent.name !== ".cursor") continue;
      collectRecipeDocs(join(dir, ent.name), out);
      continue;
    }
    if (!/\.(md|mdc)$/i.test(ent.name)) continue;
    out.push(join(dir, ent.name));
  }
  return out;
}

function lintRecipeDocs() {
  if (!existsSync(RECIPE_ROOT)) return { errors: [], scanned: 0 };
  const errors = [];
  const files2 = collectRecipeDocs(RECIPE_ROOT, []);
  for (const abs of files2) {
    const rel = relative(repoRoot, abs).replace(/\\/g, "/");
    for (const block of extractCodeBlocks(readFileSync(abs, "utf8"))) {
      for (const needle of RECIPE_NEEDLES) {
        const hit = block.text.match(needle.re);
        if (hit) errors.push(`${rel}: 1.21.11 不存在的配方写法 ${hit[0]} — ${needle.why}`);
      }
    }
  }
  return { errors, scanned: files2.length };
}

function lintFile(rel) {
  const abs = isAbsolute(rel) ? rel : join(repoRoot, rel.replace(/\\/g, "/"));
  if (!existsSync(abs)) return [`MISSING ${rel}`];
  const md = readFileSync(abs, "utf8");
  const errors = [];
  const old = OLD.test(rel.replace(/\\/g, "/"));
  const table = old ? loadVerifiedNames(abs) : null;
  for (const block of extractCodeBlocks(md)) {
    const nearby = sentencesAround(md, block.start, block.end);
    const exempt = EXEMPT.test(nearby);
    if (old) {
      for (const bad of BLACKLIST) {
        if (block.text.includes(bad)) errors.push(`${rel}: blacklist ${bad}`);
      }
    }
    if (exempt) continue;
    if (old && table) {
      for (const id of pascalIds(block.text)) {
        if (!table.has(id)) errors.push(`${rel}: 表外类名 ${id}`);
      }
    }
    const JAVA_KW = new Set(["if", "for", "while", "switch", "catch", "synchronized", "return", "super"]);
    const FABRIC_METHODS = new Set(["onInitialize", "onInitializeClient"]);
    for (const meth of methodCalls(block.text)) {
      if (JAVA_KW.has(meth)) continue;
      if (old && FABRIC_METHODS.has(meth)) errors.push(`${rel}: blacklist method ${meth}()`);
    }
  }
  if (old) {
    for (const bad of BLACKLIST) {
      if (new RegExp(`\`\`\`[\\s\\S]*${bad}[\\s\\S]*\`\`\``).test(md) === false && md.includes(bad)) {
        /* prose mention of blacklist is fail only in code blocks — already handled */
      }
    }
  }
  return errors;
}

const files = existsSync(listPath)
  ? readFileSync(listPath, "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
  : [];

const all = [];
for (const f of files) all.push(...lintFile(f));
const recipe = lintRecipeDocs();
all.push(...recipe.errors);
if (all.length) {
  console.error(all.join("\n"));
  process.exit(1);
}
console.log(`lint-skill-verified-api: ok (${files.length} files + ${recipe.scanned} 1.21.11 配方档)`);
