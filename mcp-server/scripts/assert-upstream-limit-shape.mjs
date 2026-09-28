#!/usr/bin/env node
/**
 * assert-upstream-limit-shape.mjs —— `L56` 里 `query_upstream_releases` 那条面的腿。
 *
 * 为什么别的门碰不到它：该面「有界」在实现层（`src/upstream/releases.ts:503`
 * `Math.min(200, Math.max(1, args.limit ?? 12))`）、「披露」在运行时载荷（`:594` `total` /
 * `:597` `truncated`），而真跑一次要联网 ⇒ 不能进默认链（离线纪律）。
 * grep dist 里的字符串又不判行为（改个变量名假红、少发射一次照样绿）。
 *
 * 本门的办法：**把 fetch 接掉**，让生产函数在离线状态下真跑五条 `limit` 档位 ——
 * 不改生产代码（`getViaFetch` 只取 `res.status/res.text()/res.url`，换实现体不动接口），
 * 并把缓存关掉（`MC_SKILL_CACHE=…` + `MC_SKILL_UPSTREAM_CACHE=0` ⇒ 不读也不写盘）。
 *
 * 三条判据（前两条 = 乙′ 强口径，第三条 = 与 `assert-limit-monotony.mjs` 同族的甲′）：
 *   D1 每个成功载荷都带 `total` 与 `truncated` 两个键（缺一个 = 消费者无从判断「拿全了没」）；
 *   D2 `truncated` 必须等于「池 > 本次条数」、`total` 必须等于全池条数
 *      （防「`total` 只报截断后的条数」——那正是本门给 community 面补位之前的老毛病）；
 *   D3 档位变大时旧集合必为新集合子集 + 条数不减。
 *
 * 反「假离线」自证：每条 run 都核 `via === "fetch"` 且假 fetch 的调用次数 == 跑的次数。
 * 一旦夹具没接住、真去打了 curl 或网络，`via` 就不是 "fetch" ⇒ 本门判红而不是悄悄绿。
 *
 * 跑：node scripts/assert-upstream-limit-shape.mjs [--selftest]
 */
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const dist = (p) => pathToFileURL(path.join(root, "dist", p)).href;

const POOL_SMALL = 20;
const POOL_BIG = 260;
const IMPL_MAX = 200; // 与 releases.ts:503 的 Math.min(200, …) 同值，见下方 D4 的取法

/** maven-metadata.xml 夹具（形状 = parseMavenVersions 认的那层：<versioning> 里的 <version>） */
function mavenXml(n) {
  const vs = Array.from({ length: n }, (_, i) => `  <version>1.20.1-47.3.${String(i + 1).padStart(2, "0")}</version>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<metadata>\n <versioning>\n  <lastUpdated>20260101000000</lastUpdated>\n${vs}\n </versioning>\n</metadata>\n`;
}

/** 纯判据：runs = [{label, pool, expectLen, payload|null}] → {ok, notes[]} */
export function checkUpstreamShape(runs) {
  const notes = [];
  let judged = 0, bad = 0;
  const red = (m) => { bad++; notes.push(m); };
  const prevIds = [];
  for (const r of runs) {
    const p = r.payload;
    if (!p) { red(`${r.label}: 无载荷（判据未跑，禁止当合格）`); continue; }
    if (p.ok !== true) { red(`${r.label}: ok=${p.ok}（${p.error?.code ?? p.code ?? "?"}）⇒ 非成功载荷，正判只吃成功形状`); continue; }
    judged++;
    if (p.via !== "fetch") red(`${r.label}: via=${p.via} ⇒ 走了 fetch 之外的腿（离线前提破了）`);
    if (typeof p.total !== "number") red(`${r.label}: 缺 total 键 ⇒ 消费者无从判断池大小`);
    else if (p.total !== r.pool) red(`${r.label}: total=${p.total} ≠ 全池 ${r.pool}（把截断后的条数当池报）`);
    if (typeof p.truncated !== "boolean") red(`${r.label}: 缺 truncated 键`);
    else {
      const want = r.pool > r.expectLen;
      if (p.truncated !== want) red(`${r.label}: truncated=${p.truncated} 应为 ${want}（池 ${r.pool}／本次 ${r.expectLen}）`);
    }
    const list = Array.isArray(p.releases) ? p.releases : null;
    if (!list) { red(`${r.label}: releases 不是数组`); continue; }
    if (list.length !== r.expectLen) red(`${r.label}: 条数 ${list.length} ≠ 应有 ${r.expectLen}`);
    const ids = list.map((x) => x.version);
    if (new Set(ids).size !== ids.length) red(`${r.label}: releases 内有重复 version`);
    prevIds.push({ label: r.label, ids });
  }
  for (let i = 1; i < prevIds.length; i++) {
    const a = prevIds[i - 1], b = prevIds[i];
    if (a.ids.length > b.ids.length) red(`甲′ 尺寸缩 ${a.label}->${b.label}: ${a.ids.length}>${b.ids.length}`);
    const B = new Set(b.ids);
    const loss = [...new Set(a.ids)].filter((x) => !B.has(x));
    if (loss.length) red(`甲′ 前缀丢失 ${a.label}->${b.label}: ${loss.length} 条，例 ${loss.slice(0, 3).join(" | ")}`);
  }
  if (judged === 0) return { ok: false, notes: [...notes, "无一档可比（上面已列出每档为什么不行）⇒ 判据未跑，禁止当合格"] };
  return { ok: bad === 0, notes: bad ? notes : [...notes, `${judged} 档全过（D1 披露位 / D2 等式 / D3 单调）`] };
}

// 档位**必须按有效条数升序**排（否则甲′ 会把「12 → 5 这种合法收窄」数成尺寸缩）。
// default = 12 与显式 limit=12 同长度，放相邻两位保持单调。
const mkRuns = (pool) => [
  { label: "limit=5", args: { limit: 5 }, pool, expectLen: Math.min(5, pool) },
  { label: "limit=12", args: { limit: 12 }, pool, expectLen: Math.min(12, pool) },
  { label: "default(=12)", args: {}, pool, expectLen: Math.min(12, pool) },
  { label: `limit=${IMPL_MAX}`, args: { limit: IMPL_MAX }, pool, expectLen: Math.min(IMPL_MAX, pool) },
  { label: `limit=${IMPL_MAX + 1}(应被夹到 ${IMPL_MAX})`, args: { limit: IMPL_MAX + 1 }, pool, expectLen: Math.min(IMPL_MAX, pool) },
];

async function main() {
  process.env.MC_SKILL_UPSTREAM_CACHE = "0";
  const { queryUpstreamReleases } = await import(dist("upstream/releases.js"));
  const out = [];
  for (const pool of [POOL_SMALL, POOL_BIG]) {
    const xml = mavenXml(pool);
    const seen = [];
    globalThis.fetch = async (url) => { seen.push(String(url)); return { status: 200, url: String(url), text: async () => xml }; };
    const runs = [];
    for (const r of mkRuns(pool)) {
      let payload = null;
      try { payload = await queryUpstreamReleases({ source: "forge", ...r.args }); }
      catch (e) { payload = null; runs.push({ ...r, payload: null, err: String(e.message).slice(0, 80) }); continue; }
      runs.push({ ...r, payload });
    }
    const v = checkUpstreamShape(runs);
    if (seen.length !== runs.length) { v.ok = false; v.notes.push(`假 fetch 只被调 ${seen.length} 次，应 ${runs.length} 次 ⇒ 有档位没走夹具`); }
    console.log(`${v.ok ? "绿" : "红"} query_upstream_releases(池 ${pool}) · 跑 ${runs.length} 档 · 网络调用 0（假 fetch ${seen.length} 次，全为 maven 源）· ${v.notes.join("；")}`);
    out.push(v.ok);
  }

  // 反证腿（判据必须咬得住**真生产载荷**，不只是合成对象）：喂两种上游失败形态，
  // 生产函数各自返回它自己的失败/未命中载荷 ⇒ checkUpstreamShape 必须判红。
  // 这条替掉「改 dist 构建产物做投毒」那类做法（那属于动产物、被权限层拒），且它长在门里长期有效。
  const negs = [
    { name: "上游 404", fake: async (url) => ({ status: 404, url: String(url), text: async () => "not found" }) },
    { name: "SPA/HTML 壳", fake: async (url) => ({ status: 200, url: String(url), text: async () => "<html><body>login</body></html>" }) },
  ];
  for (const n of negs) {
    globalThis.fetch = n.fake;
    let payload = null;
    try { payload = await queryUpstreamReleases({ source: "forge", limit: 5 }); } catch { payload = null; }
    const v = checkUpstreamShape([{ label: n.name, pool: 5, expectLen: 5, payload }]);
    const good = v.ok === false;
    console.log(`${good ? "绿" : "红"} 反证「${n.name}」：判据对该真载荷 ${v.ok ? "判绿 ⇒ 咬不住坏形状" : "判红"}（${v.notes.slice(0, 1).join("；")}）`);
    out.push(good);
  }

  const bad = out.filter((x) => !x).length;
  console.log(`\nassert-upstream-limit-shape: 2 组正判（小池验截断 / 大池验 ${IMPL_MAX} 夹紧）+ 2 组反证（真生产坏载荷必须被咬）· 红 ${bad}`);
  console.log("  注：CLI 层对 limit>200 是 schema 真拒（TOO_BIG），本门走函数层 ⇒ 核的是实现层 Math.min 夹紧这一道，两者不是一回事。");
  if (bad) process.exitCode = 1;
}

function selftest() {
  const payload = (pool, len, extra = {}) => ({
    ok: true, via: "fetch", total: pool, truncated: pool > len,
    releases: Array.from({ length: len }, (_, i) => ({ version: `v${i}` })), ...extra,
  });
  const clean = (p) => [{ label: "12", pool: 20, expectLen: 12, payload: p }];
  assert.equal(checkUpstreamShape(clean(payload(20, 12))).ok, true, "干净夹具应绿");
  assert.equal(checkUpstreamShape(clean({ ...payload(20, 12), truncated: undefined })).ok, false, "缺 truncated 未判红");
  assert.equal(checkUpstreamShape(clean({ ...payload(20, 12), total: undefined })).ok, false, "缺 total 未判红");
  assert.equal(checkUpstreamShape(clean({ ...payload(20, 12), truncated: false })).ok, false, "truncated 谎报 false 未判红");
  assert.equal(checkUpstreamShape(clean({ ...payload(20, 12), total: 12 })).ok, false, "total 报成截断后条数未判红");
  assert.equal(checkUpstreamShape(clean({ ...payload(20, 12), via: "curl" })).ok, false, "via=curl（离线前提破了）未判红");
  const shrink = checkUpstreamShape([
    { label: "12", pool: 20, expectLen: 12, payload: payload(20, 12) },
    { label: "5", pool: 20, expectLen: 5, payload: { ok: true, via: "fetch", total: 20, truncated: true, releases: [{ version: "z0" }, { version: "z1" }, { version: "z2" }, { version: "z3" }, { version: "z4" }] } },
  ]);
  assert.equal(shrink.ok, false, "甲′ 尺寸缩/换血未判红");
  const allNull = checkUpstreamShape([{ label: "a", pool: 20, expectLen: 1, payload: null }]);
  assert.equal(allNull.ok, false, "全档无载荷被判成合格（装饰性判据）");
  console.log("assert-upstream-limit-shape --selftest: 8 组通过（正控 1 / 投毒 7，含「假离线 via=curl」与「测不到≠合格」）");
}

if (process.argv.includes("--selftest")) selftest();
else await main();
