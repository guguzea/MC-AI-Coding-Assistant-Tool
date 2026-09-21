/**
 * 门：含围栏代码的 Skill 正文必须声明 frontmatter `mappings:` 键（非空）。
 * 依据：根 AGENTS.md「必须确认项目的 mappings 配置」+ 2026-09-20 用户裁定③
 *      「任何含 fenced code 的 skill 文件必须声明 mappings 键」。
 * 判据纯本地、无外部数据：只看源稿 .cursor/skills/（投影件由 assert-skill-mirrors 管）。
 * 用法：node assert-skill-mappings-key.mjs [--root=<repo>] [--selftest]
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const argv = process.argv.slice(2);
function argVal(name) {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
}
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(argVal("root") || path.join(HERE, "..", ".."));
const SELFTEST = argv.includes("--selftest");

const PLATFORMS = ["fabric", "forge", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock"];

function skillFiles(root) {
  const out = [];
  for (const pf of PLATFORMS) {
    const base = path.join(root, pf);
    if (!fs.existsSync(base)) continue;
    for (const v of fs.readdirSync(base, { withFileTypes: true })) {
      if (!v.isDirectory() || !/^\d/.test(v.name)) continue;
      const d = path.join(base, v.name, ".cursor", "skills");
      if (!fs.existsSync(d)) continue;
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (e.isDirectory()) {
          const f = path.join(d, e.name, "SKILL.md");
          if (fs.existsSync(f)) out.push(path.relative(root, f).replace(/\\/g, "/"));
        } else if (e.isFile() && e.name.endsWith(".md")) {
          out.push(path.relative(root, path.join(d, e.name)).replace(/\\/g, "/"));
        }
      }
    }
  }
  return out;
}

function hasFencedCode(body) {
  const lines = body.split(/\r?\n/);
  let fence = false;
  for (const l of lines) {
    if (/^\s{0,3}```/.test(l)) {
      if (!fence) { fence = true; continue; }
      return true;
      }
  }
  void fence;
  return false;
}

function frontmatter(text) {
  const s = text.replace(/^/, "");
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(s);
  return m ? m[1] : null;
}

function mappingValue(fm) {
  const m = /^mappings:\s*(.*)$/m.exec(fm);
  if (!m) return null;
  const v = m[1].trim().replace(/^["']|["']$/g, "");
  return v === "" ? "" : v;
}

function altValue(fm) {
  const m = /^mappings_alt:\s*(.*)$/m.exec(fm);
  if (!m) return null;
  const v = m[1].trim().replace(/^["']|["']$/g, "");
  return v === "" ? "" : v;
}

const DISCLOSE_MARK = /^### ⚠️ 映射口径/;

/** 返回披露块信息：有没有块、块里的对照行（含列数）。未核实行（右列不是反引号名）不计。 */
function disclosureOf(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => DISCLOSE_MARK.test(l));
  if (start < 0) return { hasMark: false, rows: [] };
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^## /.test(lines[i]) || /^### /.test(lines[i])) { end = i; break; }
  }
  const rows = [];
  for (let i = start; i < end; i++) {
    const l = lines[i];
    if (!/^\|\s*`/.test(l)) continue;
    const cells = l.split("|").slice(1, -1).map((s) => s.trim());
    if (cells.length < 2) continue;
    if (!/^`[A-Za-z][A-Za-z0-9_]*`$/.test(cells[0])) continue;
    if (!/^`[^`]+`$/.test(cells[1])) continue;
    rows.push({ at: i + 1, cells });
  }
  return { hasMark: true, rows };
}

function scan(root) {
  const bad = [];
  let fenced = 0;
  let total = 0;
  let withAlt = 0;
  let rowsChecked = 0;
  for (const rel of skillFiles(root)) {
    total++;
    const text = fs.readFileSync(path.join(root, rel), "utf8");
    const fm = frontmatter(text);
    const body = fm === null ? text : text.slice(fm.length + 6);
    const alt = fm === null ? null : altValue(fm);
    const dis = disclosureOf(text);
    rowsChecked += dis.rows.length;
    if (alt !== null) {
      withAlt++;
      if (alt === "") bad.push(`${rel}: mappings_alt 为空值`);
      if (!dis.hasMark) bad.push(`${rel}: 声明了 mappings_alt 但正文没有「### ⚠️ 映射口径」披露块`);
      else if (!dis.rows.length) bad.push(`${rel}: 声明了 mappings_alt 但披露块里没有对照行`);
    } else if (dis.rows.length) {
      bad.push(`${rel}: 披露块有 ${dis.rows.length} 行对照却未声明 mappings_alt（工具链无从识别）`);
    }
    for (const r of dis.rows) {
      if (r.cells.length !== 4) {
        bad.push(`${rel}:L${r.at} 对照行须四列「mojmap | Yarn | 适用版本 | 依据」，实际 ${r.cells.length} 列`);
      }
    }
    if (!hasFencedCode(body)) continue;
    fenced++;
    if (fm === null) { bad.push(`${rel}: 无 frontmatter，却有围栏代码`); continue; }
    const v = mappingValue(fm);
    if (v === null) bad.push(`${rel}: 有围栏代码但缺 mappings 键`);
    else if (v === "") bad.push(`${rel}: mappings 键为空值`);
  }
  return { bad, fenced, total, withAlt, rowsChecked };
}

if (SELFTEST) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mappings-key-"));
  let fails = 0;
  const put = (rel, content) => {
    const abs = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, "utf8");
  };
  const FM_OK = "---\nname: mc-a\ndescription: d\nplatform: fabric\nversion: \"1.20.1\"\nmappings: yarn\n---\n\n# a\n\n```java\nint x = 1;\n```\n";
  const FM_NO_KEY = "---\nname: mc-a\ndescription: d\nplatform: fabric\nversion: \"1.20.1\"\n---\n\n# a\n\n```java\nint x = 1;\n```\n";
  const FM_EMPTY_KEY = "---\nname: mc-a\nmappings:\n---\n\n# a\n\n```json\n{}\n```\n";
  const NO_FENCE = "---\nname: mc-b\nplatform: fabric\n---\n\n# b\n\n正文里有 `inline` 但没有围栏。\n";
  const FENCE_LIKE_ONLY = "---\nname: mc-c\nplatform: fabric\n---\n\n# c\n\n```\n未闭合的假围栏\n";
  const BLOCK_OK =
    "---\nname: mc-d\nplatform: fabric\nversion: \"1.21.4\"\nmappings: yarn\nmappings_alt: mojmap\n---\n\n# d\n\n### ⚠️ 映射口径：本档语料是 mojmap\n\n| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |\n| --- | --- | --- | --- |\n| `GuiGraphics` | `DrawContext` | 1.20.1–1.21.11 | join（`net.minecraft.client.gui.DrawContext`） |\n\n- 说明行\n";
  const BLOCK_NO_ALT = BLOCK_OK.replace("mappings_alt: mojmap\n", "");
  const ALT_NO_BLOCK = BLOCK_OK.replace(/^### ⚠️ 映射口径[\s\S]*$/m, "## 其它\n\n正文。\n");
  const ROW_THREE_COL = BLOCK_OK.replace(
    "| `GuiGraphics` | `DrawContext` | 1.20.1–1.21.11 | join（`net.minecraft.client.gui.DrawContext`） |",
    "| `GuiGraphics` | `DrawContext` | join（`net.minecraft.client.gui.DrawContext`） |",
  );

  const cases = [
    { name: "有围栏 + 有键 → 绿", rel: "fabric/1.20.1/.cursor/skills/mc-a/SKILL.md", content: FM_OK, want: 0 },
    { name: "有围栏 + 缺键 → 红", rel: "fabric/1.20.1/.cursor/skills/mc-a/SKILL.md", content: FM_NO_KEY, want: 1 },
    { name: "有围栏 + 空值键 → 红", rel: "fabric/1.20.1/.cursor/skills/mc-a/SKILL.md", content: FM_EMPTY_KEY, want: 1 },
    { name: "无围栏 + 缺键 → 绿（门只管有代码的）", rel: "fabric/1.20.1/.cursor/skills/mc-a/SKILL.md", content: NO_FENCE, want: 0 },
    { name: "未闭合伪围栏 → 绿（不得凭半个 ``` 判红）", rel: "fabric/1.20.1/.cursor/skills/mc-a/SKILL.md", content: FENCE_LIKE_ONLY, want: 0 },
    { name: "扁平件同判（mc-a.md）", rel: "fabric/1.20.1/.cursor/skills/mc-a.md", content: FM_NO_KEY, want: 1 },
    { name: "alt + 四列对照块 → 绿", rel: "fabric/1.21.4/.cursor/skills/mc-d/SKILL.md", content: BLOCK_OK, want: 0 },
    { name: "有对照块但缺 alt → 红", rel: "fabric/1.21.4/.cursor/skills/mc-d/SKILL.md", content: BLOCK_NO_ALT, want: 1 },
    { name: "声明 alt 但无披露块 → 红", rel: "fabric/1.21.4/.cursor/skills/mc-d/SKILL.md", content: ALT_NO_BLOCK, want: 1 },
    { name: "对照行少一列（无适用版本）→ 红", rel: "fabric/1.21.4/.cursor/skills/mc-d/SKILL.md", content: ROW_THREE_COL, want: 1 },
  ];
  for (const c of cases) {
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.mkdirSync(tmp, { recursive: true });
    put(c.rel, c.content);
    const r = scan(tmp);
    const ok = r.bad.length === c.want;
    if (!ok) fails++;
    console.log(`${ok ? "PASS" : "FAIL"}  ${c.name}  实际红=${r.bad.length} 期望=${c.want}`);
    if (!ok) console.log("      " + r.bad.join("\n      "));
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(fails ? `selftest FAILED（${fails}/${cases.length}）` : `selftest OK（${cases.length}/${cases.length}）`);
  process.exit(fails ? 1 : 0);
}

const res = scan(ROOT);
if (res.bad.length) {
  console.error(`assert-skill-mappings-key: ${res.bad.length} 件违规（共扫 ${res.total} 件，含围栏代码 ${res.fenced} 件）`);
  for (const b of res.bad.slice(0, 60)) console.error("  " + b);
  if (res.bad.length > 60) console.error(`  … +${res.bad.length - 60} more`);
  process.exit(1);
}
console.log(`assert-skill-mappings-key: ok（${res.total} 件 Skill 源稿，含围栏代码 ${res.fenced} 件均已声明非空 mappings 键；声明 mappings_alt 的 ${res.withAlt} 件均有披露块与对照行，对照行共 ${res.rowsChecked} 行皆四列）`);
