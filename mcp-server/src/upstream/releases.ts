/**
 * src/upstream/releases.ts — 上游「这个版本到底有没有 / 最新到哪个 build」查询
 *
 * 为什么要有这个面（2026-09-21 对 mcmap / mappings.dev / Linkie 的优缺点审计）：
 * 本仓所有 `list_*_versions` 列的都是**本仓库已入库**的档位，回答不了
 * 「上游有没有 1.20.1 的 Forge 51.x」「yarn 对 1.21.4 出到第几 build」这类问题；
 * 那三个工具的共同强项正是直接查上游发布源。这里只补这一项能力，不引入它们的映射库。
 *
 * 三条硬规矩：
 * 1. 主机白名单写死在本文件；`slug` 一类入参必须先过形状校验再拼 URL（防 SSRF / 参数注入）。
 * 2. Node fetch 与 curl 两条腿：Windows 上 Node 的 TLS 链会 `UNABLE_TO_VERIFY_LEAF_SIGNATURE`，
 *    与仓内既有脚本同法回退 `curl.exe --ssl-no-revoke`。**不改系统证书库或代理。**
 * 3. 取不到就说取不到：`available:false` + `error`，禁止把「探针失败」写成「上游没有」。
 * 4. S4′ 磁盘缓存（`src/upstream/cache.ts`）：只缓存 `ok:true`，「有」/「没有」分档 TTL，
 *    缓存根只许 `$MC_SKILL_CACHE`（解析到仓库内一律拒写）。`refresh=true` 或 `MC_SKILL_UPSTREAM_CACHE=0` 绕过。
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  readUpstreamCache,
  upstreamCacheKey,
  writeUpstreamCache,
  type UpstreamCacheDisclosure,
} from "./cache.js";

const execFileAsync = promisify(execFile);

export type UpstreamSource =
  | "forge"
  | "neoforge"
  | "fabric-loader"
  | "fabric-yarn"
  | "quilt-loader"
  | "parchment"
  | "modrinth"
  // A4c（2026-09-24 用户裁定「全补 8+3」）：mcmap 端点表里我们此前没接的 11 个主机
  | "legacyfabric-loader"
  | "maven"
  | "mojang-manifest";

export const UPSTREAM_SOURCES: UpstreamSource[] = [
  "forge", "neoforge", "fabric-loader", "fabric-yarn", "quilt-loader", "parchment", "modrinth",
  "legacyfabric-loader", "maven", "mojang-manifest",
];

/**
 * A4c：mcmap 端点表（2026-09-24 从 `G:\MCP_USE\mcmap\package\dist` 实扫：28 条唯一 URL / 16 主机）里的
 * **maven 主机别名表**。`source=maven` 时 `slug=<alias>:<group>/<artifact>`（如 `fabric:net/fabricmc/yarn`）。
 * 只认本表内的别名 —— 用户给的字符串永远拼不出任意主机（硬规矩 1：主机白名单写死在本文件）。
 */
export const MAVEN_HOST_ALIASES: Record<string, { host: string; prefix: string }> = {
  fabric: { host: "maven.fabricmc.net", prefix: "" },
  legacyfabric: { host: "maven.legacyfabric.net", prefix: "" },
  quilt: { host: "maven.quiltmc.org", prefix: "repository/release" },
  terraformers: { host: "maven.terraformersmc.com", prefix: "releases" },
  blamejared: { host: "maven.blamejared.com", prefix: "" },
  architectury: { host: "maven.architectury.dev", prefix: "" },
  shedaniel: { host: "maven.shedaniel.me", prefix: "" },
  progwml6: { host: "dvs1.progwml6.com", prefix: "files/maven" },
  modmaven: { host: "modmaven.dev", prefix: "" },
  forge: { host: "maven.minecraftforge.net", prefix: "" },
  neoforged: { host: "maven.neoforged.net", prefix: "releases" },
  parchment: { host: "maven.parchmentmc.org", prefix: "" },
};

/**
 * maven 坐标形状：`<alias>:<group/…>/<artifact>`。
 * 别名全小写且必须在表里；坐标段**允许大写**（实测 maven 上确有 `ClothConfig` / `RoughlyEnoughItems`
 * 这类驼峰 artifact，禁大写会把它们挡在门外），但禁 `..`、禁空段、禁 `? #` 等 URL 元字符。
 */
export function parseMavenSlug(slug: string): { alias: string; host: string; prefix: string; path: string } | null {
  const m = /^([a-z0-9][a-z0-9-]*):([A-Za-z0-9][A-Za-z0-9._-]*(?:\/[A-Za-z0-9][A-Za-z0-9._-]*)+)$/.exec(String(slug ?? "").trim());
  if (!m) return null;
  const entry = MAVEN_HOST_ALIASES[m[1]];
  if (!entry) return null;
  if (m[2].split("/").some((seg) => seg === "." || seg === ".." || seg.length === 0)) return null;
  return { alias: m[1], host: entry.host, prefix: entry.prefix, path: m[2] };
}

/** 每个源的端点形状。`needsMc=true` ⇒ 必须带 minecraftVersion。 */
export const UPSTREAM_ENDPOINTS: Record<UpstreamSource, { host: string; needsMc: boolean; build: (mc: string | undefined, slug: string | undefined) => string }> = {
  forge: {
    host: "maven.minecraftforge.net",
    needsMc: false,
    build: () => "https://maven.minecraftforge.net/net/minecraftforge/forge/maven-metadata.xml",
  },
  neoforge: {
    host: "maven.neoforged.net",
    needsMc: false,
    build: () => "https://maven.neoforged.net/releases/net/neoforged/neoforge/maven-metadata.xml",
  },
  "fabric-loader": {
    host: "meta.fabricmc.net",
    needsMc: true,
    build: (mc) => `https://meta.fabricmc.net/v2/versions/loader/${encodeURIComponent(String(mc))}`,
  },
  "fabric-yarn": {
    host: "meta.fabricmc.net",
    needsMc: true,
    build: (mc) => `https://meta.fabricmc.net/v2/versions/yarn/${encodeURIComponent(String(mc))}`,
  },
  "quilt-loader": {
    host: "meta.quiltmc.org",
    needsMc: true,
    build: (mc) => `https://meta.quiltmc.org/v3/versions/loader/${encodeURIComponent(String(mc))}`,
  },
  parchment: {
    // 上游按 MC 版本分 artifact（parchment-<mc>），版本号本身是日期（2023.09.03）；
    // 实测 parchment-data 那条「看起来像通用坐标」的路径是 404。
    host: "maven.parchmentmc.org",
    needsMc: true,
    build: (mc) => `https://maven.parchmentmc.org/org/parchmentmc/data/parchment-${encodeURIComponent(String(mc))}/maven-metadata.xml`,
  },
  modrinth: {
    host: "api.modrinth.com",
    needsMc: false,
    build: (_mc, slug) => `https://api.modrinth.com/v2/project/${encodeURIComponent(String(slug))}/version`,
  },
  // ── A4c 新增 ────────────────────────────────────────────────────────────
  "legacyfabric-loader": {
    // 实测 2026-09-24：`/v2/versions/loader/<mc>` 回 400，过滤要走查询串（`?game_version=`）。
    host: "meta.legacyfabric.net",
    needsMc: true,
    build: (mc) => `https://meta.legacyfabric.net/v2/versions/loader?game_version=${encodeURIComponent(String(mc))}`,
  },
  maven: {
    // 主机由 parseMavenSlug 的别名表解析；build 只在 slug 合法时被调用（预检在 queryUpstreamReleases）。
    host: "maven.fabricmc.net", // 名义 host（真实 host 逐调用由别名表定）；白名单是别名表 + 本表 host 的并集
    needsMc: false,
    build: (_mc, slug) => {
      const parsed = parseMavenSlug(String(slug ?? ""));
      if (!parsed) throw new Error(`maven 需要 slug=<alias>:<group>/<artifact>（别名见 MAVEN_HOST_ALIASES），收到 ${JSON.stringify(slug)}`);
      const prefix = parsed.prefix ? `${parsed.prefix}/` : "";
      return `https://${parsed.host}/${prefix}${parsed.path}/maven-metadata.xml`;
    },
  },
  "mojang-manifest": {
    host: "piston-meta.mojang.com",
    needsMc: false,
    build: () => "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json",
  },
};

export interface UpstreamRelease {
  version: string;
  maven?: string;
  timestamp?: string;
  stable?: boolean;
  /**
   * A9（Ralph L9 / R111④）：上游**自报**的版本类型，逐字回显。
   * 目前只有 modrinth 的 `version_type` 提供（release / beta / alpha）；其余源上游不给该字段
   * ⇒ 字段缺席。缺席 ≠ release：**禁止**据版本串（如 `-beta` 后缀）猜 release/beta。
   */
  versionType?: string;
  gameVersions?: string[];
  loaders?: string[];
}

export interface UpstreamQueryResult {
  ok: boolean;
  source: UpstreamSource;
  url: string;
  minecraftVersion?: string;
  /** 上游确实没有该版本 ≠ 没查到：available=false 只在 ok=true 时有意义。 */
  available: boolean;
  total: number;
  releases: UpstreamRelease[];
  /** 按版本号降序后的第一条（maven-metadata 的原地顺序不保证时间序，实测 21.1.251 排在 26.3.0.6-beta 之后）。 */
  latest?: string;
  /** releases 被 limit 截断 ⇒ true，full 条数看 total。 */
  truncated?: boolean;
  /** 本次「该版本属于这个 MC」用的规则，供人核对 —— 判据不藏在代码里。 */
  matchRule?: string;
  httpStatus?: number;
  via?: "fetch" | "curl";
  /** 入口 URL 被重定向时回显落点（白名单主机的托管后端，如 maven.parchmentmc.org → ldtteam.jfrog.io）。 */
  redirectedTo?: string;
  error?: { code: string; message: string; hint?: string };
  fetchedAt: string;
  /** S4′：这一发是命中磁盘缓存还是打了上游（含档、TTL、年龄、没写成的原因）。 */
  cache?: UpstreamCacheDisclosure;
}

const ALLOWED_HOSTS = new Set([
  ...Object.values(UPSTREAM_ENDPOINTS).map((e) => e.host),
  // A4c：`source=maven` 的真实主机逐调用由别名表定 ⇒ 别名表里的主机也在白名单内。
  ...Object.values(MAVEN_HOST_ALIASES).map((e) => e.host),
]);

/**
 * 重定向落点白名单。请求腿都开了 follow-redirect，只校入口 URL 等于允许被白名单主机
 * 302 到内网地址（SSRF）。实测 `maven.parchmentmc.org` 会 302 到 `ldtteam.jfrog.io`
 * （Parchment 的托管后端），所以把**这一条**落点显式加进来，其余仍一律拒绝。
 */
const ALLOWED_FINAL_HOSTS = new Set([
  ...ALLOWED_HOSTS,
  "ldtteam.jfrog.io", // Parchment 的托管后端（见上）
  // A4c 实测（2026-09-24）：`maven.legacyfabric.net` 302 到自家新域名 `repo.legacyfabric.net`
  // （`https://maven.legacyfabric.net/net/legacyfabric/yarn/maven-metadata.xml` → `repo.legacyfabric.net/legacyfabric/…`），
  // 不登记就被 URL_REJECTED 挡下 —— 与 parchment 那条同样是「入口白名单 + 显式落点」的写法，不放开任意落点。
  "repo.legacyfabric.net",
]);

export function assertAllowedUpstreamUrl(url: string, final = false): void {
  const parsed = new URL(url);
  const hosts = final ? ALLOWED_FINAL_HOSTS : ALLOWED_HOSTS;
  if (parsed.protocol !== "https:") throw new Error(`只允许 https，收到 ${parsed.protocol}//${parsed.host}`);
  if (!hosts.has(parsed.hostname)) {
    throw new Error(`${final ? "重定向落点" : "上游源"}白名单里没有 ${parsed.hostname}`);
  }
}

/** Modrinth slug：只收小写字母数字与连字符，杜绝把 `../` 或查询串拼进 URL。 */
export function isSafeSlug(value: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,63}$/.test(value);
}

/** maven-metadata.xml → 版本串列表（不用 XML 解析库，与仓内既有脚本同风格）。 */
export function parseMavenVersions(xml: string): { version: string; lastUpdated?: string }[] {
  const block = /<versioning>([\s\S]*?)<\/versioning>/i.exec(xml)?.[1] ?? xml;
  const out: { version: string; lastUpdated?: string }[] = [];
  const lastUpdated = /<lastUpdated>([^<]+)<\/lastUpdated>/i.exec(xml)?.[1];
  for (const m of block.matchAll(/<version>([^<]+)<\/version>/g)) {
    out.push({ version: m[1].trim(), lastUpdated });
  }
  return out;
}

/** meta.fabricmc.net / meta.quiltmc.org 的 JSON → 归一化列表（形状各家不同）。 */
export function parseMetaJson(source: UpstreamSource, body: unknown): UpstreamRelease[] {
  const rows = Array.isArray(body) ? body : [];
  const out: UpstreamRelease[] = [];
  for (const row of rows as Record<string, any>[]) {
    if (!row || typeof row !== "object") continue;
    if (source === "fabric-loader" || source === "quilt-loader") {
      const loader = row.loader ?? {};
      const version = typeof loader.version === "string" ? loader.version : undefined;
      if (!version) continue;
      out.push({
        version,
        maven: typeof loader.maven === "string" ? loader.maven : undefined,
        stable: typeof loader.stable === "boolean" ? loader.stable : undefined,
      });
    } else if (source === "fabric-yarn" || source === "legacyfabric-loader") {
      // A4c：legacyfabric 的 loader 端点实测是**扁平**形状（{separator,build,maven,version,stable}），
      // 与 fabric-yarn 同形 —— 不是 fabric-loader 那种嵌套 loader 对象。
      const version = typeof row.version === "string" ? row.version : undefined;
      if (!version) continue;
      out.push({
        version,
        maven: typeof row.maven === "string" ? row.maven : undefined,
        stable: typeof row.stable === "boolean" ? row.stable : undefined,
      });
    } else if (source === "modrinth") {
      const version = typeof row.version_number === "string" ? row.version_number : undefined;
      if (!version) continue;
      out.push({
        version,
        maven: typeof row.filename === "string" ? row.filename : undefined,
        // A9：上游 version_type 逐字回显（release / beta / alpha），缺失就不给字段。
        versionType: typeof row.version_type === "string" ? row.version_type : undefined,
        gameVersions: Array.isArray(row.game_versions) ? row.game_versions.map(String) : undefined,
        loaders: Array.isArray(row.loaders) ? row.loaders.map(String) : undefined,
      });
    }
  }
  return out;
}

/**
 * A4c：Mojang 官方版本清单（`version_manifest_v2.json`）→ 归一化。
 * 上游现成带 `type`（release / snapshot / old_beta / old_alpha）⇒ 逐字进 `versionType`（与 A9 同字段）。
 */
export function parseMojangManifest(body: unknown): UpstreamRelease[] {
  const versions = (body as { versions?: unknown } | null)?.versions;
  if (!Array.isArray(versions)) return [];
  const out: UpstreamRelease[] = [];
  for (const row of versions as Record<string, unknown>[]) {
    if (!row || typeof row !== "object") continue;
    const version = typeof row.id === "string" ? row.id : undefined;
    if (!version) continue;
    out.push({
      version,
      timestamp: typeof row.releaseTime === "string" ? row.releaseTime : undefined,
      versionType: typeof row.type === "string" ? row.type : undefined,
    });
  }
  return out;
}

/**
 * A4c 口径洞（2026-09-24 用户回报）：`source=maven` 的 404 **只说明「该路径没有 maven-metadata.xml」**，
 * 分不清「构件不存在」与「group/artifact 写法不对」（maven 按路径寻址，层级与大小写都得逐字对；
 * 实测：`progwml6:mezz/jei`、`mezz/jei/jei-1.20.1-forge` 与其父路径三种写法全 404）。
 * 三态承诺里的「`ok:true + available:false` ⇒ 上游确实没有」在 maven 源上必须**收窄**成「该坐标没有 metadata」，
 * 故 404 载荷额外带这条 hint（其余源查的是写死的 artifact，不含此歧义，形状不动）。
 */
export function mavenNotFoundHint(slug: string): string {
  return (
    `404 只证明「${slug} 这个坐标没有 maven-metadata.xml」——分不清「构件不存在」与「group/artifact 写法不对」` +
    `（maven 按路径寻址，层级与大小写必须逐字对）。要断言「该模组在上游不存在」，请换 source=modrinth（按 project slug 查），` +
    `或先打开该仓库的父目录索引确认 artifact 名再回填坐标。`
  );
}

/** 404 载荷（纯函数，便于离线单测）：maven 源额外带语义边界 hint，其余源形状不变。 */
export function notFoundPayload(args: {
  source: UpstreamSource;
  url: string;
  minecraftVersion?: string;
  slug?: string;
  via: "fetch" | "curl";
  fetchedAt: string;
}): UpstreamQueryResult {
  return {
    ok: true,
    source: args.source,
    url: args.url,
    minecraftVersion: args.minecraftVersion,
    available: false,
    total: 0,
    releases: [],
    matchRule: args.minecraftVersion ? mcMatchRule(args.source, args.minecraftVersion).rule : undefined,
    httpStatus: 404,
    via: args.via,
    fetchedAt: args.fetchedAt,
    ...(args.source === "maven" ? { hint: mavenNotFoundHint(String(args.slug ?? "")) } : {}),
  };
}

async function getViaFetch(url: string, timeoutMs: number): Promise<{ status: number; text: string; finalUrl?: string } | { error: Error }> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "User-Agent": "MC-AI-Coding-Assistant/1.0 (+local MCP)", Accept: "application/json, text/xml" },
    });
    return { status: res.status, text: await res.text(), finalUrl: res.url };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/** Windows 上 Node 的 TLS 链常报 UNABLE_TO_VERIFY_LEAF_SIGNATURE；与抓取脚本同法退 curl（Schannel）。 */
async function getViaCurl(url: string, timeoutMs: number): Promise<{ status: number; text: string; finalUrl?: string } | { error: Error }> {
  try {
    const { stdout } = await execFileAsync(
      "curl.exe",
      [
        "-sS", "-L", "--ssl-no-revoke",
        "--connect-timeout", String(Math.max(5, Math.ceil(timeoutMs / 4000))),
        "--max-time", String(Math.ceil(timeoutMs / 1000)),
        "-A", "MC-AI-Coding-Assistant/1.0 (+local MCP)",
        "-w", "\n__MC_SKILL_HTTP_STATUS__:%{http_code}\n__MC_SKILL_HTTP_URL__:%{url_effective}",
        url,
      ],
      { maxBuffer: 64 * 1024 * 1024, windowsHide: true },
    );
    const m = /__MC_SKILL_HTTP_STATUS__:(\d{3})\s*\n__MC_SKILL_HTTP_URL__:(\S*)/.exec(stdout);
    const status = m ? Number(m[1]) : 0;
    return { status, text: m ? stdout.slice(0, m.index) : stdout, finalUrl: m?.[2] || undefined };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/** 版本号 → 比较键。数字段按数值比，其余按字典序；缺位视为更小。 */
export function versionKey(v: string): (number | string)[] {
  return v
    .split(/[._+\-\s]+/)
    .filter((s) => s.length > 0)
    .map((s) => (/^\d+$/.test(s) ? Number(s) : s));
}

/** 只出现在预发布后缀里的词：clean release 要压过同日/同号的 nightly / beta。 */
const PRE_RELEASE_PARTS = new Set(["nightly", "snapshot", "alpha", "beta", "rc", "dev", "pr", "m"]);
const isPrePart = (p: number | string) => typeof p === "string" && PRE_RELEASE_PARTS.has(p.toLowerCase());

/** 降序比较（新在前）。一方已到末尾而另一方只剩预发布后缀时，**干净的正式版排前面**。 */
export function compareVersionDesc(a: string, b: string): number {
  const ka = versionKey(a);
  const kb = versionKey(b);
  for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
    const x = ka[i];
    const y = kb[i];
    if (x === undefined && y === undefined) return 0;
    if (x === undefined) return isPrePart(y!) ? -1 : 1;
    if (y === undefined) return isPrePart(x) ? 1 : -1;
    if (typeof x === "number" && typeof y === "number") {
      if (x !== y) return y - x;
    } else if (typeof x === "number") return -1;
    else if (typeof y === "number") return 1;
    else if (x !== y) return x < y ? 1 : -1;
  }
  return 0;
}

/**
 * 「这个上游版本属不属于该 MC 版本」——各家编号方案不同，规则必须按源给，
 * 且把规则回显到输出的 matchRule 里。用错规则会把「有」报成「上游没有」，
 * 那正是本工具要消灭的缺陷类别（neoforge 尤甚：MC 1.21.1 对应 21.1.x，不带 "1."）。
 */
export function mcMatchRule(source: UpstreamSource, mc: string): { rule: string; test: (r: UpstreamRelease) => boolean } {
  switch (source) {
    case "fabric-loader":
    case "fabric-yarn":
    case "quilt-loader":
      return { rule: `${source}：端点已按 MC ${mc} 分列，整表都属于该版本`, test: () => true };
    case "forge":
      return { rule: `forge：版本号以 "${mc}-" 开头`, test: (r) => r.version === mc || r.version.startsWith(`${mc}-`) };
    case "parchment":
      // 实测版本串本身是日期（2023.09.03 / 2023.09.03-nightly-SNAPSHOT），MC 版本在 artifact 名里
      // （parchment-<mc>）⇒ 端点已按 MC 分列，整表都属于它。按 "${mc}-" 前缀过滤会全滤掉。
      return { rule: `parchment：artifact 已按 MC ${mc} 分列（parchment-${mc}），整表都属于该版本`, test: () => true };
    case "neoforge": {
      const parts = mc.split(".").filter(Boolean);
      const head = parts[0] === "1" ? parts.slice(1) : parts;
      if (head.length < 2) {
        return { rule: `neoforge：无法从 MC "${mc}" 推出 major.minor 前缀，未过滤`, test: () => true };
      }
      const prefix = `${head[0]}.${head[1]}.`;
      return { rule: `neoforge：MC ${mc} → 版本前缀 "${prefix}"（NeoForge 去掉前导 1.）`, test: (r) => r.version.startsWith(prefix) };
    }
    case "modrinth":
      return {
        rule: `modrinth：game_versions 含 "${mc}"（该条无 game_versions 时保留并标注）`,
        test: (r) => (r.gameVersions && r.gameVersions.length > 0 ? r.gameVersions.includes(mc) : true),
      };
    // ── A4c 新增 ──────────────────────────────────────────────────────────
    case "legacyfabric-loader":
      return { rule: `legacyfabric-loader：端点已按 game_version=${mc} 过滤（实测 /v2/versions/loader/<mc> 回 400，须走查询串），整表都属于该版本`, test: () => true };
    case "maven":
      return { rule: "maven：坐标由 slug 定（<alias>:<group>/<artifact>），整表属于该 artifact —— 版本号不按 MC 过滤", test: () => true };
    case "mojang-manifest":
      return { rule: `mojang-manifest：versions[].id === "${mc}"（官方清单现成带 type，逐字进 versionType）`, test: (r) => r.version === mc };
  }
}

type HttpOk = { ok: true; status: number; text: string; finalUrl?: string; via: "fetch" | "curl" };
type HttpErr = { ok: false; error: Error; via: "fetch" | "curl" };

async function fetchText(url: string, timeoutMs: number): Promise<HttpOk | HttpErr> {
  const first = await getViaFetch(url, timeoutMs);
  if (!("error" in first)) return { ok: true, ...first, via: "fetch" };
  const second = await getViaCurl(url, timeoutMs);
  if ("error" in second) {
    return {
      ok: false,
      error: new Error(`两条腿都失败：fetch=${first.error.message}；curl=${second.error.message}`),
      via: "curl",
    };
  }
  return { ok: true, ...second, via: "curl" };
}

export interface UpstreamQueryArgs {
  source: UpstreamSource;
  minecraftVersion?: string;
  slug?: string;
  limit?: number;
  timeoutMs?: number;
  /** S4′：跳过缓存读并强制重写（`MC_SKILL_UPSTREAM_CACHE=0` 是整体关掉）。 */
  refresh?: boolean;
}

/**
 * S4′ 的唯一入口：先查磁盘缓存，未命中才打上游，回来按档写缓存。
 * 缓存里的载荷去掉上一次的 `cache` 位再落盘，命中时重新盖章 —— 否则 age 永远显示 0。
 */
export async function queryUpstreamReleases(args: UpstreamQueryArgs): Promise<UpstreamQueryResult> {
  const key = upstreamCacheKey(args);
  let missNote: string | undefined;
  if (args.refresh !== true) {
    const hit = readUpstreamCache(key);
    if ("result" in hit) {
      const { cache: _stale, ...rest } = hit.result as unknown as UpstreamQueryResult & { cache?: UpstreamCacheDisclosure };
      return {
        ...rest,
        cache: { hit: true, tier: hit.tier, ttlMs: hit.ttlMs, ageMs: hit.ageMs, file: `${key}.json` },
      } as UpstreamQueryResult;
    }
    missNote = hit.note;
  }

  const live = await queryUpstreamLive(args);
  const stored = { ...live };
  delete (stored as { cache?: UpstreamCacheDisclosure }).cache;
  const w = writeUpstreamCache(key, stored as { ok?: boolean; available?: boolean });
  return {
    ...live,
    cache: {
      hit: false,
      tier: w.tier,
      ttlMs: w.ttlMs,
      wrote: w.wrote,
      note: missNote ?? w.note,
      file: w.file ? `${key}.json` : undefined,
    },
  };
}

async function queryUpstreamLive(args: UpstreamQueryArgs): Promise<UpstreamQueryResult> {
  const { source, minecraftVersion, slug } = args;
  const limit = Math.min(200, Math.max(1, args.limit ?? 12));
  const timeoutMs = args.timeoutMs ?? 90_000;
  const endpoint = UPSTREAM_ENDPOINTS[source];
  const fetchedAt = new Date().toISOString();
  const fail = (code: string, message: string, hint?: string, url = ""): UpstreamQueryResult => ({
    ok: false, source, url, minecraftVersion, available: false, total: 0, releases: [],
    error: { code, message, hint }, fetchedAt,
  });

  if (!endpoint) return fail("UNKNOWN_SOURCE", `未知上游源 ${String(source)}`, `可选：${UPSTREAM_SOURCES.join(" / ")}`);
  if (endpoint.needsMc && !minecraftVersion) {
    return fail("MISSING_VERSION", `${source} 必须带 minecraftVersion（上游按 MC 版本分列）`, undefined, "");
  }
  if (source === "modrinth" && (!slug || !isSafeSlug(slug))) {
    return fail("MISSING_SLUG", "modrinth 需要 project slug（小写字母数字与连字符，如 fabric-api）", undefined, "");
  }
  // A4c：maven 源的 slug 是 `<alias>:<group>/<artifact>`；形状或别名不对 ⇒ 当场拒（不拼 URL）。
  if (source === "maven" && !parseMavenSlug(String(slug ?? ""))) {
    return fail(
      "MISSING_SLUG",
      "maven 需要 slug=<alias>:<group>/<artifact>（如 fabric:net/fabricmc/yarn、blamejared:mezz/jei/jei-1.20.1-forge）",
      `可用别名：${Object.keys(MAVEN_HOST_ALIASES).join(" / ")}`,
    );
  }

  const url = endpoint.build(minecraftVersion, slug);
  try {
    assertAllowedUpstreamUrl(url);
  } catch (e) {
    return fail("URL_REJECTED", (e as Error).message, undefined, url);
  }

  const got = await fetchText(url, timeoutMs);
  if (!got.ok) {
    return fail(
      "UPSTREAM_UNREACHABLE",
      got.error.message,
      "网络/代理由用户环境决定，本工具不改系统证书库；可稍后重试或手动打开该 URL",
      url,
    );
  }
  const { status, text, via, finalUrl } = got;
  if (finalUrl && finalUrl !== url) {
    try {
      assertAllowedUpstreamUrl(finalUrl, true);
    } catch (e) {
      return fail("URL_REJECTED", `重定向落点被拒：${(e as Error).message}（落点 ${finalUrl}）`, "入口主机在白名单里，但落点不在 ⇒ 不读取该响应正文", url);
    }
  }

  // 404 是上游的明确答复（该 MC 版本没有对应条目）；其它非 2xx 与解析失败都是「没查到」。
  // A4c：maven 源走 notFoundPayload（它会给 404 加「只证该坐标无语义」的 hint）。
  if (status === 404) {
    return notFoundPayload({ source, url, minecraftVersion, slug: slug ?? undefined, via, fetchedAt });
  }
  if (status < 200 || status >= 300) {
    return fail("UPSTREAM_HTTP", `上游返回 HTTP ${status}`, "HTTP 层失败 ⇒ 不能据此判断上游有没有该版本", url);
  }

  let releases: UpstreamRelease[] = [];
  if (source === "forge" || source === "neoforge" || source === "parchment" || source === "maven") {
    releases = parseMavenVersions(text).map((r) => ({ version: r.version, timestamp: r.lastUpdated }));
    if (!releases.length) {
      return fail("UPSTREAM_PARSE", "maven-metadata.xml 里一个 <version> 都没解析出来", "响应可能是 HTML 壳或代理页，不代表上游没有", url);
    }
  } else {
    let body: unknown = null;
    try {
      body = JSON.parse(text);
    } catch (e) {
      return fail("UPSTREAM_PARSE", `JSON 解析失败：${(e as Error).message}`, "上游可能返回了 HTML 壳（SPA），这不是「上游没有」", url);
    }
    releases = source === "mojang-manifest" ? parseMojangManifest(body) : parseMetaJson(source, body);
    const shapeOk = source === "mojang-manifest"
      ? Array.isArray((body as { versions?: unknown } | null)?.versions)
      : Array.isArray(body);
    if (!releases.length && !shapeOk) {
      return fail("UPSTREAM_PARSE", "响应不是数组，无法按已知形状解析", "形状漂移 ≠ 上游没有该版本", url);
    }
  }

  const rule = minecraftVersion ? mcMatchRule(source, minecraftVersion) : null;
  const filtered = (rule ? releases.filter(rule.test) : releases).sort((a, b) => compareVersionDesc(a.version, b.version));
  const trimmed = filtered.slice(0, limit);

  return {
    ok: true,
    source,
    url,
    minecraftVersion,
    available: trimmed.length > 0,
    total: filtered.length,
    releases: trimmed,
    latest: filtered[0]?.version,
    truncated: filtered.length > trimmed.length,
    matchRule: rule?.rule ?? "未传 minecraftVersion ⇒ 返回该源全部版本（按版本降序，截断到 limit）",
    httpStatus: status,
    via,
    redirectedTo: finalUrl && finalUrl !== url ? finalUrl : undefined,
    fetchedAt,
  };
}
