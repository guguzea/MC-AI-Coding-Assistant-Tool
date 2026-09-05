#!/usr/bin/env node
/**
 * ⚠ 一次性改写器：已执行过，勿再跑（会覆盖 library-catalog.ts 的 supportedVersions / officialUrls）。
 * enhance-catalog.mjs — ①⑤：给 library-catalog.ts 每条目加 supportedVersions（从 verifiedApi 键推导）
 * + officialUrls 填充（从对应短文提取官方链接）。保留 verifiedApi 与全部现有字段。
 * 行级处理（状态机定位条目闭合行），无坐标漂移风险。
 */
import { readFileSync, existsSync } from "fs";
import { emit } from "../_lib/write-guard.mjs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG = join(__dirname, "..", "..", "mcp-server", "src", "diagnostics", "library-catalog.ts");
const AUTH_DIR = join(__dirname, "..", "..", "community_knowledge", "authored");

const text = readFileSync(CATALOG, "utf8");

// 解析每个条目的 verifiedApi 键集（id → 键列表）；结构扫描，不依赖缩进与行尾
function parseEntryKeys(src) {
  const map = new Map();
  const hits = [];
  const reId = /id:\s*"([^"]+)"/g;
  let m;
  while ((m = reId.exec(src)) !== null) hits.push({ id: m[1], at: m.index });
  for (let n = 0; n < hits.length; n++) {
    const seg = src.slice(hits[n].at, n + 1 < hits.length ? hits[n + 1].at : src.length);
    const keys = [];
    const vaRel = seg.indexOf("verifiedApi:");
    if (vaRel !== -1) {
      let depth = 0, open = -1, inStr = false, i = vaRel + "verifiedApi:".length;
      for (; i < seg.length; i++) {
        const c = seg[i];
        if (inStr) { if (c === '"' && seg[i - 1] !== "\\") inStr = false; continue; }
        if (c === '"') { inStr = true; continue; }
        if (c === "{") { if (open < 0) open = i; depth++; }
        else if (c === "}") { depth--; if (depth === 0) break; }
      }
      if (open >= 0 && depth === 0) {
        for (const k of seg.slice(open + 1, i).matchAll(/^\s*"([^"]+\/[^"]+)"\s*:/gm)) keys.push(k[1]);
      }
    }
    map.set(hits[n].id, keys);
  }
  if (map.size === 0) throw new Error("enhance-catalog: catalog 未解析出任何条目（结构不符），拒绝静默 no-op");
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
const versionsFor = (id) => [...new Set((keyMap.get(id) ?? []).map((k) => k.split("/")[0]))];

/** 该行的花括号净增量（跳过字符串字面量，避免 notes 里的 } 干扰层级） */
function braceDelta(line) {
  let d = 0, inStr = false;
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (inStr) { if (c === '"' && line[j - 1] !== "\\") inStr = false; continue; }
    if (c === '"') { inStr = true; continue; }
    if (c === "{") d++;
    else if (c === "}") d--;
  }
  return d;
}

/** 从 startIdx 行做方括号平衡扫描，支持多行数组；未闭合返回 null */
function arraySpan(linesArr, startIdx) {
  const head = linesArr[startIdx];
  const hm = head.match(/^(\s*)supportedVersions:\s*/);
  if (!hm) return null;
  let depth = 0, inStr = false, text = "";
  for (let i = startIdx; i < linesArr.length; i++) {
    const ln = i === startIdx ? head.slice(hm[0].length) : linesArr[i];
    for (let j = 0; j < ln.length; j++) {
      const c = ln[j];
      if (inStr) { text += c; if (c === '"' && ln[j - 1] !== "\\") inStr = false; continue; }
      if (c === '"') { inStr = true; text += c; continue; }
      if (c === "[") depth++;
      else if (c === "]") { depth--; if (depth === 0) return { text: `${text}]`, end: i }; }
      text += c;
    }
    text += "\n";
  }
  return null;
}

const lines = text.split("\n");
const out = [];
let currentId = null;
let fieldIndent = "    ";
let currentHasSv = false;
let braceDepth = 0;
let entryCount = 0;
let inserted = 0;
let urlsFilled = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // 跟踪当前条目 id（缩进即该条目字段的落地缩进）
  const idM = line.match(/^(\s*)id:\s*"([^"]+)"\s*,?\s*$/);
  if (idM) { currentId = idM[2]; fieldIndent = idM[1]; currentHasSv = false; entryCount++; }

  // supportedVersions：括号平衡跨度（多行数组同样算「字段已存在」，不再重复插键）
  if (/^\s*supportedVersions:\s*\[/.test(line)) {
    const span = arraySpan(lines, i);
    if (!span) throw new Error(`enhance-catalog: 第 ${i + 1} 行的 supportedVersions 数组括号未闭合，拒绝改写`);
    if (span.text.replace(/\s+/g, "") === "[]" && currentId) {
      out.push(`${fieldIndent}supportedVersions: ${JSON.stringify(versionsFor(currentId))},`);
      inserted++;
    } else {
      for (let k = i; k <= span.end; k++) out.push(lines[k]);
    }
    for (let k = i; k <= span.end; k++) braceDepth += braceDelta(lines[k]);
    currentHasSv = true;
    i = span.end;
    continue;
  }

  // 条目闭合行 = 花括号层级由 1 回到 0 的那行（catalog 数组内的一级对象）
  const depthBefore = braceDepth;
  braceDepth += braceDelta(line);
  if (depthBefore === 1 && braceDepth === 0 && /^\s*\}/.test(line) && currentId && !currentHasSv) {
    out.push(`${fieldIndent}supportedVersions: ${JSON.stringify(versionsFor(currentId))},`);
    inserted++;
    currentHasSv = true;
  }

  // officialUrls 空数组填充
  if (/^\s*officialUrls:\s*\[\s*\],?\s*$/.test(line) && currentId) {
    const urls = githubUrls(currentId);
    if (urls.length > 0) {
      out.push(`${fieldIndent}officialUrls: ${JSON.stringify(urls)},`);
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

if (entryCount === 0) throw new Error("enhance-catalog: 未匹配到任何条目 id 行（结构不符），拒绝静默 no-op");
if (out.join("\n") === text) {
  console.log(`enhance-catalog: 无改动（${entryCount} 条目，supportedVersions / officialUrls 已就位）——幂等，未写盘`);
  process.exit(0);
}

emit(CATALOG, out.join("\n"));
console.log(`enhance-catalog: 条目 ${entryCount}，插入/替换 supportedVersions ${inserted} 条目，填充 officialUrls ${urlsFilled} 条目`);
