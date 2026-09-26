#!/usr/bin/env node
/**
 * build-lib-manifest.mjs — 生成库模组版本 manifest（计划 §5.3 / §5.4，数据驱动不去猜）
 *
 * 数据源（不预设版本、不手填版本号）：
 *   1. mcp-server/src/diagnostics/library-catalog.ts 的 LIBRARY_CATALOG（modrinthSlug 主源；
 *      import 编译产物失败则正则解析 .ts）
 *   2. community_knowledge/authored/lib-*.md + library-integration*.md 的 frontmatter modrinthSlug（补充）
 * 流程：
 *   - 对每个非空 slug **翻页**请求 https://api.modrinth.com/v2/project/<slug>/version?limit=100&offset=N
 *     （该端点默认页 = 100；旧写法不带 limit/offset ⇒ 上游 >100 个版本的 slug 被**静默截断**，
 *     2026-09-25 现扫 48 slug 里 31 个中招 ⇒ 见 CONTRIBUTING.md §未排期清单。该 48 是**本脚本翻页修复前**
 *     那份首页截断面自身的分母（截断从件内不可见，故此数只作历史归位）；修复后重抓的现面 = 49 slug / 3,003 行，
 *     口径与复算命令见 mcp-server/README.md §数据来源与边界）
 *   - 展开全部 (game_version × loader) 组合，含 release/beta/alpha（记录 version_type）
 *   - 去重：同 (game_version, loader, modId) 保留 release 优先；无 release 用最新 beta/alpha（标注）
 *   - 写 file url + sha512 + version_type 到 mcp-server/data/lib-manifests/all.json
 * 失败策略（第 44 轮改造；旧文是「跳过并打印警告」，那等于**静默删库**）：
 *   1. 逐 slug 结果分**四类**并按类打印计数：`ok` / `capped`（翻页触顶）/ `notfound`（上游 404，
 *      或本仓 slug 源已不再点名该 slug）/ `error`（退避重试后仍失败，含「200 但展开 0 行」）。
 *   2. 非 ok 的 slug **继承旧面该 slug 的全部行**，并加**新增可选键**（slug 级
 *      `partial` / `captureState` / `capturedPages` / `inheritedFrom` / `failureReason`；
 *      entry 的既有 8 键一字不改，下游按 8 键解析）。
 *   3. 同时**整次运行退出码非 0**，并打印「哪几个 slug 不完整、继承自哪一版」。
 *   4. 旧面里也没有该 slug ⇒ 无处可继承，单列 `dropped` 清单 loudly 报出（仍判非 0），绝不静默。
 *   5. `--require-complete` ⇒ 任何 capped/notfound/error 直接判失败且**不落盘**（保守档，默认关）。
 *   为什么必须继承：旧策略下重跑一次会把 `jei`（前 30 页全满 ⇒ 上游版本数 ≥3000，触顶即整条丢弃）
 *   与三个已 404 库的行**全部抹掉**——那 3 行还不是本生产者能再生成的（Modrinth 已 404，历史上由人工
 *   按非 Modrinth 源补抓，见 `mcp-server/scripts/assert-lib-ownership.mjs` 的 2026-09-16 签字）。
 *   触顶仍绝不当「抓全了」：宁可非 0 退出，也不留一份看不出缺口的快照。
 *
 * 用法：node scripts/build-lib-manifest.mjs                        # dry-run（只统计，不写盘）
 *      node scripts/build-lib-manifest.mjs --out=temp/x.json --force  # 候选文件（落 temp/，不碰真面）
 *      node scripts/build-lib-manifest.mjs --only=owo-lib,geckolib --out=temp/x.json --write
 *      node scripts/build-lib-manifest.mjs --require-complete       # 任何未抓全都判失败且不落盘（默认关）
 *      node scripts/build-lib-manifest.mjs --write                 # 覆盖真面（先自动复制 all.json.bak）
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { dirname, isAbsolute, join, resolve, sep } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { wantWrite, logDryRunBanner, scratchWriteText } from "./_lib/write-guard.mjs";
import { fetchJsonWithUa, failureNote } from "./_lib/fetch-with-ua.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CATALOG_SRC = join(ROOT, "mcp-server", "src", "diagnostics", "library-catalog.ts");
const CATALOG_DIST = join(ROOT, "mcp-server", "dist", "diagnostics", "library-catalog.js");
const AUTHORED_DIR = join(ROOT, "community_knowledge", "authored");
const OUT_DIR = join(ROOT, "mcp-server", "data", "lib-manifests");
const OUT_FILE = join(OUT_DIR, "all.json");

const TIMEOUT_MS = 15000; // 每个请求 15s 超时
const CONCURRENCY = 4;
const USER_AGENT = "MC-AI-Coding-Assistant-Tool/build-lib-manifest (repo: MC_skill)";
const TYPE_RANK = { release: 0, beta: 1, alpha: 2 };
/** sha512 字段只装真 128 位十六进制；缺 sha512 的构件不可校验，不入清单 */
const SHA512_RE = /^[0-9a-f]{128}$/i;

/* ------------------------- 分页与退避（2026-09-25 截断修复） ------------------------- */
/**
 * Modrinth `/project/<slug>/version` 的分页帽：不传 limit 时默认每页 **100** 个版本，
 * 且**超出部分不报错、直接看不见**（实测：fabric-language-kotlin 快照 237 行，但快照是按
 * 「一页 100 个版本 × loader 展开」算出来的，谁也无法从快照内部判断上游到底有 100 还是 900 个版本）。
 * ⇒ 抓全必须 offset 递增、直到某页 < PAGE_SIZE；触顶必须**判失败**，不许静默截断。
 */
const PAGE_SIZE = 100;
const MAX_PAGES = 30; // 30 × 100 = 3000 版本/slug 的上限；第 30 页仍是满页 ⇒ 判该 slug 失败
const RETRY_DELAYS = [1000, 3000, 6000]; // 429 / 5xx / 链路抖动；本机 OneDrive 与网络抖动会造出假 0 行

/* ------------------------------ frontmatter ------------------------------ */

function parseArray(value) {
  // "[a, \"b\", 'c']" → ["a","b","c"]；非数组 → 单元素
  const v = String(value).trim();
  if (v.startsWith("[") && v.endsWith("]")) {
    return v
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter((s) => s !== "");
  }
  const bare = v.replace(/^["']|["']$/g, "");
  return bare === "" ? [] : [bare];
}

function parseFrontmatter(text) {
  const meta = {};
  if (!text.startsWith("---")) return meta;
  const end = text.indexOf("\n---", 3);
  if (end < 0) return meta;
  for (const line of text.slice(3, end).split(/\r?\n/)) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    const value = m[2].trim();
    if (value === "") {
      meta[key] = "";
    } else if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = parseArray(value);
    } else {
      meta[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return meta;
}

function walkFiles(dir, ext, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) walkFiles(p, ext, out);
    else if (name.endsWith(ext)) out.push(p);
  }
  return out;
}

/* --------------------------- slug 来源：catalog --------------------------- */

/**
 * 读 library-catalog.ts 的 LIBRARY_CATALOG：
 * 优先 import 编译产物 dist/diagnostics/library-catalog.js；
 * 失败则按 TS 源文件的条目结构（`  {` … `  },`）正则提取字段。
 */
async function loadCatalogEntries() {
  if (existsSync(CATALOG_DIST)) {
    try {
      const mod = await import(pathToFileURL(CATALOG_DIST).href);
      if (Array.isArray(mod.LIBRARY_CATALOG) && mod.LIBRARY_CATALOG.length > 0) {
        console.log(`[manifest] 已从 dist 加载 LIBRARY_CATALOG（${mod.LIBRARY_CATALOG.length} 条）`);
        return mod.LIBRARY_CATALOG;
      }
    } catch (err) {
      console.warn(`[manifest] import dist 失败（${err.message}），改用正则解析 TS 源文件`);
    }
  }
  const text = readFileSync(CATALOG_SRC, "utf8");
  const entries = [];
  let current = null;
  let depth = 0;
  for (const line of text.split(/\r?\n/)) {
    if (!current) {
      if (/^\s*\{\s*$/.test(line)) {
        current = { raw: [] };
        depth = 1;
      }
      continue;
    }
    // 括号深度状态：内层 verifiedApi 对象的独占闭合行不是条目边界
    // （本文件由脚本生成，字符串字面量内不含大括号，故按行计数即可）
    let closed = false;
    for (const ch of line) {
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) closed = true;
      }
    }
    if (closed) {
      entries.push(parseCatalogEntry(current.raw.join("\n")));
      current = null;
    } else {
      current.raw.push(line);
    }
  }
  if (entries.length === 0) {
    throw new Error(`无法从 ${CATALOG_SRC} 解析出任何 LIBRARY_CATALOG 条目`);
  }
  console.log(`[manifest] 已从 TS 源正则解析 LIBRARY_CATALOG（${entries.length} 条）`);
  return entries;
}

function grab(raw, key) {
  const m = raw.match(new RegExp(`\\b${key}:\\s*(?:"([^"]*)"|\\[([^\\]]*)\\])`));
  if (!m) return undefined;
  if (m[1] !== undefined) return m[1];
  return parseArray(`[${m[2]}]`);
}

function parseCatalogEntry(raw) {
  const entry = { id: grab(raw, "id"), modIds: grab(raw, "modIds"), loaders: grab(raw, "loaders"), modrinthSlug: grab(raw, "modrinthSlug") };
  entry.skillId = grab(raw, "skillId") || "";
  entry.role = grab(raw, "role") || "";
  return entry;
}

/* ------------------------- slug 来源：authored 短文 ------------------------ */

function loadAuthoredSlugs() {
  const bySlug = new Map();
  for (const file of walkFiles(AUTHORED_DIR, ".md")) {
    const name = file.split(/[\\/]/).pop();
    if (!/^lib-.*\.md$/.test(name) && !/^library-integration.*\.md$/.test(name)) continue;
    const meta = parseFrontmatter(readFileSync(file, "utf8"));
    const slug = String(meta.modrinthSlug || "").trim();
    if (!slug) continue;
    // 支持逗号分隔多 slug（如一篇短文覆盖 JEI/EMI/REI）
    for (const one of slug.split(",").map((s) => s.trim()).filter(Boolean)) {
      if (!bySlug.has(one)) {
        bySlug.set(one, {
          slug: one,
          id: meta.id || name.replace(/\.md$/, ""),
          modIds: Array.isArray(meta.modIds) ? meta.modIds : [],
          loaders: Array.isArray(meta.loaders) ? meta.loaders : [],
        });
      }
    }
  }
  return [...bySlug.values()];
}

/* ------------------------------ Modrinth API ------------------------------ */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * 单页请求，带 429/5xx/链路抖动退避重试。
 * 走 `fetchJsonWithUa`（UA + AbortSignal.timeout + win32 上 TLS 失败自动换 curl 腿），
 * 这样「抓不到」会被**分类**成 RATE_LIMITED / TIMEOUT / NOT_FOUND，而不是被当成「上游没有这个库」。
 * ⚠️ 不改系统代理与证书：需要梯子时由调用方按命令传，本脚本不读任何代理环境变量。
 */
async function fetchVersionPage(slug, offset) {
  const url = `https://api.modrinth.com/v2/project/${slug}/version?limit=${PAGE_SIZE}&offset=${offset}`;
  let lastNote = "无响应";
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    const res = await fetchJsonWithUa(url, { timeoutMs: TIMEOUT_MS, headers: { "User-Agent": USER_AGENT } });
    if (res.ok && Array.isArray(res.json)) return res.json;
    lastNote = res.ok ? "响应不是数组（API 形状变了）" : failureNote(res) || res.reason || `HTTP ${res.status}`;
    // 404 / 410 / 422 = slug 真不存在；403 = 明确拒绝：重试只会把「没有」洗成别的东西
    const retryable = !res.ok && res.retryable !== false && res.failureClass !== "NOT_FOUND" && res.failureClass !== "FORBIDDEN";
    if (!retryable || attempt === RETRY_DELAYS.length) {
      const err = new Error(`${lastNote}（offset=${offset}）`);
      err.status = res.status;
      err.failureClass = res.failureClass || "UNKNOWN";
      throw err;
    }
    console.warn(`[manifest] ${slug} offset=${offset} 第 ${attempt + 1} 次失败（${lastNote}），${RETRY_DELAYS[attempt]}ms 后重试`);
    await sleep(RETRY_DELAYS[attempt]);
  }
  throw new Error(`unreachable（${slug} offset=${offset}）`);
}

/**
 * 抓某 slug 的**全部**版本（翻页直到某页 < PAGE_SIZE）。
 * 触顶（第 MAX_PAGES 页仍是满页）⇒ 抛错判该 slug 失败：静默截断正是本轮要修的病。
 * 抛出的错误一律带 `failureClass`（PAGE_CAP / NOT_FOUND / 网络与状态码类）与 `pages`
 * （失败时已抓到第几页），供落盘段的**失败继承**打标用（slug 级 `capturedPages`）。
 * @returns {{versions: any[], pages: number}}
 */
async function fetchAllVersions(slug) {
  const versions = [];
  let pages = 0;
  try {
    for (let offset = 0; ; offset += PAGE_SIZE) {
      const page = await fetchVersionPage(slug, offset);
      pages++;
      versions.push(...page);
      if (page.length < PAGE_SIZE) return { versions, pages };
      if (pages >= MAX_PAGES) {
        const err = new Error(`翻页触顶：前 ${MAX_PAGES} 页全是 ${PAGE_SIZE} 个版本 ⇒ ${slug} 上游版本数 ≥ ${MAX_PAGES * PAGE_SIZE}，本脚本拒绝静默截断（要收口就调大 MAX_PAGES 后重跑）`);
        err.failureClass = "PAGE_CAP";
        throw err;
      }
    }
  } catch (err) {
    if (err.pages === undefined) err.pages = pages; // PAGE_CAP 时 pages 已 = MAX_PAGES；翻页中途失败时 = 已成功的页数
    throw err;
  }
}

/**
 * 展开 (game_version × loader) 组合全集并去重：
 * 同 (gameVersion, loader, modId) 保留一个，release 优先，其次按发布时间取最新 beta/alpha。
 */
function buildEntries(versions, modId) {
  const picked = new Map();
  for (const v of versions) {
    const type = String(v.version_type || "alpha");
    const rank = TYPE_RANK[type] ?? 3;
    const published = new Date(v.date_published || 0).getTime();
    const file = (v.files || []).find((f) => f.primary) || (v.files || [])[0];
    if (!file) continue;
    for (const gameVersion of v.game_versions || []) {
      for (const loader of v.loaders || []) {
        const key = `${gameVersion}|${loader}|${modId}`;
        const cur = picked.get(key);
        if (!cur || rank < cur.rank || (rank === cur.rank && published > cur.published)) {
          const hashes = file.hashes || {};
          picked.set(key, {
            gameVersion,
            loader,
            modId,
            fileName: file.filename || "",
            url: file.url || "",
            // 只接受真 sha512：旧写法 `hashes.sha512 || hashes.sha256` 会把 64 位 sha256 塞进本字段，
            // 而下游 batch-decompile.mjs 用 sha512OfFile() 比它（缓存命中判定 + 下载后校验）⇒ 永不匹配、反复重下。
            sha512: SHA512_RE.test(hashes.sha512 || "") ? hashes.sha512 : "",
            versionType: type,
            versionNumber: v.version_number || "",
            rank,
            published,
          });
        }
      }
    }
  }
  const usable = [];
  const unverifiable = [];
  for (const e of picked.values()) (e.sha512 ? usable : unverifiable).push(e);
  if (unverifiable.length > 0) {
    console.warn(`[build-lib-manifest] ${modId}: 丢弃 ${unverifiable.length} 个无 sha512 的构件（首个 ${unverifiable[0].fileName}）——下游按 sha512 校验，留着必然下载失败`);
  }
  return usable
    .sort((a, b) => a.gameVersion.localeCompare(b.gameVersion) || a.loader.localeCompare(b.loader))
    .map(({ rank, published, ...entry }) => entry);
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const idx = next++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

/* --------------------- 失败继承（2026-09-25 第 44 轮） --------------------- */

/** 四类失败名：capped（触顶）/ notfound（上游 404 或本仓 slug 源不再点名）/ error（其它）。 */
export const FAILURE_KINDS = ["capped", "notfound", "error"];

/** notfound 的固定处置句：进 `failureReason`（落盘可核对）也进 stdout，两条腿（上游 404 / 本仓不再点名）共用。 */
export const NOTFOUND_HINT =
  "上游已改名/下架时的候选源：`knowledge/libs/**` 的 frontmatter `modrinthSlug` 与 `mcp-server/src/diagnostics/library-catalog.ts` 的 `modrinthSlug`；本脚本**不自动改名**（改名是内容判断，留给人确认后落笔）";

/** 把一次抓取异常归到三类失败之一（PAGE_CAP / NOT_FOUND 由 fetch-with-ua 与 fetchAllVersions 打类别）。 */
export function classifyFailureKind(failureClass) {
  if (failureClass === "PAGE_CAP") return "capped";
  if (failureClass === "NOT_FOUND") return "notfound";
  return "error";
}

/**
 * 读旧面（真面 all.json）作为**继承源**：slug → { entries, partial, inheritedFrom }。
 * 只读；文件缺失或 JSON 坏掉时返回空表（调用方据此把失败 slug 记进 dropped，而不是静默删行）。
 * `ref` 是「继承自哪一版」的可核对串（路径 + mtime + slug/行数），写进新增键 `inheritedFrom`。
 */
function loadPreviousFace() {
  const empty = { bySlug: new Map(), ref: "（旧面不存在，无处可继承）", slugs: 0, rows: 0 };
  if (!existsSync(OUT_FILE)) return empty;
  let bySlug;
  try {
    const prev = JSON.parse(readFileSync(OUT_FILE, "utf8"));
    bySlug = new Map();
    for (const item of Array.isArray(prev) ? prev : []) {
      if (typeof item?.slug !== "string" || !Array.isArray(item.entries)) continue;
      bySlug.set(item.slug, item);
    }
  } catch (err) {
    console.warn(`[manifest] ⚠️ 旧面 ${OUT_FILE} 解析失败（${err.message}）⇒ 本轮**无行可继承**，失败 slug 会进「无处可继承」清单，不会静默消失`);
    return { ...empty, ref: "（旧面不可读）" };
  }
  const rows = [...bySlug.values()].reduce((n, x) => n + x.entries.length, 0);
  const mtime = statSync(OUT_FILE).mtime.toISOString();
  return {
    bySlug,
    ref: `${OUT_FILE.replace(/\\/g, "/")}@${mtime}（${bySlug.size} slug / ${rows} 行）`,
    slugs: bySlug.size,
    rows,
  };
}

/**
 * 落盘组装：四类计数 + 失败继承 + 无处可继承清单。
 * **不写盘、不 exit**（投毒夹具可直接喂 results/previous 复跑本函数，见报告 §2）。
 * @param {{results: any[], previous: Map<string,{entries:any[],partial?:boolean,inheritedFrom?:string}>, prevRef: string, fullRun: boolean}} p
 * @returns {{manifest: any[], counts: Record<string,string[]>, inherited: any[], dropped: any[], capHit: string[],
 *            failed: string[], freshRows: number, inheritedRows: number, totalRows: number, totalVersions: number}}
 */
export function assembleManifest({ results, previous, prevRef, fullRun }) {
  const counts = { ok: [], capped: [], notfound: [], error: [] };
  const manifest = [];
  const inherited = [];
  const dropped = [];
  const capHit = [];
  const failed = [];
  const seen = new Set();
  let freshRows = 0;
  let totalVersions = 0;

  /** 一条失败：能继承就继承旧行 + 打标，不能继承就单列 dropped；两类都算失败（计数与 rc 由调用方判）。 */
  const takeFailure = (slug, kind, reason, pages) => {
    counts[kind].push(slug);
    const fullReason = kind === "notfound" ? `${reason}｜${NOTFOUND_HINT}` : reason;
    failed.push(`${slug}（${kind}）：${fullReason}`);
    if (kind === "capped") capHit.push(slug);
    const prevItem = previous.get(slug);
    const prevEntries = prevItem && Array.isArray(prevItem.entries) ? prevItem.entries : [];
    if (prevEntries.length > 0) {
      const chain = prevItem.partial ? `（上游继承：${prevItem.inheritedFrom || "旧面未标"}）` : "";
      const item = {
        slug,
        // 既有 8 键原样搬（下游按 8 键解析），标记只走**新增可选键**
        entries: prevEntries.map((e) => ({ ...e })),
        partial: true,
        captureState: kind,
        inheritedFrom: `${prevRef}${chain}`,
        failureReason: fullReason,
      };
      if (typeof pages === "number" && pages > 0) item.capturedPages = pages; // 0 页（第一页就 404）无页数可标
      manifest.push(item);
      inherited.push({ slug, kind, rows: prevEntries.length, reason: fullReason, pages, from: prevRef });
    } else {
      dropped.push({ slug, kind, reason: fullReason });
    }
  };

  for (const lib of results) {
    seen.add(lib.slug);
    if (lib.error) {
      takeFailure(lib.slug, lib.kind || "error", lib.error, lib.pages);
      continue;
    }
    const entries = buildEntries(lib.versions, lib.modId);
    if (entries.length === 0) {
      // 200 但展开 0 行：上游可能整档改名/下架，不能当成「该库没有版本」而删掉旧行
      takeFailure(lib.slug, "error", `上游 200 但展开后 0 条 (game_version × loader) 条目（版本 ${lib.versions.length} 个 / ${lib.pages} 页）⇒ 不编造版本，也不据此删旧行`, lib.pages);
      continue;
    }
    freshRows += entries.length;
    totalVersions += lib.versions.length;
    manifest.push({ slug: lib.slug, entries });
    counts.ok.push(lib.slug);
  }

  if (fullRun) {
    // 旧面有、今日 slug 全集不再点名的 slug：不 fetch 就是**静默删行**（三个 404 库正走这条腿）
    for (const slug of [...previous.keys()].sort((a, b) => a.localeCompare(b))) {
      if (seen.has(slug)) continue;
      takeFailure(slug, "notfound", "不在今日 slug 全集（catalog `modrinthSlug` / authored frontmatter 已不再点名该 slug）⇒ 生产者本轮不会去抓它", undefined);
    }
  }

  const inheritedRows = inherited.reduce((n, x) => n + x.rows, 0);
  return {
    manifest,
    counts,
    inherited,
    dropped,
    capHit,
    failed,
    freshRows,
    inheritedRows,
    totalRows: freshRows + inheritedRows,
    totalVersions,
  };
}

/* --------------------------------- 主流程 --------------------------------- */

/** `--name=value` 取值（与既有 `process.argv.includes("--force")` 同风格，不引第三方解析器）。 */
function flagValue(name) {
  const hit = process.argv.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : undefined;
}

async function main() {
  // 1. slug 全集：catalog 优先，authored 补充（按 slug 去重）
  const catalog = await loadCatalogEntries();
  const authored = loadAuthoredSlugs();
  const bySlug = new Map();
  for (const e of catalog) {
    const slug = String(e.modrinthSlug || "").trim();
    if (!slug) continue;
    for (const one of slug.split(",").map((s) => s.trim()).filter(Boolean)) {
      if (bySlug.has(one)) continue;
      bySlug.set(one, {
        slug: one,
        id: e.id,
        modId: (e.modIds || [])[0] || one,
        loaders: e.loaders || [],
        skillId: e.skillId || "",
        source: "catalog",
      });
    }
  }
  for (const e of authored) {
    if (bySlug.has(e.slug)) continue; // catalog 优先
    bySlug.set(e.slug, { slug: e.slug, id: e.id, modId: (e.modIds || [])[0] || e.slug, loaders: e.loaders || [], skillId: "", source: "authored" });
  }
  const allLibraries = [...bySlug.values()];

  // 1b. --only=a,b：只跑点名的 slug（修一个库时不必重跑 48 个 ⇒ 也少挨一轮限流）
  const only = (flagValue("--only") || "").split(",").map((s) => s.trim()).filter(Boolean);
  let libraries = allLibraries;
  if (only.length > 0) {
    const known = new Set(allLibraries.map((l) => l.slug));
    for (const s of only) if (!known.has(s)) console.warn(`[manifest] ⚠️ --only 里的 ${s} 不在 slug 全集（catalog + authored 短文）里 ⇒ 该项会被忽略`);
    libraries = allLibraries.filter((l) => only.includes(l.slug));
    console.log(`[manifest] --only 生效：${libraries.length}/${allLibraries.length} 个 slug`);
    // 全拼错（libraries.length===0）时会产出**空清单**，而空清单以 failed=0 一路过闸门写进真面
    // ⇒ 这正是本轮要修的病的镜像（静默把面清空）。一律判失败；要真空面须显式 --force。
    if (libraries.length === 0) {
      console.error(`[manifest] 致命错误: --only 的 ${only.length} 个 slug 没有一个在 slug 全集里（全集 ${allLibraries.length} 个），拒绝产出空清单`);
      process.exit(2);
    }
  }

  // 1c. 旧面 = **失败继承源**（只读）。文件缺失/坏 JSON 时继承腿自动降级成「无处可继承」清单，
  //     失败 slug 依旧被报出来 —— 静默删行是本轮要修的病，任何分支都不许把它藏回去。
  const prev = loadPreviousFace();

  // 2. 请求全部版本列表（**翻页**抓全，见 fetchAllVersions）；异常按 failureClass 归三类
  let totalPages = 0;
  const results = await mapLimit(libraries, CONCURRENCY, async (lib) => {
    try {
      const { versions, pages } = await fetchAllVersions(lib.slug);
      totalPages += pages;
      console.log(`[manifest] ${lib.slug}（${lib.modId}）→ ${versions.length} 个版本 / ${pages} 页`);
      return { ...lib, versions, pages };
    } catch (err) {
      const kind = classifyFailureKind(err.failureClass);
      const label = kind === "capped" ? "翻页触顶" : kind === "notfound" ? "上游 404/已下架" : "请求失败";
      console.warn(`[manifest] ⚠️ ${label}：${lib.slug}（${lib.id}）class=${err.failureClass || "UNKNOWN"} 第 ${err.pages ?? 0} 页 ⇒ 该 slug 本轮抓不全，将按旧面继承（${err.message}）`);
      // reason 只装 err.message（`failed` 列表已经带 `（kind）` 前缀，再拼 label 会念两遍）
      return { ...lib, error: err.message, kind, pages: err.pages };
    }
  });

  // 3. 组装输出（四类计数 + 失败继承；--only 的局部跑不做「旧面未点名 slug」那一条腿）
  const OUT_ARG = flagValue("--out");
  const WRITE = wantWrite();
  const REQUIRE_COMPLETE = process.argv.includes("--require-complete");
  const FULL_RUN = only.length === 0;
  const asm = assembleManifest({ results, previous: prev.bySlug, prevRef: prev.ref, fullRun: FULL_RUN });
  const incomplete = asm.counts.capped.length + asm.counts.notfound.length + asm.counts.error.length;

  // 4. 统计（**先报数后落笔**：--require-complete 拒绝写盘时，这四类计数也必须看得见）
  console.log("\n========== 统计 ==========");
  console.log(`本轮点名 slug 数: ${libraries.length}${FULL_RUN ? "" : `（slug 全集 ${allLibraries.length} 个，--only 生效）`}`);
  console.log(`四类计数 → ok ${asm.counts.ok.length} / capped ${asm.counts.capped.length} / notfound ${asm.counts.notfound.length} / error ${asm.counts.error.length}`);
  console.log(`写出 slug 数: ${asm.manifest.length} = 本轮新抓 ${asm.counts.ok.length} + 继承旧面 ${asm.inherited.length}（另有 ${asm.dropped.length} 个无处可继承）`);
  console.log(`条目数: ${asm.totalRows} = 本轮新抓 ${asm.freshRows} + 继承旧面 ${asm.inheritedRows}`);
  console.log(`版本数（Modrinth version 对象累计，翻页后）: ${asm.totalVersions}`);
  console.log(`HTTP 请求数（分页页码累计）: ${totalPages}`);
  console.log(`继承源（旧面）: ${prev.ref}`);
  for (const lib of asm.manifest) {
    const tag = lib.partial
      ? `  [♻️继承 captureState=${lib.captureState}${typeof lib.capturedPages === "number" ? ` / 抓到第 ${lib.capturedPages} 页` : ""}]`
      : "";
    console.log(`  - ${lib.slug.padEnd(24)} ${lib.entries.length} 条目${tag}`);
  }
  if (asm.inherited.length > 0) {
    console.log(`\n♻️ 失败继承（${asm.inherited.length} 个 slug 的行来自旧面，本轮没有重新抓到）:`);
    for (const x of asm.inherited) console.log(`  ♻️ ${x.slug}（${x.kind}）继承 ${x.rows} 行 ← ${prev.ref}｜原因：${x.reason}`);
  }
  if (asm.dropped.length > 0) {
    console.log(`\n❌ 无处可继承（旧面也没有该 slug ⇒ 本次输出**真少**这些库，绝不静默）:`);
    for (const x of asm.dropped) console.log(`  ❌ ${x.slug}（${x.kind}）：${x.reason}`);
  }
  if (asm.failed.length > 0) {
    console.log(`失败列表（${asm.failed.length}）:`);
    for (const f of asm.failed) console.log(`  ⚠️ ${f}`);
  } else {
    console.log("失败列表: 无");
  }
  if (asm.capHit.length > 0) {
    console.log(`❗翻页触顶（PAGE_CAP=${MAX_PAGES} 页 × ${PAGE_SIZE}）的 slug（${asm.capHit.length}）：${asm.capHit.join(", ")} —— 这些库的上游版本面**不完整**：已按旧面继承并打 partial 标记，本次运行仍判非 0。要收口就调大 MAX_PAGES 后重跑。`);
  }
  if (asm.counts.notfound.length > 0) {
    const emptySlugEntries = catalog.filter((e) => !String(e.modrinthSlug || "").trim()).length;
    console.log(`🔎 notfound 处置（${asm.counts.notfound.join(", ")}）：旧行保留、${NOTFOUND_HINT}。本轮 catalog ${catalog.length} 条、其中 slug 为空 ${emptySlugEntries} 条（空 slug = 本仓已承认 Modrinth 无该项目的落点）。`);
  }
  if (REQUIRE_COMPLETE && incomplete > 0) {
    console.error(`\n[manifest] --require-complete：${incomplete} 个 slug 未抓全（capped ${asm.counts.capped.length} / notfound ${asm.counts.notfound.length} / error ${asm.counts.error.length}）⇒ 判失败且**不落盘**（真面与候选都不写）。明细见上方统计。`);
    process.exit(2);
  }

  // 5. 写盘
  if (OUT_ARG) {
    // 候选件：只许落 temp/ 或仓库外（scratchWriteText 对「落进仓库且不在 temp/」直接 throw），
    // 不碰真面、不做 .bak —— 覆盖真面仍是 --write 那条腿的事。
    const target = isAbsolute(OUT_ARG) ? resolve(OUT_ARG) : resolve(ROOT, OUT_ARG);
    if (asm.failed.length > 0 && !process.argv.includes("--force")) {
      console.error(`[manifest] ${asm.failed.length} 个 slug 未抓全（其中 ${asm.inherited.length} 个已按旧面继承并打 partial），拒绝默认写出候选 ${target}：加 --force 才写「带继承标记的面」，加 --require-complete 则直接判失败不落盘。`);
      process.exit(2);
    }
    scratchWriteText(target, JSON.stringify(asm.manifest, null, 2));
    console.log(`[manifest] 候选已写 → ${target}（${asm.manifest.length} slug / ${asm.totalRows} 条目，含继承 ${asm.inheritedRows}）`);
  } else if (!WRITE) {
    logDryRunBanner("build-lib-manifest");
    console.log(`将写入 ${asm.manifest.length} 库 / ${asm.totalRows} 条目（继承 ${asm.inheritedRows}）；失败 ${asm.failed.length}`);
  } else {
    if (asm.failed.length > 0 && existsSync(OUT_FILE) && !process.argv.includes("--force")) {
      console.error(`[manifest] ${asm.failed.length} 个 slug 未抓全（继承后行数不会少，但那一面不是本轮抓的），拒绝默认覆盖 ${OUT_FILE}：加 --force 才覆盖，或修失败项后 --write。`);
      process.exit(2);
    }
    if (existsSync(OUT_FILE)) {
      writeFileSync(`${OUT_FILE}.bak`, readFileSync(OUT_FILE));
    }
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(OUT_FILE, JSON.stringify(asm.manifest, null, 2), "utf8");
  }

  console.log(`\n输出 → ${OUT_ARG ? "(候选，见上方「候选已写」行)" : OUT_FILE}`);
  if (incomplete > 0) {
    console.error(`[manifest] 本次运行**不完整**：capped ${asm.counts.capped.length} / notfound ${asm.counts.notfound.length} / error ${asm.counts.error.length}${asm.dropped.length > 0 ? ` / 无处可继承 ${asm.dropped.length}` : ""} —— 已继承旧行并打 partial 标记（不静默删库），退出码非 0。`);
    process.exitCode = 2;
  }
}

// 直接执行才跑主流程；被 import（投毒夹具逐分支复跑 assembleManifest）时零副作用。
const SELF_PATH = resolve(fileURLToPath(import.meta.url));
const ARG_PATH = process.argv[1] ? resolve(process.argv[1]) : "";
// win32 盘符大小写不一（`c:\` vs `C:\`）会让严格相等失败 ⇒ 直接执行被判成 import、脚本什么都不干
const invokedDirectly = ARG_PATH !== "" && (process.platform === "win32" ? ARG_PATH.toLowerCase() === SELF_PATH.toLowerCase() : ARG_PATH === SELF_PATH);
if (invokedDirectly) {
  main().catch((err) => {
    console.error(`[manifest] 致命错误: ${err.stack || err.message}`);
    process.exit(1);
  });
}
