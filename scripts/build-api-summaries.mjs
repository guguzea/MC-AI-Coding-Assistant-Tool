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
  for (let i = bracket; i < src.length; i++) {
    const c = src[i];
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
          // verifiedApi 下所有 packages 的并集
          const prefixes = [];
          const vaStart = block.indexOf('verifiedApi:');
          if (vaStart !== -1) {
            for (const m of block.slice(vaStart).matchAll(/packages:\s*\[([^\]]*)\]/g)) {
              for (const pm of m[1].matchAll(/"([^"]+)"/g)) prefixes.push(pm[1]);
            }
          }
          entries.push({ id, modIds, slug, role, prefixes: [...new Set(prefixes)] });
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
  // 前缀回退（如 modId=owo-lib 而缓存目录为 owo；仅精确匹配失败时使用）
  for (const cacheRoot of caches) {
    const base = path.join(cacheRoot, 'decompiled-mods');
    let dirs = [];
    try { dirs = fs.readdirSync(base); } catch { continue; }
    for (const cand of unique) {
      if (cand.length < 3) continue;
      const norm = normalize(cand);
      for (const d of dirs) {
        if (d.length < 3) continue;
        const dn = normalize(d);
        if (dn === norm) continue; // 精确匹配已处理
        if (dn.startsWith(norm) || norm.startsWith(dn)) {
          const p = path.join(base, d);
          try {
            if (fs.statSync(p).isDirectory()) return { dir: p, shard: path.basename(cacheRoot), name: d };
          } catch { /* ignore */ }
        }
      }
    }
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
const KOTLIN_MARKER = /(@SourceDebugExtension|import kotlin\.|\bopen class|\bsealed class|\bdata class|\benum class|\bobject [A-Za-z_$]|\bfun\s+[A-Za-z_$]|\bval\s+[A-Za-z_$])/;
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
 */
function scanJavaFile(src, maxMethodsPerClass, isKotlin) {
  const out = [];
  const n = src.length;
  let depth = 0;
  let cur = null; // {name, methods, bodyDepth}
  let i = 0;

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

function processLib(entry, opt) {
  const src = resolveSourceDirs(entry, opt);
  if (!src) {
    const names = [...entry.modIds, entry.slug].filter(Boolean).join(', ');
    console.log(`[跳过] ${entry.id} (modIds=[${names}]): 三个缓存分片均无 decompiled-mods 目录`);
    return null;
  }
  const libStarted = Date.now();
  const srcDirs = src.dirs.map((d) => ({ name: d, dir: path.join(src.root, d) }));
  // 版本目录（所有来源目录的并集；新版本在前，保证截断发生时最新 API 优先保留）
  const verSet = new Set();
  for (const sd of srcDirs) {
    try {
      for (const e of fs.readdirSync(sd.dir, { withFileTypes: true })) {
        if (e.isDirectory()) verSet.add(e.name);
      }
    } catch { /* ignore */ }
  }
  let versionDirs = [...verSet].sort((a, b) => cmpVersions(b, a));
  if (versionDirs.length > opt.maxVersions) {
    console.log(`[警告] ${entry.id}: 版本数 ${versionDirs.length} 超过上限 ${opt.maxVersions}，截断`);
    versionDirs = versionDirs.slice(0, opt.maxVersions);
  }
  const prefixes = entry.prefixes.length > 0 ? entry.prefixes : null;

  const versions = {};
  let classCount = 0;
  let methodCount = 0;
  let truncated = false;

  for (const ver of versionDirs) {
    const fileSet = new Set();
    for (const sd of srcDirs) {
      const verDir = path.join(sd.dir, ver);
      if (!fs.existsSync(verDir)) continue;
      const vfiles = [];
      collectJavaFiles(verDir, '', prefixes, vfiles, opt.maxFiles, 0, opt.maxDepth);
      for (const f of vfiles) fileSet.add(f);
    }
    const files = [...fileSet];
    const sampleCount = files.length;
    const fileTruncated = files.length >= opt.maxFiles;
    const classes = [];
    const methods = {};
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
      const srcDir = srcDirs.filter((sd) => f.startsWith(sd.dir)).sort((a, b) => b.dir.length - a.dir.length)[0] ?? srcDirs[0];
      const rel = path.relative(path.join(srcDir.dir, ver), f);
      const segs = rel.split(path.sep);
      const pkg = segs.slice(0, -1).join('.');
      let clsList;
      try { clsList = scanJavaFile(src, opt.maxMethodsPerClass, isKotlin); } catch { continue; }
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
    if (verTruncated) truncated = true;
    versions[ver] = {
      packages: entry.prefixes,
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
  if (capsHit && versionDirs.length > Object.keys(versions).length) {
    for (const ver of versionDirs.slice(Object.keys(versions).length)) {
      versions[ver] = { packages: entry.prefixes, classes: [], methods: {}, sampleCount: 0, skipped: true };
    }
  }

  const slugRaw = entry.slug || entry.id.replace(/^authored\/lib-/, '');
  const slug = slugRaw.replace(/[^A-Za-z0-9._-]/g, '_');
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
    ...(truncated ? { truncated: true } : {}),
  };
  if (!opt.write) {
    console.log(`[dry-run] ${slug} | 版本 ${Object.keys(versions).length} | 类 ${classCount} | 方法 ${methodCount}（加 --write 才落盘）`);
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
    `[完成] ${slug} | id=${entry.id} | modId=${result.modId} | source=${src.shard}/${src.dirs.join('+')}${src.merged ? ' [合并]' : ''} | 版本 ${verCount} | 类 ${classCount} | 方法 ${methodCount}${truncated ? ' | [截断]' : ''} | ${ms}ms`,
  );
  for (const [ver, v] of Object.entries(versions)) {
    console.log(`    ${ver}: 类 ${v.classes.length} 方法 ${Object.values(v.methods).reduce((a, m) => a + m.length, 0)} 样本 ${v.sampleCount}${v.fileTruncated ? ' (文件截断)' : ''}`);
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
  for (const entry of filtered) {
    const r = processLib(entry, opt);
    if (r) { ok++; totalClasses += r.classCount; totalMethods += r.methodCount; }
  }
  // 产物大小
  let totalBytes = 0;
  let fileCount = 0;
  if (opt.write && fs.existsSync(opt.out)) {
    for (const f of fs.readdirSync(opt.out)) {
      const p = path.join(opt.out, f);
      try { totalBytes += fs.statSync(p).size; fileCount++; } catch { /* ignore */ }
    }
  }
  console.log(`\n===== 汇总 =====`);
  console.log(`成功 ${ok} / 处理 ${filtered.length} (共 ${entries.length} 条)`);
  console.log(`总类 ${totalClasses} | 总方法 ${totalMethods}`);
  console.log(`产物文件 ${fileCount} 个 | 合计 ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
}

main();
