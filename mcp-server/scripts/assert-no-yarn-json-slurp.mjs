/**
 * Static gate: runtime src must never slurp yarn-mappings.json.
 *
 * MC_SKILL_YARN_SLURP_GATE_SRC：只给「证明本 gate 真的会失败」的自检用——把被扫目录换成
 * 一个假 src（里面是被改坏的副本）。真实跑不设它。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const testSrc = process.env.MC_SKILL_YARN_SLURP_GATE_SRC;
const srcRoot = testSrc ? path.resolve(testSrc) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

const FORBIDDEN = [
  /yarn-mappings\.json/,
  // 只钉 JSON：本 gate 防的是把 data/fabric_*/mappings/yarn-mappings.json（实测 25.8MB →
  // 解析成对象再翻几倍）读进运行时。反编译链路里 readFileSync 一个 yarn **jar**（实测
  // mergedv2 1.3MB）是正常且必要的，不在禁止范围内。
  /readFileSync\s*\([^)]*yarn[^)]*json/i,
  /readFile\s*\([^)]*yarn-mappings/i,
  /JSON\.parse\s*\([^)]*yarn/i,
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|js|mjs)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const files = walk(srcRoot);
const hits = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  // Allow comments that mention the ban / path for diagnostics only if they don't load
  for (const re of FORBIDDEN) {
    if (!re.test(text)) continue;
    // Allow yarn-sqlite.ts to mention the filename in error strings / comments
    // but not call readFile* on it.
    if (file.endsWith(`${path.sep}yarn-sqlite.ts`) || file.endsWith(`${path.sep}yarn-sqlite.js`)) {
      if (/readFileSync|readFile\s*\(|JSON\.parse/.test(text) && /yarn-mappings\.json/.test(text)) {
        // error message strings may mention the json path — ensure no actual load API near it
        const loadCall = /(?:readFileSync|readFile|JSON\.parse)\s*\(\s*[^)]*yarn-mappings\.json/;
        if (loadCall.test(text)) hits.push({ file, re: String(re) });
      }
      continue;
    }
    hits.push({ file, re: String(re) });
  }
}

if (hits.length) {
  console.error("FORBIDDEN yarn-mappings.json slurp patterns found:");
  for (const h of hits) console.error(`  ${h.file} :: ${h.re}`);
  process.exit(1);
}

console.log(`assert-no-yarn-json-slurp: ok (${files.length} files scanned)`);
