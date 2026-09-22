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
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type UpstreamSource =
  | "forge"
  | "neoforge"
  | "fabric-loader"
  | "fabric-yarn"
  | "quilt-loader"
  | "parchment"
  | "modrinth";

export const UPSTREAM_SOURCES: UpstreamSource[] = [
  "forge", "neoforge", "fabric-loader", "fabric-yarn", "quilt-loader", "parchment", "modrinth",
];

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
};

export interface UpstreamRelease {
  version: string;
  maven?: string;
  timestamp?: string;
  stable?: boolean;
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
}

const ALLOWED_HOSTS = new Set(Object.values(UPSTREAM_ENDPOINTS).map((e) => e.host));

/**
 * 重定向落点白名单。请求腿都开了 follow-redirect，只校入口 URL 等于允许被白名单主机
 * 302 到内网地址（SSRF）。实测 `maven.parchmentmc.org` 会 302 到 `ldtteam.jfrog.io`
 * （Parchment 的托管后端），所以把**这一条**落点显式加进来，其余仍一律拒绝。
 */
const ALLOWED_FINAL_HOSTS = new Set([...ALLOWED_HOSTS, "ldtteam.jfrog.io"]);

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
    } else if (source === "fabric-yarn") {
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
        gameVersions: Array.isArray(row.game_versions) ? row.game_versions.map(String) : undefined,
        loaders: Array.isArray(row.loaders) ? row.loaders.map(String) : undefined,
      });
    }
  }
  return out;
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
}

export async function queryUpstreamReleases(args: UpstreamQueryArgs): Promise<UpstreamQueryResult> {
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
  if (status === 404) {
    return {
      ok: true, source, url, minecraftVersion, available: false, total: 0, releases: [],
      matchRule: minecraftVersion ? mcMatchRule(source, minecraftVersion).rule : undefined,
      httpStatus: 404, via, fetchedAt,
    };
  }
  if (status < 200 || status >= 300) {
    return fail("UPSTREAM_HTTP", `上游返回 HTTP ${status}`, "HTTP 层失败 ⇒ 不能据此判断上游有没有该版本", url);
  }

  let releases: UpstreamRelease[] = [];
  if (source === "forge" || source === "neoforge" || source === "parchment") {
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
    releases = parseMetaJson(source, body);
    if (!releases.length && !Array.isArray(body)) {
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
