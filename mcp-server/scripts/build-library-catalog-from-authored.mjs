#!/usr/bin/env node
/**
 * build-library-catalog-from-authored.mjs
 *
 * 扫描 community_knowledge/authored/ 下 lib-*.md 与 library-integration*.md 的 frontmatter，
 * 生成 src/diagnostics/library-catalog.ts（library 目录初稿）。
 *
 * - 解析 frontmatter（风格对齐 scripts/build-community-index.mjs）：容忍缺失字段，缺失给默认值
 * - 无 frontmatter 的 stub（如 lib-cloth-config.md）：用文件基名做 id，其余字段空默认
 * - modIds 缺失 → 从文件名推断（lib-xxx → ["xxx"]）或 []
 * - verifiedApi 恒为 {} 初始（D 波次只 patch verifiedApi）；若旧生成文件已有 verifiedApi，
 *   按 id 合并保留，避免重跑丢数据
 * - 按 id 排序输出，2 空格缩进、双引号字符串
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUTH_DIR = join(__dirname, "..", "..", "community_knowledge", "authored");
const OUT_FILE = join(__dirname, "..", "src", "diagnostics", "library-catalog.ts");

const ROLE_VALUES = new Set(["api", "author_shared", "trap"]);

/** 与 build-community-index.mjs 相同的容错 frontmatter 解析 */
function parseFrontmatter(text) {
  if (!text.startsWith("---")) return { meta: {}, body: text };
  const end = text.indexOf("\n---", 3);
  if (end < 0) return { meta: {}, body: text };
  const raw = text.slice(3, end).trim();
  const body = text.slice(end + 4).replace(/^\r?\n/, "");
  const meta = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (v.startsWith("[") && v.endsWith("]")) {
      v = v
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      v = v.replace(/^["']|["']$/g, "");
    }
    meta[m[1]] = v;
  }
  return { meta, body };
}

/** 标量 → 字符串；null/undefined → "" */
function toStr(v) {
  if (v == null) return "";
  return String(v).replace(/^["']|["']$/g, "").trim();
}

/** 数组或逗号分隔字符串 → 去空字符串数组 */
function toArray(v) {
  if (v == null) return [];
  const arr = Array.isArray(v) ? v : String(v).split(",");
  return arr
    .map((s) => String(s).trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

/** modIds 缺失时从文件名推断：lib-geckolib → ["geckolib"]；其他 → [] */
function inferModIdsFromName(base) {
  if (base.startsWith("lib-")) {
    const rest = base.slice("lib-".length);
    if (rest) return [rest];
  }
  return [];
}

/**
 * 从既有生成文件按 id 提取 verifiedApi（平衡大括号扫描，容忍 JSON 注释/尾逗号）。
 * D 波次只 patch verifiedApi；重跑时保留旧值，解析失败按空处理。
 */
function loadExistingVerifiedApi() {
  const map = new Map();
  if (!existsSync(OUT_FILE)) return map;
  const text = readFileSync(OUT_FILE, "utf8");
  const blocks = text.split(/\},\s*\n\s*\{/);
  for (const blk of blocks) {
    const idMatch = blk.match(/id:\s*"([^"]+)"/);
    const vm = blk.match(/verifiedApi:/);
    if (!idMatch || !vm) continue;
    // 从 verifiedApi: 之后做平衡大括号扫描
    let depth = 0;
    let inStr = false;
    let i = vm.index + "verifiedApi:".length;
    let open = -1;
    for (; i < blk.length; i++) {
      const c = blk[i];
      if (inStr) {
        if (c === '"' && blk[i - 1] !== "\\") inStr = false;
        continue;
      }
      if (c === '"') {
        inStr = true;
        continue;
      }
      if (c === "{") {
        if (open < 0) open = i;
        depth++;
      } else if (c === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    if (open < 0 || depth !== 0) continue;
    const raw = blk.slice(open, i + 1);
    // TS 对象字面量 → JSON（引号键 + 单引号归一），解析失败则忽略该条
    const json = raw
      .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
      .replace(/'/g, '"');
    try {
      map.set(idMatch[1], JSON.parse(json));
    } catch {
      /* 该条 verifiedApi 无法解析 → 视为未 patch，用 {} */
    }
  }
  return map;
}

const entries = [];
let dirMissing = false;
if (existsSync(AUTH_DIR)) {
  const names = readdirSync(AUTH_DIR)
    .filter((n) => n.endsWith(".md") && (n.startsWith("lib-") || n.startsWith("library-integration")))
    .sort();
  for (const name of names) {
    const file = join(AUTH_DIR, name);
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch (e) {
      console.warn(`[build-library-catalog] 警告：无法读取 ${name}，跳过（${e.message}）`);
      continue;
    }
    const { meta } = parseFrontmatter(text);
    if (text.startsWith("---") && text.indexOf("\n---", 3) < 0) {
      console.warn(`[build-library-catalog] 警告：${name} frontmatter 未闭合，按无 frontmatter 处理`);
    }
    const base = name.replace(/\.md$/, "");
    const id = toStr(meta.id) || base;
    const modIds = toArray(meta.modIds);
    if (modIds.length === 0) modIds.push(...inferModIdsFromName(base));
    const roleRaw = toStr(meta.role);
    const role = ROLE_VALUES.has(roleRaw) ? roleRaw : "author_shared";
    const skillIdRaw = Array.isArray(meta.skillId) ? toStr(meta.skillId[0]) : toStr(meta.skillId);
    entries.push({
      id,
      modIds,
      loaders: toArray(meta.loaders),
      modrinthSlug: toStr(meta.modrinthSlug),
      role,
      communityDocId: id,
      skillId: skillIdRaw || undefined,
      officialUrls: toArray(meta.officialUrls),
      notes: toStr(meta.notes),
    });
  }
} else {
  dirMissing = true;
  console.warn(`[build-library-catalog] 警告：${AUTH_DIR} 不存在，生成空目录`);
}

entries.sort((a, b) => a.id.localeCompare(b.id));
const existingVerifiedApi = loadExistingVerifiedApi();

const lines = [];
lines.push("// 由 scripts/build-library-catalog-from-authored.mjs 自动生成，勿手改（D 波次只 patch verifiedApi）");
lines.push("export interface LibraryCatalogEntry { id: string; modIds: string[]; loaders: string[]; modrinthSlug: string; role: \"api\" | \"author_shared\" | \"trap\"; communityDocId: string; skillId?: string; officialUrls: string[]; notes: string; verifiedApi: Record<string, unknown>; }");
lines.push("export const LIBRARY_CATALOG: LibraryCatalogEntry[] = [");
for (const e of entries) {
  lines.push("  {");
  lines.push(`    id: ${JSON.stringify(e.id)},`);
  lines.push(`    modIds: ${JSON.stringify(e.modIds)},`);
  lines.push(`    loaders: ${JSON.stringify(e.loaders)},`);
  lines.push(`    modrinthSlug: ${JSON.stringify(e.modrinthSlug)},`);
  lines.push(`    role: ${JSON.stringify(e.role)},`);
  lines.push(`    communityDocId: ${JSON.stringify(e.communityDocId)},`);
  if (e.skillId) lines.push(`    skillId: ${JSON.stringify(e.skillId)},`);
  lines.push(`    officialUrls: ${JSON.stringify(e.officialUrls)},`);
  lines.push(`    notes: ${JSON.stringify(e.notes)},`);
  const va = existingVerifiedApi.get(e.id);
  const vaRaw = va && Object.keys(va).length > 0 ? JSON.stringify(va) : "{}";
  lines.push(`    verifiedApi: ${vaRaw},`);
  lines.push("  },");
}
lines.push("];");
lines.push("");

try {
  writeFileSync(OUT_FILE, lines.join("\n"), "utf8");
} catch (e) {
  console.error(`[build-library-catalog] 写入失败：${OUT_FILE}（${e.message}）`);
  process.exit(1);
}

const kept = [...existingVerifiedApi.entries()].filter(
  ([id, va]) => entries.some((e) => e.id === id) && Object.keys(va).length > 0
).length;
console.log(
  `[build-library-catalog] wrote ${entries.length} entries → ${OUT_FILE}` +
    (kept > 0 ? `（保留 ${kept} 条既有非空 verifiedApi）` : "") +
    (dirMissing ? "" : "")
);
