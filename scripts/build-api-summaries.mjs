#!/usr/bin/env node
/**
 * build-api-summaries.mjs — 从反编译源码提取库 API 摘要（轻量 javadoc）
 *
 * 输入:
 *   - 库清单: mcp-server/src/diagnostics/library-catalog.ts (LIBRARY_CATALOG)
 *   - 反编译源码: <cache>/decompiled-mods/<modId>/<modVersion>/**​/*.java (cache-s1|s2|s3)
 * 输出:
 *   - mcp-server/data/lib-api-summaries/<slug>.json
 *
 * 用法:
 *   node scripts/build-api-summaries.mjs                       # 全量
 *   node scripts/build-api-summaries.mjs --only bookshelf      # 单库调试 (slug|id|modId)
 *   node scripts/build-api-summaries.mjs --out <dir> --cache s1,s2,s3
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const CATALOG_PATH = path.join(ROOT, 'mcp-server', 'src', 'diagnostics', 'library-catalog.ts');
const DEFAULT_OUT = path.join(ROOT, 'mcp-server', 'data', 'lib-api-summaries');
function defaultCacheRoot() {
  if (process.env.MC_SKILL_CACHE) return process.env.MC_SKILL_CACHE;
  if (process.env.APPDATA) return path.join(process.env.APPDATA, 'mc-skill-cache');
  return path.join(os.tmpdir(), 'mc-skill-cache');
}
const CACHE_ROOT = defaultCacheRoot();
const DEFAULT_CACHES = [
  path.join(CACHE_ROOT, 'cache-s1'),
  path.join(CACHE_ROOT, 'cache-s2'),
  path.join(CACHE_ROOT, 'cache-s3'),
  process.env.APPDATA ? path.join(process.env.APPDATA, 'mc-skill-cache') : '',
].filter(Boolean);

// ---------- CLI ----------
function parseArgs(argv) {
  const opt = {
    only: null,
    out: DEFAULT_OUT,
    caches: [...DEFAULT_CACHES],
    maxFiles: 2000,
    maxClasses: 500,
    maxMethods: 2000,
    maxMethodsPerClass: 20,
    maxDepth: 12,
    maxVersions: 40,
    maxFileKb: 2048,
    write: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case '--only': opt.only = argv[++i]; break;
      case '--out': opt.out = argv[++i]; break;
      case '--cache': opt.caches = argv[++i].split(',').map((s) => s.trim()).filter(Boolean); break;
      case '--max-files': opt.maxFiles = Number(argv[++i]); break;
      case '--max-classes': opt.maxClasses = Number(argv[++i]); break;
      case '--max-methods': opt.maxMethods = Number(argv[++i]); break;
      case '--max-methods-per-class': opt.maxMethodsPerClass = Number(argv[++i]); break;
      case '--max-depth': opt.maxDepth = Number(argv[++i]); break;
      case '--max-versions': opt.maxVersions = Number(argv[++i]); break;
      case '--max-file-kb': opt.maxFileKb = Number(argv[++i]); break;
      case '--write': opt.write = true; break;
      case '-h': case '--help':
        console.log(`用法: node scripts/build-api-summaries.mjs [--only <slug|id|modId>] [--out <dir>] [--cache s1,s2,s3] [--max-* <n>]`);
        process.exit(0);
      default:
        if (a.startsWith('--')) { console.error(`未知参数: ${a}`); process.exit(2); }
    }
  }
  return opt;
}

// ---------- Catalog 解析（平衡括号，零依赖） ----------
function parseCatalog() {
  const src = fs.readFileSync(CATALOG_PATH, 'utf8');
  const bracket = src.indexOf('[', src.indexOf('LIBRARY_CATALOG'));
  if (bracket === -1) throw new Error('LIBRARY_CATALOG 数组起始未找到');
  const entries = [];
  let depth = 0;
  let startIdx = -1;
  // 层级扫描必须跳过字符串与注释（同 merge-verified-api 的 inStr 思路）：字面量里的 {} 与 URL 里的 // 不得改变层级
  for (let i = bracket; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') {
      i++;
      while (i < src.length && !(src[i] === c && src[i - 1] !== '\\')) i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i++;
      continue;
    }
    if (c === '{') {
      if (depth === 0) startIdx = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && startIdx !== -1) {
        const block = src.slice(startIdx, i + 1);
        const id = /id:\s*"([^"]*)"/.exec(block)?.[1];
        if (id) {
          const modIdsMatch = /modIds:\s*\[([^\]]*)\]/.exec(block);
          const modIds = modIdsMatch
            ? [...modIdsMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
            : [];
          const slug = /modrinthSlug:\s*"([^"]*)"/.exec(block)?.[1] ?? '';
          const role = /role:\s*"([^"]*)"/.exec(block)?.[1] ?? 'api';
          // 目录别名只认 catalog 显式声明（无该字段 = 空，不再靠字符串前缀猜）
          const aliasMatch = /dirAliases:\s*\[([^\]]*)\]/.exec(block);
          const dirAliases = aliasMatch
            ? [...aliasMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
            : [];
          // verifiedApi 下所有 packages 的并集（键在 catalog 里带引号：`"packages": [`；正则两种形态都认）
          const prefixes = [];
          const vaStart = block.indexOf('verifiedApi:');
          if (vaStart !== -1) {
            for (const m of block.slice(vaStart).matchAll(/["']?packages["']?\s*:\s*\[([^\]]*)\]/g)) {
              for (const pm of m[1].matchAll(/"([^"]+)"/g)) prefixes.push(pm[1]);
            }
          }
          entries.push({ id, modIds, slug, role, prefixes: [...new Set(prefixes)], dirAliases });
        }
        startIdx = -1;
      }
    }
  }
  return entries;
}

// ---------- 源码目录定位 ----------
function normalize(s) { return s.replace(/[-_]/g, ''); }

/** slug → [outputDir]（JSONL 是最准确的源：记录每个 jar 实际反编译目录） */
let JSONL_DIRS = new Map();
function loadJsonlDirs() {
  const candidates = [
    path.join(CACHE_ROOT, 'verified-api-all.jsonl'),
    path.join(ROOT, 'temp', 'verified-api-results.jsonl'),
  ];
  for (const p of candidates) {
    try {
      if (!fs.existsSync(p)) continue;
      for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
        if (!line.trim()) continue;
        try {
          const j = JSON.parse(line);
          if (j.status !== 'success' || !j.outputDir) continue;
          const list = JSONL_DIRS.get(j.slug) ?? [];
          list.push(j.outputDir);
          JSONL_DIRS.set(j.slug, list);
        } catch { /* 坏行跳过 */ }
      }
      console.log(`已加载 JSONL 映射（${p}）：${JSONL_DIRS.size} 个 slug`);
      return;
    } catch { /* 尝试下一个 */ }
  }
}

function findModDir(entry, caches) {
  // ① JSONL 精确目录（最高优先级；outputDir 是版本级 → 取库级父目录）
  const fromJsonl = JSONL_DIRS.get(entry.slug) ?? [];
  const libLevel = new Set(fromJsonl.map((d) => path.dirname(d)));
  for (const dir of libLevel) {
    try {
      if (fs.statSync(dir).isDirectory()) return { dir, shard: 'jsonl', name: path.basename(dir) };
    } catch { /* 已删除则忽略 */ }
  }
  const candidates = [];
  for (const m of entry.modIds) {
    candidates.push(m, m.replace(/-/g, '_'), m.replace(/_/g, '-'));
  }
  if (entry.slug) candidates.push(entry.slug);
  // manifest 实际 modId 补充（如 yacl 的 jar modId 是 yet-another-config-lib，与 catalog modIds 不同）
  try {
    const manifestPath = path.join(ROOT, 'mcp-server', 'data', 'lib-manifests', 'all.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      for (const row of manifest) {
        const slugs = String(row.slug ?? '').split(',').map((s) => s.trim()).filter(Boolean);
        if (slugs.includes(entry.slug)) {
          for (const e of row.entries) if (e.modId) candidates.push(e.modId);
        }
      }
    }
  } catch { /* manifest 缺失时仅用 catalog 候选 */ }
  const unique = [...new Set(candidates.filter(Boolean))];

  for (const cacheRoot of caches) {
    const base = path.join(cacheRoot, 'decompiled-mods');
    for (const cand of unique) {
      const p = path.join(base, cand);
      try {
        if (fs.statSync(p).isDirectory()) return { dir: p, shard: path.basename(cacheRoot), name: cand };
      } catch { /* 不存在 */ }
    }
  }
  // 前缀相似不等于同一库：只认 catalog 显式声明的 dirAliases（同前缀目录一律拒绝并说明）
  const aliasNorm = new Set((entry.dirAliases ?? []).map(normalize));
  const refused = new Set();
  for (const cacheRoot of caches) {
    const base = path.join(cacheRoot, 'decompiled-mods');
    let dirs = [];
    try { dirs = fs.readdirSync(base); } catch { continue; }
    for (const d of dirs) {
      if (d.length < 3) continue;
      const dn = normalize(d);
      if (aliasNorm.has(dn)) {
        const p = path.join(base, d);
        try {
          if (fs.statSync(p).isDirectory()) return { dir: p, shard: path.basename(cacheRoot), name: d };
        } catch { /* ignore */ }
      }
      for (const cand of unique) {
        if (cand.length < 3) continue;
        const norm = normalize(cand);
        if (dn !== norm && (dn.startsWith(norm) || norm.startsWith(dn))) { refused.add(d); break; }
      }
    }
  }
  if (refused.size > 0) {
    console.log(`[前缀回退已拒] ${entry.id}: 同前缀目录 ${[...refused].join(', ')} 未声明为该条目的 dirAliases，不认领（防抢到别库目录）`);
  }
  return null;
}

// 目录内是否含 .java（带文件数上限的快速探测）
function hasJavaFiles(dir, maxCheck = 1) {
  const out = [];
  collectJavaFiles(dir, '', null, out, maxCheck, 0, 12);
  return out.length > 0;
}

/**
 * 解析库源码：主目录无 java 时，合并同前缀兄弟目录
 * （如 CCA: cardinal-components 为空，源码在 cardinal-components-base/-entity/...）
 */
function resolveSourceDirs(entry, opt) {
  const found = findModDir(entry, opt.caches);
  if (!found) return null;
  if (hasJavaFiles(found.dir)) {
    return { shard: found.shard, dirs: [found.name], merged: false, root: path.dirname(found.dir) };
  }
  // 合并回退
  let siblings = [];
  try { siblings = fs.readdirSync(path.dirname(found.dir)); } catch { /* ignore */ }
  const merged = siblings
    .filter((d) => d.startsWith(`${found.name}-`) && d !== found.name)
    .filter((d) => {
      try { return hasJavaFiles(path.join(path.dirname(found.dir), d)); } catch { return false; }
    })
    .sort();
  if (merged.length > 0) {
    return { shard: found.shard, dirs: [found.name, ...merged], merged: true, root: path.dirname(found.dir) };
  }
  return { shard: found.shard, dirs: [found.name], merged: false, root: path.dirname(found.dir) };
}

/**
 * 树里真实存在的包路径（有界扫描）。用于核 catalog 传下来的 packages 白名单是否还成立。
 * 深度/目录数都设上限：这只用于「白名单是否过期」的判断，不需要穷举。
 */
function treePackageRoots(leafDirs, maxDepth = 8, maxDirs = 600) {
  const roots = new Set();
  let visited = 0;
  const walk = (dir, rel) => {
    if (roots.size >= maxDirs || visited >= maxDirs * 4) return;
    let ents = [];
    try {
      ents = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    visited++;
    let hasJava = false;
    for (const e of ents) if (e.isFile() && e.name.endsWith(".java")) hasJava = true;
    if (rel && hasJava) roots.add(rel);
    if (rel.split(".").length >= maxDepth) return;
    for (const e of ents) {
      if (!e.isDirectory() || isNoiseSegment(e.name)) continue;
      walk(path.join(dir, e.name), rel ? `${rel}.${e.name}` : e.name);
    }
  };
  for (const dir of leafDirs) walk(dir, "");
  return [...roots];
}

/**
 * 生效白名单 = catalog 声明的 packages 里**在树里真找得到**的那些；一个都不成立 ⇒ 不收窄。
 *
 * 为什么必须这样：packages 是上一轮摘要写回 catalog 的（F113：unknown-mod 坍缩树让
 * placebo 这类库的条目冒领了 `net.darkhax.bookshelf`）。直接当白名单用会把本库真实包
 * 全过滤掉 ⇒ 摘要 0 类 ⇒ 下一轮继续冒领，整条链自我固化。这里按树实测，过期即失效。
 */
function pickPrefixes(entry, leafDirs) {
  if (!entry.prefixes.length) return { prefixes: null, rejected: [], mode: "none-declared" };
  const roots = treePackageRoots(leafDirs);
  const plausible = entry.prefixes.filter((p) => roots.some((r) => r === p || r.startsWith(`${p}.`)));
  if (plausible.length) return { prefixes: plausible, rejected: [], mode: "declared" };
  // 白名单整体失效：改按「modId 是路径的一段」从树里重建（与 catalog 同一判据），
  // 而不是直接放开 —— `-all` 胖 jar（如 kotlinforforge）里捆了 Kotlin 标准库，
  // 放开就等于把 kotlin.* 当成本库 API。
  const ownSegs = new Set(entry.modIds.map((m) => String(m).toLowerCase().replace(/[-_]/g, "")).filter(Boolean));
  const owned = roots.filter((r) => r.split(".").some((s) => ownSegs.has(s.toLowerCase().replace(/[-_]/g, ""))));
  if (owned.length) return { prefixes: owned, rejected: entry.prefixes, mode: "rebuilt" };
  return { prefixes: null, rejected: entry.prefixes, mode: "unfiltered" };
}

// ---------- 噪音过滤 ----------
const NOISE_SEG_RE = /^(mixin|impl|internal|asm|japi)$/i;

function isNoiseSegment(seg) {
  return NOISE_SEG_RE.test(seg) || seg.includes('_inject_');
}

function pkgMatches(pkg, prefixes) {
  if (!prefixes || prefixes.length === 0) return true;
  for (const p of prefixes) {
    if (pkg === p || pkg.startsWith(p + '.')) return true;
  }
  return false;
}

// ---------- .java 收集（限深度/限文件数） ----------
function collectJavaFiles(dir, relPkg, prefixes, out, maxFiles, depth, maxDepth) {
  if (out.length >= maxFiles || depth > maxDepth) return;
  let ents = [];
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const ent of ents) {
    if (out.length >= maxFiles) return;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      const pkgSeg = relPkg ? `${relPkg}.${ent.name}` : ent.name;
      if (isNoiseSegment(ent.name)) {
        // 噪音段：除非该包本身（或其子包）是已验证前缀，否则整棵子树跳过
        const keep =
          prefixes && prefixes.some((p) => p === pkgSeg || p.startsWith(pkgSeg + '.'));
        if (!keep) continue;
      }
      collectJavaFiles(full, pkgSeg, prefixes, out, maxFiles, depth + 1, maxDepth);
    } else if (ent.name.endsWith('.java') && !/^(package-info|module-info)\.java$/.test(ent.name)) {
      if (pkgMatches(relPkg, prefixes)) out.push(full);
    }
  }
}

// ---------- 类与方法提取（字符级扫描，状态机） ----------
const CLASS_RE = /^(public\s+(?:(?:abstract|final|sealed|non-sealed|static)\s+)*(?:class|interface|enum|record)\s+)([A-Za-z_$][\w$]*)/;
// Kotlin 反编译形态（Kotlin 类默认 public，VineFlower 输出 open class / object / fun）
const KCLASS_RE = /^(?:(?:public)\s+)?(?:(?:abstract|final|open|sealed|data|value)\s+)*(?:enum\s+)?(?:class|interface|object|annotation)\s+([A-Za-z_$][\w$]*)/;
// `\bfun\s*(?:[A-Za-z_$]|<)`：**泛型**顶层函数（`public fun <T> Foo.bar(...)`）也必须算 Kotlin。
// 旧写法 `\bfun\s+[A-Za-z_$]` 匹配不到 `fun <T>` ⇒ 整个文件被判成非 Kotlin，
// 既过不了 CLASS_RE 又走不到门面回退（实测 kfflib 的 CapabilityUtilKt 正是这样漏掉的唯一一个真类）。
const KOTLIN_MARKER = /(@SourceDebugExtension|import kotlin\.|\bopen class|\bsealed class|\bdata class|\benum class|\bobject [A-Za-z_$]|\bfun\s*(?:[A-Za-z_$]|<)|\bval\s+[A-Za-z_$])/;
/**
 * 文件门面判据：某个**行首**顶层声明是 `fun` / `val` / `var`，且**没有** `internal|private|protected` 前缀。
 * Kotlin 默认可见性是 public，所以裸 `fun foo()` 也算。用于确认「这文件确实只有顶层声明、没有类型」——
 * 避免把一个空文件/纯注释文件也登记成一个假类。
 */
const FACADE_DECL_RE =
  /^(?:(?:public|actual|expect|external|inline|operator|infix|tailrec|suspend|const|lateinit|vararg|abstract|open|override|final)\s+)*(?:fun|val|var)\s+\S/m;
const REJECT_WORDS = new Set(['new', 'return', 'this', 'super', 'case', 'throw', 'assert', 'class', 'instanceof', 'if', 'while', 'for', 'switch', 'catch']);
// '>' 覆盖 switch 箭头 (-> foo())；+ - * / % 覆盖字段初始化里的算术调用
const REJECT_CHARS = new Set(['.', '=', '(', ',', '!', '?', ':', ';', '[', ')', '{', '}', '>', '-', '+', '*', '/', '%']);

function findClassBodyBrace(src, from) {
  let i = from;
  let angle = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '"' || c === "'") {
      i++;
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === c) { i++; break; }
        i++;
      }
      continue;
    }
    if (c === '<') angle++;
    else if (c === '>') { if (angle > 0) angle--; }
    else if (c === '{' && angle === 0) return i;
    else if (c === ';' && angle === 0) return -1;
    i++;
  }
  return -1;
}

/**
 * 扫描一个 .java 文件，返回顶层 public 类的 [{name, methods:[{sig, name, types}]}]
 * isKotlin: 反编译产物为 Kotlin 形态（open class / object / fun），类与方法均默认 public
 * facadeName: Kotlin **文件门面**（`Foo.kt` 的顶层 fun/val 编译成 JVM 类 `FooKt`）。
 *   这类文件里**没有类型声明**，主循环一条都收不到 —— 但它在 JVM 侧确实是个类，
 *   且类名就写在文件名上（实测 `CapabilityUtilKt.java` 只有 `public fun <T> …`，无 class）。
 *   传了 facadeName 就先把它登记成一个类，后续成员扫描按「已在类体内」跑（depth=1）。
 *   只对「无类型声明」的文件启用；`internal/private/protected` 顶层声明仍按既有口径不收。
 */
function scanJavaFile(src, maxMethodsPerClass, isKotlin, facadeName = null) {
  const out = [];
  const n = src.length;
  let depth = 0;
  let cur = null; // {name, methods, bodyDepth}
  let i = 0;
  if (facadeName) {
    cur = { name: facadeName, methods: [], bodyDepth: 1 };
    out.push(cur);
    depth = 1;
  }

  const tryMethod = (tokenEnd) => {
    // 从修饰符后向前扫描到 '('
    let k = tokenEnd;
    let parenIdx = -1;
    let sawAngle = false;
    while (k < n) {
      const ch = src[k];
      if (ch === '(') { parenIdx = k; break; }
      if (ch === ';' || ch === '{') break;
      if (ch === '"' || ch === "'") {
        // 跳过字符串/字符字面量（防止字面量内的 @ / ( 干扰）
        k++;
        while (k < n) {
          if (src[k] === '\\') { k += 2; continue; }
          if (src[k] === ch) { k++; break; }
          k++;
        }
        continue;
      }
      if (ch === '/' && src[k + 1] === '/') { while (k < n && src[k] !== '\n') k++; continue; }
      if (ch === '/' && src[k + 1] === '*') {
        k += 2;
        while (k < n && !(src[k] === '*' && src[k + 1] === '/')) k++;
        k += 2;
        continue;
      }
      if (ch === '@') {
        const aStart = k;
        while (k < n && /[A-Za-z0-9_.$]/.test(src[k])) k++;
        if (k === aStart) { k++; continue; } // 裸 @：必须推进，防死循环
        if (src[k] === '(') {
          let d = 0;
          while (k < n) {
            const cc = src[k];
            if (cc === '(') d++;
            else if (cc === ')') { d--; if (d === 0) { k++; break; } }
            k++;
          }
        }
        continue;
      }
      if (ch === '<') {
        sawAngle = true;
        let d = 0;
        while (k < n) {
          const cc = src[k];
          if (cc === '<') d++;
          else if (cc === '>') { d--; if (d === 0) { k++; break; } }
          k++;
        }
        continue;
      }
      k++;
    }
    if (parenIdx === -1) return;
    // 方法名回溯
    let nameEnd = parenIdx;
    while (nameEnd > tokenEnd && /\s/.test(src[nameEnd - 1])) nameEnd--;
    let nameStart = nameEnd;
    while (nameStart > tokenEnd && /[A-Za-z0-9_$]/.test(src[nameStart - 1])) nameStart--;
    const name = src.slice(nameStart, nameEnd);
    if (!name) return;
    // 边界检查：前导字符（泛型返回类型 "Type<T> foo(" 允许 '>' 前缀）
    let pb = nameStart - 1;
    while (pb >= tokenEnd && /\s/.test(src[pb])) pb--;
    if (pb >= tokenEnd) {
      const pc = src[pb];
      if (REJECT_CHARS.has(pc) && !(pc === '>' && sawAngle)) return;
      if (/[A-Za-z_]/.test(pc)) {
        let ws = pb;
        while (ws >= tokenEnd && /[A-Za-z0-9_$]/.test(src[ws])) ws--;
        const word = src.slice(ws + 1, pb + 1);
        if (REJECT_WORDS.has(word)) return;
      }
    }
    // 名字噪音过滤
    if (name === cur.name || name.includes('$') || /^(lambda\$|access\$)/i.test(name) || name.includes('_inject_')) return;
    // 参数列表
    let closeParen = parenIdx + 1;
    {
      let d = 0;
      while (closeParen < n) {
        const cc = src[closeParen];
        if (cc === '(') d++;
        else if (cc === ')') { if (d === 0) break; d--; }
        closeParen++;
      }
    }
    // 方法体确认: `{` 或 `;`（跳过 throws；Kotlin 还有 `): 返回类型 {`）
    let k2 = closeParen + 1;
    while (k2 < n && /\s/.test(src[k2])) k2++;
    if (src.startsWith('throws', k2)) {
      while (k2 < n && src[k2] !== '{' && src[k2] !== ';') k2++;
    } else if (isKotlin && src[k2] === ':') {
      // Kotlin 返回类型（`: Any` / `: List<String>`），跳过到方法体
      k2++;
      while (k2 < n && src[k2] !== '{' && src[k2] !== ';') k2++;
    }
    if (src[k2] !== '{' && src[k2] !== ';') return;
    // 参数解析
    const rawParams = [];
    if (closeParen > parenIdx + 1) {
      let pd = 0;
      let cur2 = '';
      for (let x = parenIdx + 1; x < closeParen; x++) {
        const ch2 = src[x];
        if (ch2 === '<') pd++;
        else if (ch2 === '>') pd = Math.max(0, pd - 1);
        if (ch2 === ',' && pd === 0) { rawParams.push(cur2.trim()); cur2 = ''; }
        else cur2 += ch2;
      }
      rawParams.push(cur2.trim());
    }
    const types = rawParams
      .filter((p) => p !== '')
      .map((p) => {
        let t;
        // Kotlin 参数形态 "name: Type"（可带注解前缀 / vararg）
        const km = /^(?:@[\w.$]+(?:\([^()]*\))?\s*)?[\w$]+\s*:\s*(.+)$/.exec(p);
        if (km) {
          t = km[1].trim();
          if (p.startsWith('vararg ')) t = t.endsWith('...') ? t : `${t}...`;
        } else {
          const m2 = /^(.+?)((?:\[\])*)\s+(?:\.\.\.\s+)?[A-Za-z_$][\w$]*$/.exec(p);
          t = m2 ? m2[1].trim() + m2[2] : p.trim();
        }
        t = t.replace(/@[\w.$]+(\([^()]*\))?/g, '').trim(); // 去掉参数上的注解
        return t || p.trim();
      });
    const sig = `${name}(${types.join(', ')})`;
    if (cur.methods.length >= maxMethodsPerClass) return;
    if (!cur.methods.some((m) => m.sig === sig)) cur.methods.push({ sig, name, types });
  };

  while (i < n) {
    const c = src[i];
    // 注释 / 字符串 / 字符字面量
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    if (c === '"') {
      i++;
      while (i < n) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === '"') { i++; break; }
        i++;
      }
      continue;
    }
    if (c === "'") {
      i++;
      while (i < n) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === "'") { i++; break; }
        i++;
      }
      continue;
    }
    if (c === '{') { depth++; i++; continue; }
    if (c === '}') { depth--; if (depth <= 0) { depth = 0; cur = null; } i++; continue; }
    if (depth === 0) {
      if (isKotlin) {
        // Kotlin: open class / final class / object / enum class / fun 文件（默认 public，跳过 internal/private/protected）
        const guarded = src.startsWith('internal ', i) || src.startsWith('private ', i) || src.startsWith('protected ', i);
        if (!guarded && /[pofascedv]/.test(c)) {
          const mm = KCLASS_RE.exec(src.slice(i, i + 96));
          if (mm && !mm[1].includes('$') && !/lambda|access\$|_inject_/i.test(mm[1])) {
            const hdr = findClassBodyBrace(src, i + mm[0].length);
            if (hdr !== -1 && hdr - i < 4096) {
              cur = { name: mm[1], methods: [], bodyDepth: 1 };
              out.push(cur);
              depth = 1;
              i = hdr + 1;
              continue;
            }
          }
        }
      } else if (c === 'p' && (src.startsWith('public ', i) || src.startsWith('public\t', i))) {
        const mm = CLASS_RE.exec(src.slice(i, i + 96));
        if (mm && !mm[2].includes('$') && !/lambda|access\$|_inject_/i.test(mm[2])) {
          const hdr = findClassBodyBrace(src, i + mm[0].length);
          if (hdr !== -1 && hdr - i < 4096) {
            cur = { name: mm[2], methods: [], bodyDepth: 1 };
            out.push(cur);
            depth = 1;
            i = hdr + 1;
            continue;
          }
        }
      }
      i++;
      continue;
    }
    if (cur && depth === 1) {
      const isPub = c === 'p' && (src.startsWith('public ', i) || src.startsWith('public\t', i));
      const isProt = c === 'p' && src.startsWith('protected ', i);
      const isDef = c === 'd' && (src.startsWith('default ', i) || src.startsWith('default\t', i));
      const kotlinExtras = isKotlin
        && (c === 'o' ? src.startsWith('open ', i)
          : c === 'f' ? src.startsWith('final ', i) || src.startsWith('fun ', i)
          : c === 'v' ? src.startsWith('override ', i)
          : false);
      if (isPub || isProt || isDef || kotlinExtras) {
        const tk = isPub ? 'public' : isProt ? 'protected' : isDef ? 'default'
          : src.startsWith('open ', i) ? 'open'
          : src.startsWith('final ', i) ? 'final'
          : src.startsWith('override ', i) ? 'override' : 'fun';
        tryMethod(i + tk.length);
        i += tk.length;
        continue;
      }
    }
    i++;
  }
  return out;
}

// ---------- 单库处理 ----------
// 数字感知版本比较（"10.4.33" > "9.9.9"；"0.11.2_1.20" > "0.8.5_1.19"）
function cmpVersions(a, b) {
  const pa = a.split(/[._-]/).map((s) => (/^\d+$/.test(s) ? Number(s) : s));
  const pb = b.split(/[._-]/).map((s) => (/^\d+$/.test(s) ? Number(s) : s));
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (typeof x === 'number' && typeof y === 'number') {
      if (x !== y) return x - y;
    } else if (String(x) !== String(y)) {
      return String(x) < String(y) ? -1 : 1;
    }
  }
  return 0;
}

/** 条目 → 输出文件名主干（processLib 落盘与 main 统计必须同源） */
function slugOf(entry) {
  const raw = entry.slug || entry.id.replace(/^authored\/lib-/, '');
  return raw.replace(/[^A-Za-z0-9._-]/g, '_');
}

/**
 * 归属层 · jar sha512 前 12 位 → 该 jar 服务的 MC 版本集合。
 *
 * 来源：`mcp-server/data/lib-manifests/all.json`（Modrinth 取件的**已解析产物**：同一 jar 会以它
 * 支持的每个 MC 版本各列一条 entry，字段 `gameVersion` / `loader` / `sha512` / `versionNumber`）。
 * 为什么需要它：库的 jar ↔ MC 版本是**多对多且跨度大**的（实测 KFF：`6.3.0` 一个 jar 覆盖
 * 1.21.9–26.2 共 7 个版本；`1.17.0` 覆盖 1.14–1.16.5 共 14 个），而反编译产物里「纯库内层件」
 * （如 KFF 的 kfflib/kfflang）自身没有 mods.toml ⇒ 声明不出 MC 版本 ⇒ `meta.version = null`。
 * 这时**不要猜一个版本**、也不要落 `unknown` 键，而是按 jar sha 回清单取权威版本集合、逐版本展开。
 */
let MANIFEST_ALL = null;
/** 每库一份索引：`slug` → { bySha, byVer }。**必须按库收窄** —— 不同库会有同名 `versionNumber`
 *（实测：KFF 的 `5.0.2` / `6.0.0` 与别库同号，全局索引会把 `1.19.1/1.19.2`、`1.20.5/1.20.6`
 * 串进 KFF 的版本键）。 */
const MANIFEST_INDEX_BY_SLUG = new Map();

function manifestIndexFor(entry) {
  const slugKey = slugOf(entry);
  if (MANIFEST_INDEX_BY_SLUG.has(slugKey)) return MANIFEST_INDEX_BY_SLUG.get(slugKey);
  if (!MANIFEST_ALL) {
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(ROOT, 'mcp-server', 'data', 'lib-manifests', 'all.json'), 'utf8'),
      );
      MANIFEST_ALL = Array.isArray(raw) ? raw : Object.values(raw);
    } catch { MANIFEST_ALL = []; }
  }
  const modIds = new Set([...(entry.modIds || []), entry.slug].filter(Boolean).map(String));
  const bySha = new Map();
  const byVer = new Map();
  for (const lib of MANIFEST_ALL) {
    // 归属：清单条目的 slug / modId 必须与本 catalog 条目对得上（含 JEI/EMI/REI 共享条目的多 slug）
    const libKeys = [lib?.slug, ...(lib?.entries || []).map((e) => e?.modId)].filter(Boolean).map(String);
    if (!libKeys.some((k) => modIds.has(k))) continue;
    for (const e of lib.entries || []) {
      if (!e?.gameVersion) continue;
      if (e.sha512) {
        const k = String(e.sha512).slice(0, 12);
        const set = bySha.get(k) ?? new Set();
        set.add(e.gameVersion);
        bySha.set(k, set);
      }
      // 二级键：**发布版本号**。内层件（jarjar 里的 kfflib/kfflang）有自己的 sha，
      // 与清单里记的外壳 sha 不同 ⇒ 按 sha 查不到，但它与外壳同属一个发布版本
      // （目录名前缀 `<modVersion>-<sha12>` 就是发布版本号）⇒ 用版本号 join。
      if (e.versionNumber) {
        const set = byVer.get(e.versionNumber) ?? new Set();
        set.add(e.gameVersion);
        byVer.set(e.versionNumber, set);
      }
    }
  }
  const idx = { bySha, byVer };
  MANIFEST_INDEX_BY_SLUG.set(slugKey, idx);
  return idx;
}

/** 目录名（`<modVersion>-<sha12>`）→ 该发布版本覆盖的 MC 版本集合（本库范围内）。 */
function manifestVersionsForDirName(dirName, entry, meta = null) {
  const { bySha, byVer } = manifestIndexFor(entry);
  let sha12 = (dirName.match(/-([0-9a-f]{12})$/) || [])[1];
  if (!sha12 && /^[0-9a-f]{16,}$/.test(dirName)) {
    // balm 实测（2026-09-15）：5 个叶子目录名是 **sha512 全长**（64 hex，无 `<ver>-` 前缀、
    // 无 `-` 分隔）⇒ 旧匹配只认 `…-<sha12>` 尾缀 ⇒ join 断 ⇒ meta.version 也无（该批反编译
    // 未记版本）⇒ 兜底把整串 hex 当版本键，脏键（`03ab49d3…/fabric`）漏进 emit → catalog。
    // 这 5 个 sha12 在清单里全部命中（balm 3.2.5→6.0.2 forge，gv 1.18–1.19.4）⇒ 取前 12 位 join。
    sha12 = dirName.slice(0, 12);
  }
  if (sha12) {
    const byShaHit = bySha.get(sha12);
    if (byShaHit && byShaHit.size) return [...byShaHit].sort(cmpVersions);
  }
  // 三级键：目录名前缀 = 发布版本号（`<modVersion>-<sha12>`）。
  let verNum = dirName.replace(/-[0-9a-f]{12}$/, '');
  if (!/^[0-9]/.test(verNum)) {
    // 四级键：纯库内层件（jarjar 里的 kfflib/kfflang）没有自己的 mods.toml、目录名因此落成
    // `unknown-<sha12>`（身份来源是 external）⇒ 前缀不带版本号。这时用 meta 里记的**源 jar 文件名**
    // 提版本号（实测 meta.jar = `thedarkcolour.kfflib-6.3.0.jar`），再按发布版本号 join 清单。
    const src = String(meta?.jar || meta?.jarPath || '');
    const m = src.match(/-(\d+\.\d+(?:\.\d+)*)(?:[-+.]|\.jar$)/);
    if (!m) return null;
    verNum = m[1];
  }
  const byVerHit = byVer.get(verNum);
  return byVerHit && byVerHit.size ? [...byVerHit].sort(cmpVersions) : null;
}

/**
 * 叶子目录名 → 摘要里的版本键（**可能有多个**）。反编译缓存叶子自 S2 起命名为
 * `<modVersion>-<jar sha512 前 12 hex>`（同版本不同 jar 各有目录），裸目录名不能当版本键。
 * 优先级：① 叶子 meta 的 `version`（权威，反编译时已知 MC 版本）
 *        ② 清单按 sha12 反查到的 `gameVersion` 集合（多对多时逐个展开，同 jar 在每个覆盖版本下各出一份）
 *        ③ 兜底：目录名剥掉尾段 12 hex（旧行为，保留以免影响未入清单的档）
 */
function versionKeysOf(leafDir, dirName, entry) {
  let metaVersion = null;
  let meta = null;
  try {
    meta = JSON.parse(fs.readFileSync(path.join(leafDir, '.mc-skill-decompiled.json'), 'utf8'));
    if (typeof meta?.version === 'string' && meta.version) metaVersion = meta.version;
  } catch { /* 无 meta / 坏 meta → 继续往下 */ }
  const fromManifest = manifestVersionsForDirName(dirName, entry, meta);
  // 取并集：`meta.version` 是「反编译时调用方说的版本」（常常是当时随手选的其中一个），
  // 清单是「发布记录里该 jar 服务的全部版本」——两者都是事实，合起来才是完整归属。
  const keys = new Set();
  if (metaVersion) keys.add(metaVersion);
  if (fromManifest) fromManifest.forEach((v) => keys.add(v));
  const out = keys.size ? [...keys].sort(cmpVersions) : [dirName.replace(/-[0-9a-f]{12}$/, '')];
  if (process.env.MC_SKILL_SUMMARY_DEBUG === '1') {
    console.log(
      `    [归属] ${dirName} → ${JSON.stringify(out)}（meta=${JSON.stringify(metaVersion)} + 清单=${JSON.stringify(fromManifest)}）`,
    );
  }
  return out;
}

function processLib(entry, opt) {
  const src = resolveSourceDirs(entry, opt);
  if (!src) {
    const names = [...entry.modIds, entry.slug].filter(Boolean).join(', ');
    console.log(`[跳过] ${entry.id} (modIds=[${names}]): 三个缓存分片均无 decompiled-mods 目录`);
    return null;
  }
  const libStarted = Date.now();
  const srcDirs = src.dirs.map((d) => ({ name: d, dir: path.join(src.root, d) }));
  // 版本键 → 该键下的叶子目录名（所有来源目录的并集；新版本在前，保证截断发生时最新 API 优先保留）
  const leavesByVer = new Map();
  for (const sd of srcDirs) {
    try {
      for (const e of fs.readdirSync(sd.dir, { withFileTypes: true })) {
        if (!e.isDirectory()) continue;
        // 归属层：一个叶子可属多个 MC 版本键（清单里同一 jar 覆盖多版本）⇒ 逐个登记。
        for (const key of versionKeysOf(path.join(sd.dir, e.name), e.name, entry)) {
          const set = leavesByVer.get(key) ?? new Set();
          set.add(e.name);
          leavesByVer.set(key, set);
        }
      }
    } catch { /* ignore */ }
  }
  let versionDirs = [...leavesByVer.keys()].sort((a, b) => cmpVersions(b, a));
  const droppedVersions = [];
  if (versionDirs.length > opt.maxVersions) {
    droppedVersions.push(...versionDirs.slice(opt.maxVersions));
    console.log(`[警告] ${entry.id}: 版本数 ${versionDirs.length} 超过上限 ${opt.maxVersions}，丢弃 ${droppedVersions.length} 个版本`);
    versionDirs = versionDirs.slice(0, opt.maxVersions);
  }
  const leafDirs = [];
  for (const sd of srcDirs) {
    for (const set of leavesByVer.values()) {
      for (const leaf of set) leafDirs.push(path.join(sd.dir, leaf));
    }
  }
  const { prefixes, rejected, mode } = pickPrefixes(entry, leafDirs);
  if (rejected.length) {
    console.log(
      `[白名单失效] ${entry.id}: catalog 声明的 packages [${rejected.join(", ")}] 在该库反编译树里一个都不存在` +
        ` ⇒ 不收窄旧值，改按树重建（mode=${mode}；F113 自愈：那些行是上一轮冒领写回的）`,
    );
  }

  const versions = {};
  let classCount = 0;
  let methodCount = 0;
  /** 靠文件名门面补回来的类数（Kotlin 顶层 fun/val 文件）—— 落进产物便于下一轮核对 */
  let facadeFiles = 0;
  let truncated = false;
  let truncatedVersions = 0;
  let capsHit = false;

  for (const ver of versionDirs) {
    const fileSet = new Map(); // 文件绝对路径 → 所属叶子目录（包名相对该目录算）
    for (const sd of srcDirs) {
      for (const leaf of leavesByVer.get(ver) ?? [ver]) {
        const verDir = path.join(sd.dir, leaf);
        if (!fs.existsSync(verDir)) continue;
        const vfiles = [];
        collectJavaFiles(verDir, '', prefixes, vfiles, opt.maxFiles, 0, opt.maxDepth);
        for (const f of vfiles) if (!fileSet.has(f)) fileSet.set(f, verDir);
      }
    }
    const files = [...fileSet.keys()];
    const sampleCount = files.length;
    const fileTruncated = files.length >= opt.maxFiles;
    const classes = [];
    const methods = {};
    const seenPkgs = new Set();
    const sizeCapBytes = opt.maxFileKb * 1024;
    let verTruncated = false;
    let verClassCount = 0;
    let verMethodCount = 0;

    for (const f of files) {
      if (verClassCount >= opt.maxClasses || verMethodCount >= opt.maxMethods) { verTruncated = true; break; }
      let src;
      try {
        const st = fs.statSync(f);
        if (st.size > sizeCapBytes) continue;
        src = fs.readFileSync(f, 'utf8');
      } catch { continue; }
      const isKotlin = KOTLIN_MARKER.test(src);
      if (!isKotlin && !/(^|[^A-Za-z0-9_$])(public|protected|default)\s/.test(src)) continue;
      const rel = path.relative(fileSet.get(f), f);
      const segs = rel.split(path.sep);
      const pkg = segs.slice(0, -1).join('.');
      if (pkg) seenPkgs.add(pkg);
      let clsList;
      try { clsList = scanJavaFile(src, opt.maxMethodsPerClass, isKotlin); } catch { continue; }
      // Kotlin 文件门面：文件里**没有任何类型声明**（纯顶层 fun/val），但 JVM 侧它就是 `<Stem>` 这个类。
      // 不补这一步，kfflib 这种「一个 .kt 一个门面」的库会整棵漏掉
      // （实测 kfflib-6.3.0 的 30 个文件里，现行只收到 1 个类，25 个是纯门面）。
      if (!clsList.length && isKotlin && FACADE_DECL_RE.test(src)) {
        const stem = path.basename(f).replace(/\.java$/, '');
        if (/^[A-Za-z_$][\w$]*$/.test(stem) && !/^(package-info|module-info)$/.test(stem)) {
          try {
            const facade = scanJavaFile(src, opt.maxMethodsPerClass, true, stem);
            if (facade.length) {
              clsList = facade;
              facadeFiles++;
            }
          } catch {
            /* 保持既有行为：解析失败 = 不收，不抛 */
          }
        }
      }
      for (const cls of clsList) {
        if (verClassCount >= opt.maxClasses || verMethodCount >= opt.maxMethods) { verTruncated = true; break; }
        const fqn = pkg ? `${pkg}.${cls.name}` : cls.name;
        if (classes.includes(fqn)) continue;
        classes.push(fqn);
        verClassCount++;
        classCount++;
        const m = [];
        for (const mm of cls.methods) {
          if (verMethodCount >= opt.maxMethods) { verTruncated = true; break; }
          if (m.length >= opt.maxMethodsPerClass) break;
          m.push(mm.sig);
          verMethodCount++;
          methodCount++;
        }
        methods[fqn] = m;
      }
    }
    if (verTruncated) { truncated = true; truncatedVersions++; }
    versions[ver] = {
      packages: [...seenPkgs].sort(),
      classes,
      methods,
      sampleCount,
      ...(fileTruncated ? { fileTruncated: true } : {}),
      ...(verTruncated ? { truncated: true } : {}),
    };
    if (classCount >= opt.maxClasses || methodCount >= opt.maxMethods) {
      capsHit = true;
      break;
    }
  }
  let skippedVersions = 0;
  if (capsHit && versionDirs.length > Object.keys(versions).length) {
    for (const ver of versionDirs.slice(Object.keys(versions).length)) {
      versions[ver] = { packages: [], classes: [], methods: {}, sampleCount: 0, skipped: true };
      skippedVersions++;
    }
  }
  for (const ver of droppedVersions) {
    versions[ver] = { packages: [], classes: [], methods: {}, sampleCount: 0, skipped: true };
    skippedVersions++;
  }
  if (skippedVersions > 0) truncated = true;

  const slug = slugOf(entry);
  const result = {
    slug,
    modId: entry.modIds[0] || '',
    id: entry.id,
    role: entry.role,
    source: { shard: src.shard, dirs: src.dirs, merged: src.merged },
    generatedAt: new Date().toISOString(),
    versions,
    classCount,
    methodCount,
    ...(facadeFiles ? { facadeFiles } : {}),
    ...(truncated ? { truncated: true } : {}),
    ...(truncatedVersions ? { truncatedVersions } : {}),
    ...(skippedVersions ? { skippedVersions } : {}),
    ...(droppedVersions.length ? { droppedVersions } : {}),
  };
  const shortfall = truncated
    ? ` | [截断] 版本内截断 ${truncatedVersions}，未提取 ${skippedVersions}（上限跳过 ${skippedVersions - droppedVersions.length} + maxVersions 丢弃 ${droppedVersions.length}）`
    : '';
  if (!opt.write) {
    console.log(`[dry-run] ${slug} | 版本 ${Object.keys(versions).length} | 类 ${classCount} | 方法 ${methodCount}${shortfall}（加 --write 才落盘）`);
    return result;
  }
  fs.writeFileSync(
    path.join(opt.out, `${slug}.json`),
    JSON.stringify(result, null, 2),
    'utf8',
  );
  const ms = Date.now() - libStarted;
  const verCount = Object.keys(versions).length;
  console.log(
    `[完成] ${slug} | id=${entry.id} | modId=${result.modId} | source=${src.shard}/${src.dirs.join('+')}${src.merged ? ' [合并]' : ''} | 版本 ${verCount} | 类 ${classCount} | 方法 ${methodCount}` +
      `${facadeFiles ? ` | 门面补回 ${facadeFiles}` : ''}${shortfall} | ${ms}ms`,
  );
  for (const [ver, v] of Object.entries(versions)) {
    console.log(`    ${ver}: 类 ${v.classes.length} 方法 ${Object.values(v.methods).reduce((a, m) => a + m.length, 0)} 样本 ${v.sampleCount}${v.skipped ? ' (上限跳过，未提取)' : ''}${v.truncated ? ' (类/方法上限截断)' : ''}${v.fileTruncated ? ' (文件截断)' : ''}`);
  }
  return result;
}

// ---------- main ----------
function main() {
  const opt = parseArgs(process.argv.slice(2));
  if (opt.write) fs.mkdirSync(opt.out, { recursive: true });
  loadJsonlDirs();
  const entries = parseCatalog();
  console.log(`库清单: ${entries.length} 条 (${CATALOG_PATH})`);
  console.log(`输出目录: ${opt.out}`);
  console.log(`缓存分片: ${opt.caches.join(', ')}`);
  console.log(`上限: 文件/版本=${opt.maxFiles} 类/库=${opt.maxClasses} 方法/库=${opt.maxMethods} 方法/类=${opt.maxMethodsPerClass}\n`);

  const filtered = opt.only
    ? entries.filter(
        (e) =>
          e.id === opt.only ||
          e.slug === opt.only ||
          e.modIds.includes(opt.only) ||
          (opt.only.includes('/') && e.id.endsWith(opt.only)),
      )
    : entries;
  if (opt.only && filtered.length === 0) {
    console.error(`--only "${opt.only}" 未匹配任何条目（可用 id / slug / modId）`);
    process.exit(1);
  }

  let ok = 0;
  let totalClasses = 0;
  let totalMethods = 0;
  let truncatedLibs = 0;
  let skippedVersionTotal = 0;
  let truncatedVersionTotal = 0;
  for (const entry of filtered) {
    const r = processLib(entry, opt);
    if (r) {
      ok++; totalClasses += r.classCount; totalMethods += r.methodCount;
      if (r.truncated) truncatedLibs++;
      skippedVersionTotal += r.skippedVersions ?? 0;
      truncatedVersionTotal += r.truncatedVersions ?? 0;
    }
  }
  // 产物大小：只统计本次库清单引用的文件，游离文件另报（否则改名/删条目后统计永远偏高）
  const referenced = new Set(entries.map((e) => `${slugOf(e)}.json`));
  let totalBytes = 0;
  let fileCount = 0;
  const orphans = [];
  if (opt.write && fs.existsSync(opt.out)) {
    for (const f of fs.readdirSync(opt.out)) {
      const p = path.join(opt.out, f);
      let size = 0;
      try { size = fs.statSync(p).size; } catch { continue; }
      if (referenced.has(f)) { totalBytes += size; fileCount++; }
      else orphans.push(f);
    }
  }
  console.log(`\n===== 汇总 =====`);
  console.log(`成功 ${ok} / 处理 ${filtered.length} (共 ${entries.length} 条)`);
  console.log(`总类 ${totalClasses} | 总方法 ${totalMethods}`);
  console.log(`截断库 ${truncatedLibs} | 版本内截断 ${truncatedVersionTotal} | 未提取版本 ${skippedVersionTotal}（上限/条数截断，详见各 JSON 的 skipped 标记）`);
  if (orphans.length > 0) console.log(`游离产物文件 ${orphans.length} 个（未被库清单引用，未计入统计）: ${orphans.join(', ')}`);
  console.log(`产物文件 ${fileCount} 个 | 合计 ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
}

main();
