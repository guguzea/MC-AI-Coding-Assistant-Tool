#!/usr/bin/env node
/**
 * assert-limit-monotony.mjs —— `L56` 甲′（弱口径）腿：limit 变大「只增不减 + 前缀不变」。
 *
 * 为什么单独一道门：GENRE 门⑥（`assert-bedrock-genre-demote.mjs`）的两条判据里
 * 「未传 limit 却带 limitWindow」是基岩/community 那族截断披露位专属的，本文件这六面
 * （5 × `get_*_doc_related` + `search_loader_api`）没有那一位，硬塞进同一张表会让
 * 两条判据互相稀释。分面：
 *   - `query_registry` **故意不在本门**：`L76` 实测它 `limit` 25→100 会丢 5 条，
 *     连甲′ 都不满足（放大窗把默认窗里靠字母序挤进来的条目顶出去），要等修法拍板；
 *   - `query_upstream_releases` 也不在：它 `.max(200)` + 每发 `truncated:true`，本就合格。
 *
 * 门不抄数字：六面的默认窗口从各自 zod schema 的 `limit` 默认值读（`schemaDefaultOf`），
 * loader 面读 `LOADER_API_SEARCH_DEFAULT_LIMIT`／`LIMIT_MAX` 常量。
 *
 * **测不到即红**（不判「合格」）：v1 探针曾对四档全 error 的面打印「单调=true」，
 * 那是 `every()` 在空集上为真的装饰性判据；本门把「无一档可判」定为失败。
 *
 * 跑：node scripts/assert-limit-monotony.mjs [--selftest]
 */
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const dist = (p) => pathToFileURL(path.join(root, "dist", p)).href;

const parse = (res) => {
  const text = res?.content?.find?.((c) => c?.type === "text")?.text;
  if (typeof text !== "string") return res && typeof res === "object" ? res : null;
  try {
    const j = JSON.parse(text);
    return j?.result ?? j;
  } catch {
    return null;
  }
};

const pickList = (payload, key) => {
  if (!payload) return null;
  if (Array.isArray(payload)) return payload;
  const v = key ? payload[key] : (payload.hits ?? payload.results ?? payload.related ?? payload.matches);
  return Array.isArray(v) ? v : null;
};

const ident = (e, kind) =>
  typeof e === "string" ? e : `${e.registry ?? ""}:${e.id ?? e.fqcn ?? e.name ?? e.slug ?? ""}`.replace(/^:/, "");

/** 从 zod schema 读 limit 默认值；读不到即抛（禁止退回门内写死的数字） */
function schemaDefaultOf(mod, schemaName) {
  const schema = mod?.[schemaName]?.inputSchema ?? mod?.[schemaName];
  const node = schema?.shape?.limit;
  if (!node?._def) throw new Error(`${schemaName}.limit 没有可读的 _def（schema 形状变了，先改门再改判据）`);
  const d = node._def.defaultValue;
  const v = typeof d === "function" ? d() : d;
  if (typeof v !== "number") throw new Error(`${schemaName}.limit 默认值不是数字：${JSON.stringify(v)}`);
  return v;
}

const FACES = [
  { label: "get_forge_doc_related", module: "docs-platform/forge/index.js", fn: "getForgeDocRelated", schema: "getForgeDocRelatedSchema", base: { id: "1.20.1/concepts_registries", version: "1.20.1" } },
  { label: "get_fabric_doc_related", module: "docs-platform/fabric/index.js", fn: "getFabricDocRelated", schema: "getFabricDocRelatedSchema", base: { id: "1.21.11/develop_sounds_custom", version: "1.21.11" } },
  { label: "get_neoforge_doc_related", module: "docs-platform/neoforge/index.js", fn: "getNeoForgeDocRelated", schema: "getNeoForgeDocRelatedSchema", base: { id: "concepts/registries", version: "1.21.1" } },
  { label: "get_doc_related", module: "docs-platform/forge/index.js", fn: "getDocRelated", schema: "getDocRelatedSchema", base: { id: "concepts/registries", version: "1.21.1", platform: "neoforge" } },
  { label: "get_bedrock_doc_related", module: "bedrock/index.js", fn: "getBedrockDocRelated", schema: "getBedrockDocRelatedSchema", base: { id: "stable/documents/commandblocks" } },
];

/** 纯判据：runs = [{lim, ids|null, err?}] → {ok, notes[]} */
export function checkMonotony(face, runs) {
  const notes = [];
  let judged = 0, bad = 0;
  for (let i = 1; i < runs.length; i++) {
    const a = runs[i - 1], b = runs[i];
    if (a.err || b.err || !a.ids || !b.ids) continue;
    judged++;
    if (a.ids.length > b.ids.length) { bad++; notes.push(`尺寸缩 ${a.lim}->${b.lim}: ${a.ids.length}>${b.ids.length}`); }
    const B = new Set(b.ids.map((e) => ident(e, face)));
    const loss = [...new Set(a.ids.map((e) => ident(e, face)))].filter((x) => !B.has(x));
    if (loss.length) { bad++; notes.push(`前缀丢失 ${a.lim}->${b.lim}: ${loss.length} 条，例 ${loss.slice(0, 3).join(" | ")}`); }
  }
  if (judged === 0) return { ok: false, notes: [`无一档可比（runs=${runs.map((r) => r.err ? "ERR" : "ok").join(",")}）⇒ 判据未跑，禁止当合格`] };
  return { ok: bad === 0, notes: bad ? notes : [...notes, `${judged} 档相邻比较全过`] };
}

async function runFace(face, ladder) {
  const mod = await import(dist(face.module));
  // 默认窗口优先读 schema 的 `.default()`；读不到（如基岩面 `limit` 无 default、默认值写在实现里）
  // 就退到「不传 limit 那一档的实测条数」——那是测量值，不是门内抄的数字。两条都拿不到 ⇒ 判红。
  let defLimit = null, defNote = "";
  try {
    defLimit = face.schema ? schemaDefaultOf(mod, face.schema) : (face.defaultFromConst?.() ?? null);
  } catch (e) {
    defNote = String(e.message).slice(0, 90);
  }
  const runs = [];
  for (const lim of ladder) {
    const args = lim === "default" ? { ...face.base } : { ...face.base, limit: lim };
    const label = String(lim);
    try {
      const payload = parse(await mod[face.fn](args));
      const list = pickList(payload, face.listKey);
      if (!list) runs.push({ lim: label, ids: null, err: `载荷里没有条目数组（键 ${Object.keys(payload ?? {}).join(",") || "null"}）` });
      else runs.push({ lim: label, ids: list, total: payload?.total, maxSeen: undefined });
    } catch (e) {
      runs.push({ lim: label, ids: null, err: String(e.message).slice(0, 120) });
    }
  }
  if (defLimit === null) {
    const d = runs.find((r) => r.lim === "default");
    if (d?.ids) defLimit = d.ids.length;
    else return { label: face.label, ok: false, notes: [`默认窗口既不在 schema 也无法实测（${defNote || "default 档未取到数组"}）⇒ 拒绝以门内数字代替`] };
  }
  const v = checkMonotony(face.label, runs);
  const sizes = runs.map((r) => `${r.lim}:${r.ids ? r.ids.length : "ERR"}`).join(" ");
  return { label: face.label, defaultLimit: defLimit, sizes, ...v };
}

const LADDER = [1, 3, "default", 50];

async function main() {
  const results = [];
  for (const f of FACES) results.push(await runFace(f, LADDER));
  // loader 面：常量式默认值 + 上界，且它有 total/offset（分页位），单独一条
  const loader = await import(dist("loader-api/query.js"));
  const loaderFace = { label: "search_loader_api", module: "loader-api/query.js", fn: "searchLoaderApi", listKey: "hits", defaultFromConst: () => loader.LOADER_API_SEARCH_DEFAULT_LIMIT, base: { platform: "forge", minecraftVersion: "1.20.1", query: "registries" } };
  const lr = await runFace(loaderFace, [1, 5, loader.LOADER_API_SEARCH_DEFAULT_LIMIT, loader.LOADER_API_SEARCH_LIMIT_MAX]);
  lr.defaultLimit = loader.LOADER_API_SEARCH_DEFAULT_LIMIT;
  results.push(lr);

  const bad = results.filter((r) => !r.ok);
  for (const r of results) {
    console.log(`${r.ok ? "绿" : "红"} ${r.label} 默认=${r.defaultLimit} 档位 ${r.sizes ?? "-"} · ${r.notes.join("；")}`);
  }
  console.log(`\nassert-limit-monotony(甲′): ${results.length} 面 · 绿 ${results.length - bad.length} · 红 ${bad.length}` +
    (bad.length ? `\n  红因：${bad.map((b) => `${b.label} ⇒ ${b.notes.join("；")}`).join("\n  ")}` : ""));
  console.log("  未挂本门的 2 面：`query_registry`（`L76` 甲′ 未满足，等修法）、`query_upstream_releases`（`.max(200)` + `truncated` 本已合格）");
  if (bad.length) process.exitCode = 1;
}

function selftest() {
  const mk = (x) => Array.from({ length: x }, (_, i) => ({ id: `i${i}` }));
  const clean = checkMonotony("t", [{ lim: "1", ids: mk(1) }, { lim: "3", ids: mk(3) }, { lim: "5", ids: mk(5) }]);
  assert.equal(clean.ok, true, `正控（干净放大）应绿：${clean.notes}`);
  const shrink = checkMonotony("t", [{ lim: "5", ids: mk(5) }, { lim: "9", ids: mk(3) }]);
  assert.equal(shrink.ok, false, "尺寸缩未判红");
  assert.ok(shrink.notes.some((n) => n.includes("尺寸缩")), "尺寸缩未点名：" + shrink.notes);
  const lossy = checkMonotony("t", [{ lim: "5", ids: mk(5) }, { lim: "9", ids: Array.from({ length: 9 }, (_, i) => ({ id: `x${i}` })) }]);
  assert.equal(lossy.ok, false, "前缀丢失未判红");
  assert.ok(lossy.notes.some((n) => n.includes("前缀丢失")), "前缀丢失未点名：" + lossy.notes);
  const allErr = checkMonotony("t", [{ lim: "1", ids: null, err: "boom" }, { lim: "9", ids: null, err: "boom" }]);
  assert.equal(allErr.ok, false, "全档测不到被判成合格（装饰性判据）");
  assert.ok(/无一档可比/.test(allErr.notes[0]), allErr.notes[0]);
  console.log("assert-limit-monotony --selftest: 4 组通过（正控 1 / 投毒 3，含「测不到≠合格」）");
}

if (process.argv.includes("--selftest")) selftest();
else await main();
