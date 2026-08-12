#!/usr/bin/env node
/**
 * merge-verified-api.mjs
 *
 * 把反编译验证结果 JSONL 合并进 mcp-server/src/diagnostics/library-catalog.ts 的 verifiedApi。
 *
 * - 平衡括号扫描定位每个条目的 verifiedApi 对象区间（思路复用
 *   build-library-catalog-from-authored.mjs 的 loadExistingVerifiedApi，但按精确偏移
 *   只替换 verifiedApi 内容，其余字段逐字节保留）
 * - 匹配：catalog 条目 modrinthSlug 按逗号拆分后包含结果 slug（兼容 JEI/EMI/REI 共享条目）
 * - 键 = "<gameVersion>/<loader>"，值 = { verifiedAt, packages, entrypoints, notes: "自动反编译提取" }
 * - 默认不覆盖已存在键（--force 才覆盖）；--dry-run 只打印差异不写盘
 * - 零依赖 Node ESM；中文日志
 *
 * 用法：
 *   node scripts/merge-verified-api.mjs
 *     --input temp/verified-api-results.jsonl   # 默认同路径
 *     --catalog mcp-server/src/diagnostics/library-catalog.ts
 *     --dry-run                                  # 只打印将变更，不写盘
 *     --force                                    # 覆盖已存在键（默认保留）
 *     --help
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const USAGE = `用法：
  node scripts/merge-verified-api.mjs [--input <jsonl>] [--catalog <ts>] [--dry-run] [--force] [--help]

参数：
  --input <path>    反编译结果 JSONL（默认 temp/verified-api-results.jsonl）
  --catalog <path>  library-catalog.ts 路径（默认 mcp-server/src/diagnostics/library-catalog.ts）
  --dry-run         只打印将变更，不写盘
  --force           覆盖已存在键（默认保留）
  --help            显示本帮助`;

function parseArgs(argv) {
  const opts = {
    input: "temp/verified-api-results.jsonl",
    catalog: "mcp-server/src/diagnostics/library-catalog.ts",
    dryRun: false,
    force: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const eq = a.indexOf("=");
    let key = a;
    let val = true;
    if (eq > 0) {
      key = a.slice(0, eq);
      val = a.slice(eq + 1);
    } else if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
      val = argv[++i];
    }
    switch (key) {
      case "--input":
        opts.input = String(val);
        break;
      case "--catalog":
        opts.catalog = String(val);
        break;
      case "--dry-run":
        opts.dryRun = true;
        break;
      case "--force":
        opts.force = true;
        break;
      case "--help":
        opts.help = true;
        break;
      default:
        console.error(`[merge-verified-api] 未知参数：${key}`);
        console.error(USAGE);
        process.exit(2);
    }
  }
  return opts;
}

/** 从 catalog 文本中按 id 定位每个条目及其 verifiedApi 对象区间（平衡括号扫描，容忍字符串内括号） */
function extractEntries(text) {
  const entries = new Map();
  const reId = /id:\s*"([^"]+)"/g;
  let m;
  while ((m = reId.exec(text)) !== null) {
    const id = m[1];
    const vmIdx = text.indexOf("verifiedApi:", m.index);
    if (vmIdx < 0) continue;
    const seg = text.slice(m.index, vmIdx);
    const sm = seg.match(/modrinthSlug:\s*"([^"]*)"/);
    const slug = sm ? sm[1] : "";
    // 从 verifiedApi: 之后做平衡大括号扫描
    let depth = 0;
    let inStr = false;
    let open = -1;
    let i = vmIdx + "verifiedApi:".length;
    for (; i < text.length; i++) {
      const c = text[i];
      if (inStr) {
        if (c === '"' && text[i - 1] !== "\\") inStr = false;
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
    if (open < 0 || depth !== 0) {
      console.warn(`[merge-verified-api] 警告：条目 ${id} 的 verifiedApi 区间解析失败，跳过`);
      reId.lastIndex = vmIdx + "verifiedApi:".length;
      continue;
    }
    // 找到该行起始的缩进（用于重排缩进）
    let lineStart = text.lastIndexOf("\n", open) + 1;
    const closeIndent = text.slice(lineStart, open).match(/^\s*/)[0];
    entries.set(id, { id, slug, vaStart: open, vaEnd: i, closeIndent });
    reId.lastIndex = i + 1;
  }
  return entries;
}

/** 已有键存在性检查（复合键含 "/"，不会与 verifiedAt/packages 等内部键冲突） */
function keyExists(entry, rawVa, key) {
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`"${esc}"\\s*:`).test(rawVa);
}

/** TS 对象字面量 → JSON（引号键 + 单引号归一 + 容忍尾逗号，与 build-library-catalog-from-authored.mjs 同思路）；失败返回 null */
function parseVa(raw) {
  let json = raw
    .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
    .replace(/'/g, '"');
  json = json.replace(/,(\s*[}\]])/g, "$1"); // 容忍 TS 尾逗号
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function buildValue(r) {
  return {
    verifiedAt: r.verifiedAt ?? currentMonth(),
    packages: Array.isArray(r.packages) ? r.packages : [],
    entrypoints: Array.isArray(r.entrypoints) ? r.entrypoints : [],
    notes: "自动反编译提取",
  };
}

function readResults(file) {
  const out = { lines: [], bad: 0, failed: 0 };
  if (!existsSync(file)) {
    console.warn(`[merge-verified-api] 警告：输入 ${file} 不存在，按空结果处理`);
    return out;
  }
  let text = readFileSync(file, "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // 容忍 UTF-8 BOM
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    let obj;
    try {
      obj = JSON.parse(line);
    } catch {
      out.bad++;
      continue;
    }
    if (obj.status !== "success") {
      out.failed++;
      continue;
    }
    out.lines.push(obj);
  }
  return out;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(USAGE);
    process.exit(0);
  }

  const inputFile = resolve(process.cwd(), opts.input);
  const catalogFile = resolve(process.cwd(), opts.catalog);

  if (!existsSync(catalogFile)) {
    console.error(`[merge-verified-api] 错误：catalog 不存在：${catalogFile}`);
    process.exit(1);
  }

  const text = readFileSync(catalogFile, "utf8");
  const entries = extractEntries(text);

  // slug（逗号拆分）→ 条目；同一 slug 命中多条时取第一条
  const entryBySlug = new Map();
  for (const e of entries.values()) {
    if (!e.slug) continue;
    for (const s of e.slug.split(",").map((x) => x.trim()).filter(Boolean)) {
      if (!entryBySlug.has(s)) entryBySlug.set(s, e);
    }
  }

  const results = readResults(inputFile);
  const planned = new Map(); // id -> { entry, additions: Map, addNew, overwrote, skipped, dups }
  let matched = 0;
  let unmatched = 0;

  for (const r of results.lines) {
    const entry = r.slug ? entryBySlug.get(r.slug) : undefined;
    const key = r.gameVersion && r.loader ? `${r.gameVersion}/${r.loader}` : "";
    if (!entry || !key) {
      unmatched++;
      continue;
    }
    matched++;
    let p = planned.get(entry.id);
    if (!p) {
      p = { entry, additions: new Map(), addNew: 0, overwrote: 0, skipped: 0, dups: 0 };
      planned.set(entry.id, p);
    }
    if (p.additions.has(key)) {
      p.dups++;
      continue;
    }
    const rawVa = text.slice(entry.vaStart, entry.vaEnd + 1);
    if (keyExists(entry, rawVa, key)) {
      if (!opts.force) {
        p.skipped++;
        continue;
      }
      p.overwrote++;
    } else {
      p.addNew++;
    }
    p.additions.set(key, buildValue(r));
  }

  // 生成编辑：重排缩进后整体替换 verifiedApi 区间（按 start 降序应用）
  const edits = [];
  for (const p of planned.values()) {
    if (p.additions.size === 0) continue;
    const rawVa = text.slice(p.entry.vaStart, p.entry.vaEnd + 1);
    const parsed = parseVa(rawVa);
    if (parsed) {
      for (const [k, v] of p.additions) parsed[k] = v;
      const json = JSON.stringify(parsed, null, 2);
      const lines = json.split("\n");
      const reindented = lines
        .map((ln, idx) => (idx === 0 ? ln : p.entry.closeIndent + ln))
        .join("\n");
      edits.push({ start: p.entry.vaStart, end: p.entry.vaEnd + 1, text: reindented });
    } else {
      // 无法解析旧值：改为在闭合括号前逐键插入，逐字节保留原内容
      const keyIndent = p.entry.closeIndent + "  ";
      const parts = [];
      for (const [k, v] of p.additions) {
        parts.push(`${keyIndent}"${k}": ${JSON.stringify(v, null, 2).split("\n").map((ln, idx) => (idx === 0 ? ln : keyIndent + ln)).join("\n")},`);
      }
      edits.push({
        start: p.entry.vaEnd,
        end: p.entry.vaEnd,
        text: "\n" + parts.join("\n") + "\n" + p.entry.closeIndent,
      });
      console.warn(`[merge-verified-api] 警告：条目 ${p.entry.id} 旧 verifiedApi 无法解析，按原样插入新键`);
    }
  }
  edits.sort((a, b) => b.start - a.start);

  // 统计
  let keysAdded = 0;
  let keysSkipped = 0;
  let keysOverwritten = 0;
  for (const p of planned.values()) {
    keysAdded += p.addNew;
    keysSkipped += p.skipped;
    keysOverwritten += p.overwrote;
  }
  const entriesUpdated = planned.size;

  // 输出
  console.log(`=== verifiedApi 合并 ===`);
  console.log(`输入：${inputFile}`);
  console.log(`catalog：${catalogFile}`);
  console.log(`结果行：共 ${results.lines.length + results.bad + results.failed} 行（成功 ${results.lines.length} / 失败 ${results.failed} / 坏行 ${results.bad}）`);
  console.log(`匹配：${matched} 行 / 未匹配：${unmatched} 行`);
  console.log(`更新条目数：${entriesUpdated}`);
  console.log(`新增键：${keysAdded} / 跳过键：${keysSkipped} / 覆盖键：${keysOverwritten}`);

  if (opts.dryRun) {
    for (const p of planned.values()) {
      const keys = [...p.additions.keys()].join(", ");
      console.log(`  [dry-run] ${p.entry.id}：+${p.additions.size} 键（${keys}）${p.skipped ? `；跳过 ${p.skipped} 个已存在键` : ""}${p.overwrote ? `；覆盖 ${p.overwrote} 个已存在键` : ""}`);
    }
    console.log(`（dry-run，未写盘）`);
    return;
  }

  if (edits.length === 0) {
    console.log(`无变更，未写盘`);
    return;
  }

  let out = text;
  for (const ed of edits) {
    out = out.slice(0, ed.start) + ed.text + out.slice(ed.end);
  }
  try {
    writeFileSync(catalogFile, out, "utf8");
  } catch (e) {
    console.error(`[merge-verified-api] 写入失败：${catalogFile}（${e.message}）`);
    process.exit(1);
  }
  console.log(`已写入：${catalogFile}`);
}

main();
