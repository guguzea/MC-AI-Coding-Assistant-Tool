#!/usr/bin/env node
/**
 * check-lib-coords.mjs — S5′：库 Skill 手写 Gradle 坐标的**上游对账抓取器**（全仓唯一允许碰网络的一道）。
 *
 * 立门缘由：`knowledge/libs/**` 里的 `group:artifact:version` 是**手抄**的（Cloth 的坐标真值另有
 * `versions.json` 槽位做唯一真值源，见根 AGENTS.md「版本标记是坐标唯一真值」；Patchouli 那两枚则纯手写）。
 * 手写就没有可复核的上游证据 ⇒ 需要一个「离线快照」把坐标逐条钉到 Maven Central 的
 * `maven-metadata.xml` 上，再由**零网络**的 `assert-lib-coord-snapshot.mjs` 在日常门链里比对。
 *
 * 三条硬规矩（与 `src/upstream/releases.ts` / `scripts/_lib/fetch-with-ua.mjs` 同源）：
 * 1. **只打 Maven Central**。文档里点名了别的 maven 仓库（`maven.shedaniel.me`、`maven.blamejared.com`、
 *    `maven.theillusivec4.top`、`mvn.devom.co`、`maven.parchmentmc.org`…）的坐标一律记
 *    `origin:"non-central"` + **不发请求** —— 没查过的仓库没有资格说「上游没有」。
 * 2. **不改系统网络栈**：TLS 失败的解法是仓内 curl 腿（`fetchWithUa` 内置 `curl.exe --ssl-no-revoke`），
 *    永远不关证书校验、不动证书库、不动代理设置。
 * 3. **探针失败 ≠ 负事实**：网络/TLS/超时/限流一律 `probeFailed:true` + `found:null`，
 *    只有 HTTP 200 解析出 `<version>` 清单之后才允许写 `found:true/false` 与 `pinExistence`。
 *    ⇒ 默认「没点名仓库就当 Central 候选」这个不对称是安全的：私有仓的构件被误判成 Central 候选，
 *    最坏只得到 `found:false`（=「不在 Central」，一条**只关于 Central** 的事实），永远不会被门判红。
 *
 * 采集面（判据的唯一真值源就是本文件的 `collectClaims()`，门 import 它，不另起一份正则）：
 *   ① `knowledge/libs/<组>/<lib>/SKILL.md` 的 `group:artifact[:version]` 逐行；
 *   ② 同目录 `versions.json` 的 `slots[<MC 版本>] = {coord,state,basis}` —— 坐标靠**该 lib 目录里
 *      唯一一枚依赖声明行上的 group:artifact** 绑定；绑不上（0 枚或 >1 枚）就记 `unbound`，
 *      版本号仍进 C3（「非 active 槽被当可用坐标引用」的判据不需要 group/artifact）。
 *
 * 用法
 *   node mcp-server/scripts/check-lib-coords.mjs                 # 默认 dry-run：只打计划，一个字节都不写
 *   node mcp-server/scripts/check-lib-coords.mjs --write         # 真写 mcp-server/data/lib-coords/maven-metadata-snapshot.json
 *   node mcp-server/scripts/check-lib-coords.mjs --probe-control # 额外打一发已知 Central 坐标，证明 Central 腿活着（不写盘）
 *   node mcp-server/scripts/check-lib-coords.mjs --timeout-ms=8000 --limit=10
 *
 * 写盘出口 = `scripts/_lib/write-guard.mjs` 的 `emitAtomic`（S20：`--write` 才落盘，默认 DRYRUN）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { emitAtomic, logDryRunBanner, wantWrite } from "../../scripts/_lib/write-guard.mjs";
import { DEFAULT_TIMEOUT_MS, fetchWithUa } from "../../scripts/_lib/fetch-with-ua.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
/** 仓库根（mcp-server/scripts → 上两级）。 */
export const ROOT = path.resolve(HERE, "..", "..");

export const CENTRAL_HOST = "repo1.maven.org";
export const CENTRAL_BASE = "https://repo1.maven.org/maven2";
/** 快照落点：工具面目录（`mcp-server/data/`，先例 `mdk-checksums.json`）；**禁止**落仓库根 `data/`。 */
export const SNAPSHOT_REL = "mcp-server/data/lib-coords/maven-metadata-snapshot.json";
export const SCHEMA_VERSION = 1;
export const GENERATED_BY = "mcp-server/scripts/check-lib-coords.mjs";
/** 单次真跑的网络预算（用户要求 ~15 发以内）。 */
export const DEFAULT_REQUEST_LIMIT = 15;

/**
 * `group:artifact[:version]`。group 必须**带点**且小写（`me.shedaniel.cloth` / `vazkii.patchouli`），
 * artifact 首字符是字母、≥2 字符。前置负向后望排除 URL 段与 `a:b:c:d` 的中间切片。
 */
export const COORD_RE =
  /(?<![\w.@:/-])([a-z][a-z0-9_-]*(?:\.[a-z0-9_-]+)+):([A-Za-z][A-Za-z0-9_-]{1,})(?::([A-Za-z0-9][A-Za-z0-9_.+!-]*))?/g;

/** 文档里点名的 maven 仓库主机（含 `mvn.` / `maven` / `repo` 字样），用于「这枚坐标不在 Central」的证据。 */
export const REPO_URL_RE = /https?:\/\/((?:[a-z0-9-]+\.)*(?:maven|mvn|repo\d?)[a-z0-9-]*(?:\.[a-z0-9-]+)+)(\/[^\s"'`)>\]]*)?/gi;

/** 否定语境：同行的版本号是「被指出不存在 / 未核实 / 别抄」的示例，不构成「这版实存」的主张。 */
export const NEGATION_RE = /不存在|未核实|TODO|禁止|不要|别抄|错（|★|❌|失效/;

/** Gradle 依赖声明行（C3 用来判「被当可用坐标引用」）。 */
export const DECL_RE = /^\s*(?:(\/\/)?\s*)?(?:modApi|modImplementation|api|implementation|compileOnly|include|runtimeOnly|annotationProcessor|localRuntime)\s*[("'a-zA-Z]/;

/** 版本号尾部构建后缀（`17.0.144+fabric` → `17.0.144`）；坐标里通常不带，两种写法都进对账。 */
export function normalizeVersion(v) {
  const s = String(v ?? "").trim();
  const cut = s.search(/[+-]/);
  return cut > 0 ? s.slice(0, cut) : s;
}

export function isPlaceholderVersion(v) {
  const s = String(v ?? "");
  return !s || /<[^>]*>/.test(s) || /同上|见下表|TODO|未核实/i.test(s);
}

/** 递归列出某目录下的文件（跳过 .git / node_modules）。 */
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile()) out.push(p);
  }
  return out;
}

function readLines(abs) {
  return fs.readFileSync(abs, "utf8").split(/\r?\n/);
}

/** 从 blob 里抽「文档点名的 maven 仓库主机」（Central 除外）。 */
export function repoHostsIn(blob) {
  const hosts = new Set();
  for (const m of String(blob).matchAll(REPO_URL_RE)) {
    const host = String(m[1] || "").toLowerCase();
    if (!host) continue;
    if (host === CENTRAL_HOST || host === "search.maven.org" || host === "repo.maven.apache.org") continue;
    hosts.add(host);
  }
  return [...hosts];
}

/**
 * 采集全部坐标主张。
 * @param {{root?:string, libsRel?:string}} [opts]
 * @returns {{claims:any[], denominators:any, unbound:any[]}}
 */
export function collectClaims(opts = {}) {
  const root = opts.root || ROOT;
  const libsRel = opts.libsRel || "knowledge/libs";
  const libsDir = opts.libsDir ? path.resolve(opts.libsDir) : path.join(root, libsRel);
  const files = walk(libsDir).sort();
  const skillFiles = files.filter((f) => path.basename(f) === "SKILL.md");
  const slotFiles = files.filter((f) => /versions\.json$/.test(f));

  // 逐 lib 目录聚合「文档点名的仓库主机」：坐标行与仓库行常隔十几行（Cloth 的 maven-metadata.xml 命令
  // 在 63 行、依赖声明在 43 行），按**目录级**证据判归属，比按行窗口稳。
  const hostsByDir = new Map();
  for (const f of files) {
    if (!/\.(md|json)$/.test(f)) continue;
    const dir = path.dirname(f);
    const prev = hostsByDir.get(dir) || [];
    hostsByDir.set(dir, [...new Set([...prev, ...repoHostsIn(fs.readFileSync(f, "utf8"))])]);
  }

  const claims = [];
  const unbound = [];

  for (const abs of skillFiles) {
    const rel = path.relative(root, abs).replace(/\\/g, "/");
    const lines = readLines(abs);
    lines.forEach((line, i) => {
      for (const m of line.matchAll(COORD_RE)) {
        const group = m[1];
        const artifact = m[2];
        const rawVersion = m[3] || null;
        const dirHosts = hostsByDir.get(path.dirname(abs)) || [];
        const nonCentral = dirHosts.length > 0;
        claims.push({
          key: `${group}:${artifact}`,
          group,
          artifact,
          kind: "doc",
          version: isPlaceholderVersion(rawVersion) ? null : rawVersion,
          rawVersion,
          source: { file: rel, line: i + 1 },
          assertion: NEGATION_RE.test(line) ? "negative" : "positive",
          origin: nonCentral ? "non-central" : "central-candidate",
          host: nonCentral ? dirHosts[0] : CENTRAL_HOST,
          hostEvidence: nonCentral ? `${rel}: ${dirHosts.join(", ")}` : `${rel}: 未点名仓库 ⇒ 默认 Central 候选`,
          declared: DECL_RE.test(line),
        });
      }
    });
  }

  for (const abs of slotFiles) {
    const rel = path.relative(root, abs).replace(/\\/g, "/");
    let data;
    try {
      data = JSON.parse(fs.readFileSync(abs, "utf8"));
    } catch (e) {
      unbound.push({ file: rel, why: `JSON 解析失败：${e.message}` });
      continue;
    }
    const slots = data && typeof data === "object" ? data.slots : null;
    if (!slots || typeof slots !== "object") {
      unbound.push({ file: rel, why: "无 slots 对象" });
      continue;
    }
    // 绑定：该 lib 目录内**依赖声明行**上的 group:artifact，去重后必须**恰好一枚**。
    const dirClaims = claims.filter((c) => c.kind === "doc" && path.posix.dirname(c.source.file) === path.posix.dirname(rel));
    const primaries = [...new Set(dirClaims.filter((c) => c.declared).map((c) => c.key))];
    let bound = null;
    if (primaries.length === 1) {
      bound = claims.find((c) => c.key === primaries[0] && c.declared);
    } else {
      unbound.push({
        file: rel,
        why: `依赖声明行上的 group:artifact ${primaries.length} 枚（需恰好 1 枚才能把槽位版本号绑到坐标）：${primaries.join(" | ") || "无"}`,
      });
    }
    for (const [slot, rec] of Object.entries(slots)) {
      const raw = String(rec?.coord ?? "").trim();
      if (!raw || isPlaceholderVersion(raw)) {
        claims.push({
          key: bound ? bound.key : null,
          group: bound ? bound.group : null,
          artifact: bound ? bound.artifact : null,
          kind: "slot-placeholder",
          version: null,
          rawVersion: raw,
          slot,
          state: String(rec?.state ?? ""),
          source: { file: rel, line: slot },
          assertion: "negative",
          origin: bound ? bound.origin : "unbound",
          host: bound ? bound.host : null,
          hostEvidence: bound ? bound.hostEvidence : `${rel}: 未绑定坐标`,
          declared: false,
        });
        continue;
      }
      claims.push({
        key: bound ? bound.key : null,
        group: bound ? bound.group : null,
        artifact: bound ? bound.artifact : null,
        kind: "slot",
        version: raw,
        versionNorm: normalizeVersion(raw),
        rawVersion: raw,
        slot,
        state: String(rec?.state ?? ""),
        source: { file: rel, line: slot },
        assertion: String(rec?.state ?? "") === "active" ? "positive" : "negative",
        origin: bound ? bound.origin : "unbound",
        host: bound ? bound.host : null,
        hostEvidence: bound ? bound.hostEvidence : `${rel}: 未绑定坐标`,
        declared: false,
      });
    }
  }

  const uniqueCoords = [...new Set(claims.filter((c) => c.key).map((c) => c.key))];
  return {
    claims,
    unbound,
    /** 参与采集的 SKILL.md（门只读文本，不再各自走盘 ⇒ 采集面唯一真值源仍在门内）。 */
    docs: skillFiles.map((abs) => ({ rel: path.relative(root, abs).replace(/\\/g, "/"), abs })),
    /** versions.json 的槽位清单（含非 active），门的 C3 判据按它扫正文。 */
    slots: claims
      .filter((c) => c.kind === "slot" || c.kind === "slot-placeholder")
      .map((c) => ({ slot: c.slot, state: c.state, coord: c.rawVersion, key: c.key, file: c.source.file })),
    denominators: {
      libsRoot: libsRel,
      filesScanned: files.length,
      skillFiles: skillFiles.length,
      slotFiles: slotFiles.length,
      claims: claims.length,
      docClaims: claims.filter((c) => c.kind === "doc").length,
      slotClaims: claims.filter((c) => c.kind === "slot" || c.kind === "slot-placeholder").length,
      /** 口径含 `todo` 占位槽（门的 C3 活性地板读的就是这个数）。 */
      nonActiveSlots: claims.filter((c) => (c.kind === "slot" || c.kind === "slot-placeholder") && c.state !== "active").length,
      nonActiveSlotClaims: claims.filter((c) => c.kind === "slot" && c.state !== "active").length,
      uniqueCoords: uniqueCoords.length,
      centralCandidates: uniqueCoords.filter((k) => claims.find((c) => c.key === k)?.origin === "central-candidate").length,
      nonCentral: uniqueCoords.filter((k) => claims.find((c) => c.key === k)?.origin === "non-central").length,
      unboundSlotFiles: unbound.length,
    },
  };
}

/** Central 的 maven-metadata.xml 地址（group 点换斜杠）。 */
export function centralMetadataUrl(group, artifact) {
  return `${CENTRAL_BASE}/${group.split(".").join("/")}/${encodeURIComponent(artifact)}/maven-metadata.xml`;
}

/** 最小 maven-metadata.xml 解析：`<latest>`、`<release>` 与全部 `<version>`。 */
export function parseMavenMetadata(xml) {
  const text = String(xml || "");
  const pick = (tag) => {
    const m = new RegExp(`<${tag}>\\s*([^<]*?)\\s*</${tag}>`, "i").exec(text);
    return m ? m[1].trim() : null;
  };
  const block = /<versions>([\s\S]*?)<\/versions>/i.exec(text);
  const versions = block ? [...block[1].matchAll(/<version>\s*([^<]*?)\s*<\/version>/gi)].map((m) => m[1].trim()) : [];
  return {
    latest: pick("latest"),
    release: pick("release"),
    versions,
    parsed: /<metadata[\s>]/i.test(text) && /<versioning[\s>]/i.test(text),
  };
}

/**
 * 抓一发 maven-metadata.xml。**绝不**改系统证书库/代理；失败只记 `probeFailed`。
 * @returns {Promise<object>} 行数据（见 buildRows 的字段说明）
 */
export async function probeCentral(group, artifact, pins, { timeoutMs = DEFAULT_TIMEOUT_MS, url } = {}) {
  const target = url || centralMetadataUrl(group, artifact);
  const row = {
    key: `${group}:${artifact}`,
    group,
    artifact,
    source: "central",
    host: CENTRAL_HOST,
    url: target,
    probed: true,
    probeFailed: false,
    httpStatus: 0,
    found: null,
    notOnCentral: false,
    latestRelease: null,
    upstreamVersionCount: null,
    recentVersions: [],
    pinExistence: {},
    fetchedAt: null,
    failureClass: null,
    note: "",
  };
  const res = await fetchWithUa(target, { timeoutMs, as: "text" });
  row.fetchedAt = new Date().toISOString();
  row.httpStatus = res.status || 0;
  if (!res.ok) {
    if (res.failureClass === "NOT_FOUND" && res.status === 404) {
      // 这是一条**关于 Central** 的确定事实，不是「上游没有这个构件」。
      row.found = false;
      row.notOnCentral = true;
      row.note = "Central 无该 group/artifact 索引（404）；该构件可能住在文档点名的私有仓库 ⇒ 不构成「版本不存在」。";
      for (const p of pins) row.pinExistence[p] = null;
      return row;
    }
    row.probeFailed = true;
    row.failureClass = res.failureClass || "UNKNOWN";
    row.note = `探针失败（${row.failureClass}${res.status ? ` HTTP ${res.status}` : ""}）：${String(res.reason || "").slice(0, 180)} —— 探针失败 ≠ 上游没有，禁止据此断言。`;
    for (const p of pins) row.pinExistence[p] = null;
    return row;
  }
  const meta = parseMavenMetadata(res.text);
  if (!meta.parsed) {
    row.probeFailed = true;
    row.failureClass = "UNPARSED_METADATA";
    row.note = "HTTP 200 但 maven-metadata.xml 解析不出 <versioning> ⇒ 不下任何结论。";
    for (const p of pins) row.pinExistence[p] = null;
    return row;
  }
  row.found = true;
  row.via = res.via || "fetch";
  row.latestRelease = meta.release || meta.latest || (meta.versions.at(-1) ?? null);
  row.upstreamVersionCount = meta.versions.length;
  row.recentVersions = meta.versions.slice(-25);
  const set = new Set(meta.versions);
  for (const p of pins) {
    row.pinExistence[p] = set.has(p) || set.has(normalizeVersion(p)) ? true : false;
  }
  return row;
}

/** 没发请求的行：只登记，不下任何存在性结论。`source` 必须诚实说明**为什么**没查。 */
export function skippedRow(claim, pins, why, sourceOverride) {
  return {
    key: claim.key,
    group: claim.group,
    artifact: claim.artifact,
    source: sourceOverride || (claim.origin === "unbound" ? "unbound" : "non-central"),
    host: claim.host || null,
    url: null,
    probed: false,
    probeFailed: false,
    httpStatus: 0,
    found: null,
    notOnCentral: false,
    latestRelease: null,
    upstreamVersionCount: null,
    recentVersions: [],
    pinExistence: Object.fromEntries(pins.map((p) => [p, null])),
    fetchedAt: null,
    failureClass: null,
    note: why,
  };
}

/**
 * 需要「版本是否存在」对账的版本号。口径 = **positive 主张全收**（不分 origin）：
 * non-central / 未探得的行也照样登记 `pinExistence[v] = null`，因为门按
 * 「文档有这条主张 ⇒ 快照必须有对应条目」判过期（C1b），漏登记会造出「重跑抓取器也补不掉」的死红。
 * 版本真伪的判定另由 `found:true` 门住（C2），`null` 不参与判红。
 * 否定语境（同行有 `不存在` / `未核实` / `别抄`）与非 active 槽的版本是**反例**，不是主张，不收。
 */
export function pinsFor(claims) {
  return [...new Set(claims.filter((c) => c.version && c.assertion === "positive" && c.key).map((c) => c.version))];
}

export async function buildSnapshot({ timeoutMs = DEFAULT_TIMEOUT_MS, limit = DEFAULT_REQUEST_LIMIT, probeControl = false } = {}) {
  const { claims, unbound, denominators } = collectClaims();
  const byKey = new Map();
  for (const c of claims) {
    if (!c.key) continue;
    if (!byKey.has(c.key)) byKey.set(c.key, []);
    byKey.get(c.key).push(c);
  }
  const rows = [];
  let requested = 0;
  for (const [key, group] of byKey) {
    const head = group[0];
    const pins = pinsFor(group);
    if (head.origin === "non-central") {
      rows.push(skippedRow(head, pins, `文档点名仓库 ${head.host} ⇒ 不查 Central（没查过的仓库不得断言「上游没有」）。证据：${head.hostEvidence}`));
      continue;
    }
    if (head.origin === "unbound") {
      rows.push(skippedRow(head, pins, `未绑定坐标 ⇒ 不请求。${head.hostEvidence || ""}`));
      continue;
    }
    if (requested >= limit) {
      rows.push(skippedRow(head, pins, `超出单次网络预算 --limit=${limit} ⇒ 本轮跳过（跳过 ≠ 不存在）`, "skipped-budget"));
      continue;
    }
    requested++;
    rows.push(await probeCentral(head.group, head.artifact, pins, { timeoutMs }));
  }
  if (probeControl) {
    const ctl = await probeCentral("com.google.code.gson", "gson", ["2.10.1", "2.11.0", "9.9.9-not-a-release"], { timeoutMs });
    rows.push({ ...ctl, source: "control", note: "正对照（证明 Central 腿活着，不代表任何库坐标；门按 source=control 跳过它）" });
  }
  rows.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  const snapshot = {
    schemaVersion: SCHEMA_VERSION,
    generatedBy: GENERATED_BY,
    fetchedAt: new Date().toISOString(),
    policy: [
      "只查 Maven Central；文档点名别的 maven 仓库的坐标记 source=non-central 且不发请求。",
      "探针失败记 probeFailed + found:null，禁止写成「上游没有」。",
      "HTTP 404 只记 notOnCentral（关于 Central 的事实），pinExistence 留 null。",
      "pinExistence 为 true/false 仅当 found:true（真的读到过 <versions> 清单）。",
    ],
    denominators: {
      ...denominators,
      rows: rows.length,
      probed: rows.filter((r) => r.probed).length,
      probeFailed: rows.filter((r) => r.probeFailed).length,
      skipped: rows.filter((r) => !r.probed).length,
      requests: requested,
    },
    unbound,
    claims: claims.map((c) => ({
      key: c.key,
      kind: c.kind,
      slot: c.slot ?? null,
      state: c.state ?? null,
      version: c.version,
      rawVersion: c.rawVersion ?? null,
      assertion: c.assertion,
      origin: c.origin,
      host: c.host,
      file: c.source.file,
      line: c.source.line,
    })),
    rows,
  };
  return snapshot;
}

function argNum(name, dflt) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!hit) return dflt;
  const n = Number(hit.slice(name.length + 3));
  return Number.isFinite(n) && n > 0 ? n : dflt;
}

export async function main() {
  const write = wantWrite();
  const timeoutMs = argNum("timeout-ms", 12_000);
  const limit = Math.min(argNum("limit", DEFAULT_REQUEST_LIMIT), DEFAULT_REQUEST_LIMIT);
  const probeControl = process.argv.includes("--probe-control");
  const t0 = Date.now();
  const snapshot = await buildSnapshot({ timeoutMs, limit, probeControl });
  const d = snapshot.denominators;
  console.error(
    `采集：SKILL.md ${d.skillFiles} 份 / 坐标主张 ${d.claims} 条（doc ${d.docClaims} + 槽位 ${d.slotClaims}，其中非 active 槽 ${d.nonActiveSlots}）/ ` +
      `唯一 group:artifact ${d.uniqueCoords} 枚 ⇒ Central 候选 ${d.centralCandidates}、non-central 跳过 ${d.nonCentral}、未绑定槽档 ${d.unboundSlotFiles}`,
  );
  console.error(`网络：本轮实际请求 ${d.requests} 发（预算 ${limit}）、超时 ${timeoutMs}ms、probeFailed ${d.probeFailed}`);
  for (const r of snapshot.rows) {
    console.error(
      `  - ${r.key} [${r.source}${r.host ? `@${r.host}` : ""}] found=${r.found} latest=${r.latestRelease ?? "-"} pins=${JSON.stringify(r.pinExistence)}${r.probeFailed ? " ⚠probeFailed" : ""}`,
    );
  }
  for (const u of snapshot.unbound) console.error(`  ! 未绑定：${u.file} —— ${u.why}`);
  const body = `${JSON.stringify(snapshot, null, 2)}\n`;
  const target = path.join(ROOT, SNAPSHOT_REL);
  console.error(`计划写入：${SNAPSHOT_REL}（${Buffer.byteLength(body)} 字节，rows=${d.rows}）`);
  if (!write) logDryRunBanner("check-lib-coords.mjs");
  const res = emitAtomic(target, body);
  console.error(`快照：${write ? `已落盘 ${SNAPSHOT_REL}` : "未写盘（dry-run）"} · 耗时 ${Date.now() - t0}ms`);
  if (write && res && res.ok === false) process.exitCode = 1;
}

if (pathToFileURL(process.argv[1] ?? "").href === import.meta.url) {
  main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
}
