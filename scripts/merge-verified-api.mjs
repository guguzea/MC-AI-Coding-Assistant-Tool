#!/usr/bin/env node
/**
 * ⚠ 一次性改写器：已执行过，勿再跑（会写 library-catalog.ts 的 verifiedApi）。
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
  --dry-run         只打印将变更，不写盘（默认）
  --write           真正写盘
  --force           覆盖已存在键（默认保留）
  --help            显示本帮助`;

function parseArgs(argv) {
  const opts = {
    input: "temp/verified-api-results.jsonl",
    catalog: "mcp-server/src/diagnostics/library-catalog.ts",
    dryRun: true,
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
      case "--write":
        opts.dryRun = false;
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
    const saved = reId.lastIndex;
    const next = reId.exec(text);
    const searchEnd = next ? next.index : text.length;
    reId.lastIndex = saved;
    const slice = text.slice(m.index, searchEnd);
    const vmRel = slice.indexOf("verifiedApi:");
    if (vmRel < 0) continue;
    const vmIdx = m.index + vmRel;
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
    const modIdsMatch = slice.match(/modIds:\s*\[([^\]]*)\]/);
    const modIds = modIdsMatch ? [...modIdsMatch[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
    entries.set(id, { id, slug, modIds, vaStart: open, vaEnd: i, closeIndent });
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
  let json = raw.replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":');
  json = json.replace(/'((?:\\'|[^'])*)'/g, (_, inner) => JSON.stringify(inner.replace(/\\'/g, "'")));
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

const normSeg = (s) => String(s).replace(/[-_]/g, "").toLowerCase();
const ROOT_SEGMENTS = 3;

/** 段级归属：modId 作为「包路径的一段」出现即算自有（`net.darkhax.bookshelf` ↔ modId `bookshelf`）。 */
function ownsPackage(entry, pkg) {
  const segs = String(pkg).split(".").map(normSeg);
  return (entry.modIds || []).some((id) => id && segs.includes(normSeg(id)));
}

/** 包根 = 前 3 段（`net.darkhax.bookshelf` / `dev.emi.emi`）；不足 3 段时取整串。 */
function packageRoot(pkg) {
  const parts = String(pkg).toLowerCase().split(".");
  return parts.slice(0, Math.min(ROOT_SEGMENTS, parts.length)).join(".");
}

/**
 * 包根 → 该包根的「自有条目」集合（只收自身 modIds 解释得通的包）。
 * 索引完全由 catalog 现有数据推出，不引入任何手写白名单：推不出归属的包一律不判外来。
 */
function buildRootOwnerIndex(text, entries) {
  const roots = new Map();
  for (const e of entries.values()) {
    const parsed = parseVa(text.slice(e.vaStart, e.vaEnd + 1));
    if (!parsed) continue;
    const sites = new Set();
    for (const v of Object.values(parsed)) {
      for (const p of Array.isArray(v?.packages) ? v.packages : []) if (typeof p === "string") sites.add(p);
    }
    for (const p of sites) {
      if (ownsPackage(e, p)) attestPackage(roots, e.id, p);
    }
  }
  return roots;
}

/** 把一个「条目自有」的包登记为该包根的凭证（catalog 现值与本轮输入共用同一凭证表）。 */
function attestPackage(rootOwners, entryId, pkg) {
  const r = packageRoot(pkg);
  if (!rootOwners.has(r)) rootOwners.set(r, new Set());
  rootOwners.get(r).add(entryId);
}

/** 非自有且命中「他方已证实包根」的包 = 冒领（JiJ 泄漏等）；返回空数组表示该组包可写入。 */
function foreignPackages(entry, packages, rootOwners) {
  const out = [];
  for (const p of Array.isArray(packages) ? packages : []) {
    const pkg = String(p);
    if (ownsPackage(entry, pkg)) continue;
    const owners = rootOwners.get(packageRoot(pkg));
    if (owners && [...owners].some((o) => o !== entry.id)) out.push(pkg);
  }
  return out;
}

function packagesPlausible(entry, packages, rootOwners) {
  return foreignPackages(entry, packages, rootOwners).length === 0;
}

/**
 * 给一个 verifiedApi 行的每个包打归属标签（own | bundled | unresolved）。
 *
 * 判据顺序与理由：
 *  - own：modId 是包路径的一段（与 ownsPackage 同一条判据，一票通过）；
 *  - bundled：**只用 jar 自己的声明**——批处理器把壳 jar 跳过的捆绑件连同它 zip 条目里的真实顶层包根
 *    一起写进 `bundles`，这里只认「该包根确实出现在某个被声明的捆绑件里」。不用包名启发式：
 *    启发式会把 Moonlight 的 `net.mehvahdjukaar.selene`（前身改名遗留）误判成捆绑，
 *    而它其实既不含 modId 段也不是声明捆绑 ⇒ 正是需要人工判断的 unresolved；
 *  - unresolved：既非 own 也无声明证据 ⇒ 保留为债，逐条点名（不静默放行）。
 */
export function tagPackages(entry, r, rootOwners) {
  const packages = Array.isArray(r?.packages) ? r.packages : [];
  const bundles = Array.isArray(r?.bundles) ? r.bundles : [];
  const out = {};
  for (const pkg of packages) {
    if (typeof pkg !== "string" || !pkg) continue;
    if (ownsPackage(entry, pkg)) {
      out[pkg] = { ownership: "own", evidence: "modId-segment", reason: "modId 是包路径的一段" };
      continue;
    }
    const root = pkg.split(".")[0];
    const via = bundles.find((b) => Array.isArray(b?.roots) && b.roots.includes(root));
    if (via) {
      out[pkg] = { ownership: "bundled", evidence: `declared:${via.from}`, reason: "外壳声明的捆绑件里确有该包根" };
      continue;
    }
    const owners = rootOwners ? rootOwners.get(packageRoot(pkg)) : undefined;
    const thief = owners ? [...owners].find((o) => o !== entry.id) : undefined;
    out[pkg] = {
      ownership: "unresolved",
      evidence: "none",
      reason: thief ? `既不含本库 modId 段、也无捆绑声明，且该包根由 ${thief} 证实` : "既不含本库 modId 段、也无捆绑声明",
    };
  }
  return out;
}

function buildValue(r, entry, rootOwners) {
  return {
    verifiedAt: r.verifiedAt ?? currentMonth(),
    packages: Array.isArray(r.packages) ? r.packages : [],
    entrypoints: Array.isArray(r.entrypoints) ? r.entrypoints : [],
    notes: "自动反编译提取",
    // 每个包都必须有归属标签：A6 因此能区分「已证实的自有 API」「声明的捆绑」
    // 与「说不清来源」，而不是只看一个 foreign 计数。
    packageOwnership: tagPackages(entry, r, rootOwners),
  };
}

function readResults(file) {
  const out = { lines: [], bad: 0, failed: 0, noIdentity: 0 };
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
    // 「解不出身份」是拒绝理由，不是可忽略字段：S2 之前这类行会坍缩进 unknown-mod/unknown 并冒领别人的树
    const identity = String(obj.modId ?? "").trim().toLowerCase();
    if (!identity || identity === "null" || identity === "unknown" || identity === "unknown-mod") {
      out.noIdentity++;
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
  const rootOwners = buildRootOwnerIndex(text, entries);
  // 冷启动补凭证：catalog 现值被清空/重建时，本轮输入里「条目自有」的包也要先登记，否则无法判外来
  for (const r of results.lines) {
    const e = r.slug ? entryBySlug.get(r.slug) : undefined;
    if (!e) continue;
    for (const p of Array.isArray(r.packages) ? r.packages : []) if (ownsPackage(e, p)) attestPackage(rootOwners, e.id, p);
  }
  const rejectedForeign = new Map(); // entryId -> Set(被拒的外来包)
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
      p = { entry, additions: new Map(), addNew: 0, overwrote: 0, skipped: 0, dups: 0, pruned: new Set() };
      planned.set(entry.id, p);
    }
    if (p.additions.has(key)) {
      p.dups++;
      continue;
    }
    const rawVa = text.slice(entry.vaStart, entry.vaEnd + 1);
    const pkgs = Array.isArray(r.packages) ? r.packages : [];
    const foreign = foreignPackages(entry, pkgs, rootOwners);
    if (foreign.length) {
      unmatched++;
      const set = rejectedForeign.get(entry.id) ?? new Set();
      for (const f of foreign) set.add(f);
      rejectedForeign.set(entry.id, set);
      continue;
    }
    if (keyExists(entry, rawVa, key)) {
      const existing = parseVa(rawVa);
      const oldPkgs = existing?.[key]?.packages;
      const wrongPrefix =
        Array.isArray(oldPkgs) &&
        oldPkgs.length > 0 &&
        !packagesPlausible(entry, oldPkgs, rootOwners);
      if (!opts.force && !wrongPrefix) {
        p.skipped++;
        continue;
      }
      p.overwrote++;
    } else {
      p.addNew++;
    }
    p.additions.set(key, buildValue(r, entry, rootOwners));
  }

  // writer 侧剔除：catalog 里**已存在**的键若其 packages 被判冒领（非自有 + 他方已证实该包根），
  // 而本轮又没有干净数据覆盖它，就删键。不删的话旧假键会永久留在生成物里，
  // 归属门只能一直挂债（KfF 那 8 行即如此：取件救不了，只能由 writer 剔除）。
  const pruneReport = new Map();
  for (const entry of entries.values()) {
    const parsed = parseVa(text.slice(entry.vaStart, entry.vaEnd + 1));
    if (!parsed) continue; // 旧值解析不出：本轮不碰它（下面按原样插入的路径也不删）
    let p2 = planned.get(entry.id);
    for (const [key, val] of Object.entries(parsed)) {
      const pkgs = Array.isArray(val?.packages) ? val.packages : [];
      if (pkgs.length === 0 || packagesPlausible(entry, pkgs, rootOwners)) continue;
      if (p2?.additions.has(key)) continue; // 本轮已用干净数据覆盖，不算剔除
      if (!p2) {
        p2 = { entry, additions: new Map(), addNew: 0, overwrote: 0, skipped: 0, dups: 0, pruned: new Set() };
        planned.set(entry.id, p2);
      }
      p2.pruned.add(key);
      const list = pruneReport.get(entry.id) ?? [];
      list.push(`${key} → ${pkgs.join(", ")}`);
      pruneReport.set(entry.id, list);
    }
  }

  // 生成编辑：重排缩进后整体替换 verifiedApi 区间（按 start 降序应用）
  const edits = [];
  for (const p of planned.values()) {
    if (p.additions.size === 0 && p.pruned.size === 0) continue;
    const rawVa = text.slice(p.entry.vaStart, p.entry.vaEnd + 1);
    const parsed = parseVa(rawVa);
    if (parsed) {
      for (const [k, v] of p.additions) parsed[k] = v;
      for (const k of p.pruned) delete parsed[k];
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
  let keysPruned = 0;
  for (const p of planned.values()) {
    keysAdded += p.addNew;
    keysSkipped += p.skipped;
    keysOverwritten += p.overwrote;
    keysPruned += p.pruned.size;
  }
  const entriesUpdated = planned.size;

  // 输出
  console.log(`=== verifiedApi 合并 ===`);
  console.log(`输入：${inputFile}`);
  console.log(`catalog：${catalogFile}`);
  console.log(`结果行：共 ${results.lines.length + results.bad + results.failed + results.noIdentity} 行（成功 ${results.lines.length} / 失败 ${results.failed} / 坏行 ${results.bad} / 身份不可解 ${results.noIdentity}）`);
  console.log(`匹配：${matched} 行 / 未匹配：${unmatched} 行`);
  if (rejectedForeign.size > 0) {
    console.log(`包名归属拒绝：${rejectedForeign.size} 个条目（这些行整行不写入，不改成本地包清单）`);
    for (const [id, set] of rejectedForeign) console.log(`  ${id}：外来包 ${[...set].join(", ")}`);
  }
  console.log(`更新条目数：${entriesUpdated}`);
  console.log(`新增键：${keysAdded} / 跳过键：${keysSkipped} / 覆盖键：${keysOverwritten} / 剔除冒领键：${keysPruned}`);
  if (pruneReport.size > 0) {
    console.log(`剔除明细（${pruneReport.size} 个条目）：`);
    for (const [id, list] of pruneReport) for (const line of list) console.log(`  ${id} | ${line}`);
  }

  if (opts.dryRun) {
    for (const p of planned.values()) {
      const keys = [...p.additions.keys()].join(", ");
      console.log(`  [dry-run] ${p.entry.id}：+${p.additions.size} 键（${keys}）${p.skipped ? `；跳过 ${p.skipped} 个已存在键` : ""}${p.overwrote ? `；覆盖 ${p.overwrote} 个已存在键` : ""}${p.pruned.size ? `；剔除 ${p.pruned.size} 个冒领键（${[...p.pruned].join(", ")}）` : ""}`);
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
