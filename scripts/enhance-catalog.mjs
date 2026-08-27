// enhance-catalog.mjs — ①⑤：给 library-catalog.ts 每条目加 supportedVersions（从 verifiedApi 键推导）
// + officialUrls 填充（从对应短文提取官方链接）。保留 verifiedApi 与全部现有字段。
// 行级处理（状态机定位条目闭合行），无坐标漂移风险。
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG = join(__dirname, "..", "mcp-server", "src", "diagnostics", "library-catalog.ts");
const AUTH_DIR = join(__dirname, "..", "community_knowledge", "authored");

const text = readFileSync(CATALOG, "utf8");

// 解析每个条目的 verifiedApi 键集（id → 键列表）
function parseEntryKeys(src) {
  const map = new Map();
  const re = /id: "([^"]+)",([\s\S]*?)(?=\n  \},|\n\];)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const seg = m[2];
    const vaM = seg.match(/verifiedApi: (\{[\s\S]*?\n    \})/);
    const keys = [];
    if (vaM) {
      const km = vaM[1].match(/"([^"]+\/[^"]+)":/g) || [];
      for (const k of km) keys.push(k.replace(/^"|":$/g, ""));
    }
    map.set(m[1], keys);
  }
  return map;
}

function githubUrls(docId) {
  const name = docId.replace(/^authored\//, "") + ".md";
  const p = join(AUTH_DIR, name);
  if (!existsSync(p)) return [];
  const body = readFileSync(p, "utf8");
  const re = /https?:\/\/[^\s)\]]+/g;
  const cleaned = [];
  for (const raw of body.match(re) ?? []) {
    const u = raw.replace(/[）\u3002].*$/, "");
    try {
      const parsed = new URL(u);
      if (!/github\.com|docs\.|curseforge\.com|modrinth\.com/.test(parsed.hostname)) continue;
      cleaned.push(parsed.href);
    } catch {
      /* skip */
    }
  }
  return [...new Set(cleaned)].slice(0, 3);
}

const keyMap = parseEntryKeys(text);
const lines = text.split("\n");
const out = [];
let currentId = null;
let currentHasSv = false;
let inserted = 0;
let urlsFilled = 0;

for (const line of lines) {
  // 跟踪当前条目 id
  const idM = line.match(/^    id: "([^"]+)",\r?$/);
  if (idM) { currentId = idM[1]; currentHasSv = false; }

  // supportedVersions 行处理：空数组 [] → 替换为有值；非空 → 原样并标记
  const svM = line.match(/^    supportedVersions: (\[[^\]]*\]),?\r?$/);
  if (svM && currentId) {
    if (svM[1] === "[]") {
      const versions = [...new Set((keyMap.get(currentId) ?? []).map((k) => k.split("/")[0]))];
      out.push(`    supportedVersions: ${JSON.stringify(versions)},`);
      inserted++;
    } else {
      out.push(line);
    }
    currentHasSv = true; // 已输出该行，闭合行不再插入
    continue;
  }

  // 条目闭合行：2 空格缩进的 "}," 或 "}"（verifiedApi 内部闭合为 4+ 空格，不会误判）
  if (/^  \},?\r?$/.test(line) && currentId) {
    if (!currentHasSv) {
      const versions = [...new Set((keyMap.get(currentId) ?? []).map((k) => k.split("/")[0]))];
      out.push(`    supportedVersions: ${JSON.stringify(versions)},`);
      inserted++;
    }
    out.push(line);
    continue;
  }

  // officialUrls 空数组填充
  const ouM = line.match(/^    officialUrls: \[\],?\r?$/);
  if (ouM && currentId) {
    const urls = githubUrls(currentId);
    if (urls.length > 0) {
      out.push(`    officialUrls: ${JSON.stringify(urls)},`);
      urlsFilled++;
      continue;
    }
  }

  // 接口行加 supportedVersions 字段（只改一次）
  if (line.includes("verifiedApi: Record<string, unknown>;") && !line.includes("supportedVersions")) {
    out.push(line.replace("verifiedApi: Record<string, unknown>; }", 'verifiedApi: Record<string, unknown>; supportedVersions: string[]; }'));
    continue;
  }

  out.push(line);
}

writeFileSync(CATALOG, out.join("\n"), "utf8");
console.log(`enhance-catalog: 插入 supportedVersions ${inserted} 条目，填充 officialUrls ${urlsFilled} 条目`);
