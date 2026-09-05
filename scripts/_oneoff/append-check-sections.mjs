#!/usr/bin/env node
/**
 * ⚠ 一次性改写器：已执行过，勿再跑（会覆盖 community_knowledge/authored 核对节）。
 * 补齐缺失的短文核对节（从 catalog.ts verifiedApi 生成）
 */
import { readFileSync, existsSync } from "fs";
import { emit, wantWrite } from "../_lib/write-guard.mjs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CATALOG = join(ROOT, "mcp-server/src/diagnostics/library-catalog.ts");
const AUTH = join(ROOT, "community_knowledge/authored");
const text = readFileSync(CATALOG, "utf8");

// 解析条目：id → { keys: ["1.20.1/fabric",...], packagesByKey, entrypointsByKey }
// 结构扫描（平衡括号 + 字符串感知），不依赖缩进与行尾
/** 从 from 起第一个平衡 { } 区间的内部文本；失败返回 null */
function objectBody(s, from) {
  let depth = 0, open = -1, inStr = false;
  for (let i = from; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (c === '"' && s[i - 1] !== "\\") inStr = false; continue; }
    if (c === '"') { inStr = true; continue; }
    if (c === "{") { if (open < 0) open = i; depth++; }
    else if (c === "}") { depth--; if (depth === 0) return s.slice(open + 1, i); }
  }
  return null;
}

/** 从 from 起第一个平衡 [ ] 区间内的字符串元素 */
function arrayStrings(s, from) {
  let depth = 0, open = -1, inStr = false;
  for (let i = from; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (c === '"' && s[i - 1] !== "\\") inStr = false; continue; }
    if (c === '"') { inStr = true; continue; }
    if (c === "[") { if (open < 0) open = i; depth++; }
    else if (c === "]") { depth--; if (depth === 0) return [...s.slice(open + 1, i).matchAll(/"([^"]*)"/g)].map((x) => x[1]); }
  }
  return [];
}

function parseCatalogEntries(src) {
  const entries = new Map();
  const hits = [];
  const reId = /id:\s*"([^"]+)"/g;
  let m;
  while ((m = reId.exec(src)) !== null) hits.push({ id: m[1], at: m.index });
  for (let n = 0; n < hits.length; n++) {
    const seg = src.slice(hits[n].at, n + 1 < hits.length ? hits[n + 1].at : src.length);
    const keys = [];
    const info = new Map();
    const vaRel = seg.indexOf("verifiedApi:");
    const body = vaRel === -1 ? null : objectBody(seg, vaRel + "verifiedApi:".length);
    if (body) {
      const km = /"([^"]+\/[^"]+)"\s*:\s*\{/g;
      let k;
      while ((k = km.exec(body)) !== null) {
        const inner = objectBody(body, k.index + k[0].length - 1);
        if (inner === null) continue;
        const pkRel = inner.indexOf('"packages"');
        const epRel = inner.indexOf('"entrypoints"');
        keys.push(k[1]);
        info.set(k[1], {
          pkgs: pkRel === -1 ? [] : [...new Set(arrayStrings(inner, pkRel))].filter((p) => p !== "licenses"),
          eps: epRel === -1 ? [] : [...new Set(arrayStrings(inner, epRel))],
        });
      }
    }
    entries.set(hits[n].id, { keys, info });
  }
  if (entries.size === 0) throw new Error("append-check-sections: catalog 未解析出任何条目（结构不符），拒绝静默 no-op");
  return entries;
}

const entries = parseCatalogEntries(text);

const missing = ["lib-config-legacy", "lib-libgui", "lib-pehkui", "lib-player-ability-lib", "lib-playeranimator", "lib-polymer", "lib-resourceful", "lib-satin", "lib-server-translations", "lib-spruceui-obsidianui", "lib-terrablender", "lib-text-placeholder-api", "lib-trinkets", "lib-yacl"];

// 名单是审计快照，必须现场核一遍还缺谁，不能拿旧名单直接落盘
const pending = [];
for (const name of missing) {
  const p = join(AUTH, name + ".md");
  if (!existsSync(p)) { console.log("!! 短文缺失:", name); continue; }
  const content = readFileSync(p, "utf8");
  if (content.includes("## 核对")) { console.log("跳过(已有):", name); continue; }
  pending.push({ name, p, content });
}

if (wantWrite() && pending.length === 0) {
  throw new Error(`append-check-sections: 拒绝 --write——审计名单 ${missing.length} 项已全部落地，待补清单为空；此时再写只会用当前 catalog 快照覆盖短文。请把 missing 换成新的缺失项再跑。`);
}

let done = 0;
for (const { name, p, content } of pending) {
  const e = entries.get("authored/" + name);
  let next;
  if (!e || e.keys.length === 0) {
    next = content + "\n## 核对（2026-08 反编译验证）\n\n- ⚠️ 暂未反编译核对（catalog 无 verifiedApi）；细节以官方文档为准。\n";
  } else {
    // 代表键：优先 1.20.1，其次含 "26" 的最新，其次第一个
    const order = [...e.keys].sort((a, b) => {
      const score = (k) => (k.startsWith("1.20.1") ? 0 : k.startsWith("26.") ? 1 : k.startsWith("1.21.") ? 2 : 3);
      return score(a) - score(b);
    });
    const reps = [...new Set(order)].slice(0, 3);
    const lines = reps.map((key) => {
      const info = e.info.get(key) ?? { pkgs: [], eps: [] };
      const pkgTxt = info.pkgs.length ? info.pkgs.map((x) => `\`${x}\``).join("、") : "（无独立包）";
      const epTxt = info.eps.length ? `入口 ${info.eps[0]}` : "无 entrypoint";
      return `  - ${key}：顶层 API 包 ${pkgTxt}，${epTxt}`;
    });
    next = content + `\n## 核对（2026-08 反编译验证）\n\n- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：\n${lines.join("\n")}\n- 版本/包名详情见 \`mcp-server/src/diagnostics/library-catalog.ts\` 对应条目；细节仍以官方文档为准。\n`;
  }
  emit(p, next);
  done++;
}
console.log(`补齐完成: ${done} / 待补 ${pending.length} / 审计名单 ${missing.length}${pending.length === 0 ? "（名单已全部落地：幂等 no-op）" : ""}`);
