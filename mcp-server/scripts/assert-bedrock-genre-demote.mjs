#!/usr/bin/env node
/**
 * assert-bedrock-genre-demote — 基岩「版本更新说明」体裁：打标签 + 检索降权（用户裁定 2026-09-22 第④条）。
 *
 * 裁定原文是「不拉黑，改成打标签 + 降优先级」，所以本门钉的是**两件事都成立且都没越界**：
 * 标签必须真进索引（否则降权无依据），降权必须只重排不过滤（越过界就成了事实拉黑）。
 *
 * 判据：
 *  ① 拼写三方逐字一致：生产者 `RELEASE_NOTES_TAG`（scripts/fetch-bedrock-docs.js）、
 *     消费者 `BEDROCK_RELEASE_NOTES_TAG`（src/bedrock/index.ts）、以及**编译产物** dist 里的同一个值。
 *     第三处存在的理由：消费者是 TS，宿主跑的是 dist —— 只改 src 不 `npm run build` 时运行时根本没有降权，
 *     而前两条腿照样绿。dist 不存在则直接报错（与 assert-verbatim-support 同口径）。
 *  ② 在盘 `index-l0.json` 的 release-notes 集合 **==** 用生产者判据现算的集合（双向差集逐条点名）。
 *     缺标 ⇒ 生产者改了判据而索引没重跑（`--retag`）；多标 ⇒ 有人手改 JSON
 *     （`_lib/bedrock-corpus.mjs::mergeIndexL0` 按 id 整条覆写索引项，含 tags ⇒ 手改下一次抓取即失效）。
 *  ③ scriptapi 树同类页必须为 0（那棵树没有 update-summary 体裁；非 0 说明判据被放宽到误伤）。
 *  ④ 降权行为：输入 N 行 ⇒ 输出 min(N, limit) 行，**被降权的行一行不少**；非降权行相对次序逐字不变；
 *     factor 必须落在 (0,1)（=1 即没降权，≤0 或 ≥1 都按"要么没做要么拉黑"处理）。
 *  ⑤ tagIndex 查不到该 id 时回退行内 tags（语义通道浮出的 RN 页若只认 tagIndex 会漏降权）。
 *  ⑥ `limit`（2026-09-22 追加：按调用放宽窗口）只是**把窗口拉宽**，不得动语义 ——
 *     schema 侧：带上界的有界整数（无上界 = 能一句话把 token 打穿，也能谎称能给更多页）；
 *     行为侧（真 handler 对真语料跑两次）：默认响应必须是放宽响应的前缀、默认里的 RN 页在放宽后
 *     仍在、候选池必须 ≥ 窗口、要的比池宽时必须披露（否则"调大没变多"会被读成丢了页）。
 *
 * 用法：
 *   node scripts/assert-bedrock-genre-demote.mjs              # 真跑（核 ①②③ + 用 dist 真函数核 ④⑤）
 *   node scripts/assert-bedrock-genre-demote.mjs --selftest    # 夹具：每种失守形态必红、干净夹具必绿
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..");
const DATA_ROOT = process.env.MC_SKILL_DATA ?? join(REPO_ROOT, "data");
const SELFTEST = process.argv.includes("--selftest");

const DOCS_TREE = join(DATA_ROOT, "bedrock_stable", "bedrock-docs", "stable");
const SCRIPTAPI_TREE = join(DATA_ROOT, "bedrock_stable", "bedrock-scriptapi", "stable");

/** 与消费者同口径的 factor 区间；本门只认开区间，端点各对应一种失守。 */
export function factorInBand(f) {
  return typeof f === "number" && f > 0 && f < 1;
}

/** 判据②的核心：现算集合 vs 在盘集合的双向差集（返回条目级差，便于点名）。 */
export function diffGenreTags(entries, { tag, classify }) {
  const missing = [];
  const extra = [];
  for (const e of entries) {
    const should = classify(e.id, e.label);
    const has = Array.isArray(e.tags) && e.tags.includes(tag);
    if (should && !has) missing.push(String(e.id));
    if (!should && has) extra.push(String(e.id));
  }
  return { missing, extra, total: entries.length, onDisk: entries.filter((e) => (e.tags || []).includes(tag)).length };
}

/**
 * 判据④的核心：**只重排不过滤**的不变量。
 * demote(rows, isDemoted) 由调用方注入（真跑用 dist 的 applyBedrockGenreDemotion，自检用替身），
 * 这样"降权把行删掉"这种失守在夹具里也能被抓，而不依赖真函数恰好没写错。
 */
export function checkDemotionKeepsRows(rows, tagIndex, limit, demote) {
  const problems = [];
  const out = demote(rows, tagIndex, limit);
  const idsIn = rows.map((r) => r.id);
  const idsOut = out.map((r) => r.id);
  const kept = rows.filter((r) => tagIndex.get(r.id)?.includes(TAG));
  const keptOut = out.filter((r) => r.demoted === true);
  if (out.length !== Math.min(rows.length, limit)) {
    problems.push(`输出行数 ${out.length} ≠ min(输入 ${rows.length}, limit ${limit}) ⇒ 降权在删行，不是挪行`);
  }
  if (rows.length <= limit && keptOut.length !== kept.length) {
    problems.push(`被降权的页只剩 ${keptOut.length}/${kept.length} ⇒ 有页被挤出去（= 事实拉黑）`);
  }
  // 非降权页之间的相对次序必须完全不变（降权只许动被降权页的位置）
  const plainBefore = idsIn.filter((id) => !(tagIndex.get(id) ?? []).includes(TAG));
  const plainAfter = idsOut.filter((id) => !(tagIndex.get(id) ?? []).includes(TAG));
  if (plainBefore.join(",") !== plainAfter.join(",")) {
    problems.push(`非降权页相对次序被改动：改前 ${plainBefore.join(">")} / 改后 ${plainAfter.join(">")}`);
  }
  return problems;
}

let TAG = "release-notes";

async function loadProducer() {
  const mod = await import(pathToFileURL(join(HERE, "fetch-bedrock-docs.js")).href);
  if (typeof mod.isReleaseNotesPage !== "function" || typeof mod.withGenreTags !== "function") {
    throw new Error("生产者侧 isReleaseNotesPage / withGenreTags 不再导出 ⇒ 判据②失去依据（改了就同步本门）");
  }
  return mod;
}

async function loadDistConsumer() {
  const distEntry = join(REPO_ROOT, "mcp-server", "dist", "bedrock", "index.js");
  if (!existsSync(distEntry)) throw new Error(`dist/bedrock/index.js 不存在（先 cd mcp-server && npm run build）：${distEntry}`);
  return import(pathToFileURL(distEntry).href);
}

function readSrcConstant() {
  const src = readFileSync(join(REPO_ROOT, "mcp-server", "src", "bedrock", "index.ts"), "utf8");
  const m = /export const BEDROCK_RELEASE_NOTES_TAG\s*=\s*"([^"]*)"/.exec(src);
  if (!m) throw new Error("src/bedrock/index.ts 里找不到 `export const BEDROCK_RELEASE_NOTES_TAG = \"…\"` ⇒ 体裁 tag 的消费者侧登记处被摘掉");
  return m[1];
}

function readIndexL0(treeDir, label) {
  const p = join(treeDir, "index-l0.json");
  if (!existsSync(p)) throw new Error(`${label} 的 index-l0.json 不存在：${p}`);
  const parsed = JSON.parse(readFileSync(p, "utf8"));
  const arr = Array.isArray(parsed) ? parsed : (parsed.docs ?? parsed.entries ?? []);
  if (!Array.isArray(arr) || !arr.length) throw new Error(`${label} 的 index-l0.json 条目为空 ⇒ 该树被刷光，本门无法对账`);
  return arr;
}

function realRun() {
  const problems = [];
  const notes = [];
  return loadProducer()
    .then(async (prod) => {
      const dist = await loadDistConsumer();
      const srcTag = readSrcConstant();
      TAG = prod.RELEASE_NOTES_TAG;
      // ① 三方拼写
      if (srcTag !== prod.RELEASE_NOTES_TAG) {
        problems.push(`① 生产者 tag 拼写 "${prod.RELEASE_NOTES_TAG}" ≠ 消费者 src "${srcTag}" ⇒ 判据永远不成立，降权静默失效`);
      }
      if (dist.BEDROCK_RELEASE_NOTES_TAG !== prod.RELEASE_NOTES_TAG) {
        problems.push(`① dist 里的 BEDROCK_RELEASE_NOTES_TAG=${JSON.stringify(dist.BEDROCK_RELEASE_NOTES_TAG)} ≠ 生产者 "${prod.RELEASE_NOTES_TAG}" ⇒ src 改了没 npm run build，宿主跑的仍是旧代码`);
      }
      if (typeof dist.applyBedrockGenreDemotion !== "function") {
        problems.push("① dist 里没导出 applyBedrockGenreDemotion ⇒ 降权在运行时不存在（宿主检索不过这道门）");
      }
      if (!factorInBand(dist.BEDROCK_RELEASE_NOTES_DEMOTE_FACTOR)) {
        problems.push(`④ 降权系数 ${dist.BEDROCK_RELEASE_NOTES_DEMOTE_FACTOR} 不在 (0,1) ⇒ 0 是把该族页打死（= 拉黑），≥1 是没降权`);
      }
      // ②③ 在盘对账
      for (const [treeDir, label, expectSome] of [
        [DOCS_TREE, "bedrock-docs", true],
        [SCRIPTAPI_TREE, "bedrock-scriptapi", false],
      ]) {
        if (!existsSync(join(treeDir, "index-l0.json"))) {
          notes.push(`${label}：盘上无 index-l0.json ⇒ 跳过（该树未建）`);
          continue;
        }
        const entries = readIndexL0(treeDir, label);
        const d = diffGenreTags(entries, { tag: prod.RELEASE_NOTES_TAG, classify: prod.isReleaseNotesPage });
        if (expectSome && d.onDisk === 0) {
          problems.push(`② ${label}：盘上 ${d.total} 条里 0 条带 ${prod.RELEASE_NOTES_TAG} ⇒ 该体裁从未落标（跑 scripts/fetch-bedrock-docs.js --retag --write）`);
        }
        if (!expectSome && d.onDisk > 0) {
          problems.push(`③ ${label}：不该有 ${prod.RELEASE_NOTES_TAG} 页却标了 ${d.onDisk} 条：${d.extra.slice(0, 5).join(", ")} ⇒ 判据被放宽到误伤这一族`);
        }
        for (const id of d.missing.slice(0, 8)) {
          problems.push(`② ${label}：${id} 按生产者判据属 ${prod.RELEASE_NOTES_TAG}，索引里没有该 tag ⇒ 生产者改了判据而索引没重跑`);
        }
        for (const id of d.extra.slice(0, 8)) {
          if (expectSome) problems.push(`② ${label}：${id} 带 ${prod.RELEASE_NOTES_TAG} 但不满足生产者判据 ⇒ 手改索引（mergeIndexL0 下次抓取会覆盖，现在就得改回来）`);
        }
        if (problems.length === 0) {
          notes.push(`${label}：${d.total} 条，其中 ${d.onDisk} 条 ${prod.RELEASE_NOTES_TAG}（现算集合与索引逐条相等）`);
        }
        if (d.missing.length || d.extra.length) {
          notes.push(`${label} 差集：缺标 ${d.missing.length} · 多标 ${d.extra.length}（分母 ${d.total}）`);
        }
      }
      // ④⑤ 用真函数核行为（行取自对账结果，分母 = 该树真有的 RN 页）
      if (typeof dist.applyBedrockGenreDemotion === "function" && existsSync(join(DOCS_TREE, "index-l0.json"))) {
        const entries = readIndexL0(DOCS_TREE, "bedrock-docs");
        const tagIndex = new Map(entries.map((e) => [e.id, e.tags ?? []]));
        const rn = entries.filter((e) => (e.tags ?? []).includes(prod.RELEASE_NOTES_TAG)).slice(0, 12);
        const plain = entries.filter((e) => !(e.tags ?? []).includes(prod.RELEASE_NOTES_TAG)).slice(0, 18);
        const rows = [...plain.slice(0, 3), ...rn, ...plain.slice(3)];
        for (const p of checkDemotionKeepsRows(rows, tagIndex, rows.length, dist.applyBedrockGenreDemotion)) {
          problems.push(`④ ${p}`);
        }
        const ordered = dist.applyBedrockGenreDemotion(rows, tagIndex, rows.length);
        const firstPlain = ordered.findIndex((r) => !(tagIndex.get(r.id) ?? []).includes(prod.RELEASE_NOTES_TAG));
        const lastRN = ordered.reduce((n, r, i) => ((tagIndex.get(r.id) ?? []).includes(prod.RELEASE_NOTES_TAG) ? i : n), -1);
        if (rn.length && lastRN < firstPlain) {
          problems.push(`④ ${rows.length} 行里 RN 页排在首个普通页（#${firstPlain}）之前（末位 RN #${lastRN}）⇒ factor 没起作用，"降优先级"未落地`);
        }
        // ⑤ 行内 tags 兜底：tagIndex 空 ⇒ 仍须认出 RN（语义通道命中的页若只认 tagIndex 会漏降权）
        const fb = dist.applyBedrockGenreDemotion(
          [{ id: "x/rn", tags: [prod.RELEASE_NOTES_TAG] }, { id: "x/plain", tags: ["documents"] }],
          new Map(),
          20,
        );
        if (fb[0]?.id !== "x/plain" || fb[1]?.demoted !== true) {
          problems.push(`⑤ tagIndex 查不到时没回退行内 tags（输出 ${fb.map((r) => r.id + (r.demoted ? ":D" : "")).join(",")}）⇒ 只从语义通道浮出的 RN 页不会被降权`);
        }
      }
      // ⑥ 按调用放宽窗口（limit）：真 handler、真语料、真降权。
      //   默认响应必须是放宽响应的**前缀**、RN 集合只增不减、要的比池宽必须披露。
      if (typeof dist.searchBedrockDocs === "function" && typeof dist.BEDROCK_RESULT_LIMIT_MAX === "number") {
        const limitMax = dist.BEDROCK_RESULT_LIMIT_MAX;
        if (typeof dist.BEDROCK_DEFAULT_RESULT_LIMIT !== "number") {
          problems.push("⑥ dist 没导出 BEDROCK_DEFAULT_RESULT_LIMIT ⇒ 门得自己抄默认窗口（会漂移），故拒绝判定");
        }
        const defaultLimit = dist.BEDROCK_DEFAULT_RESULT_LIMIT;
        for (const p of checkLimitSchema({ schema: dist.searchBedrockDocsSchema, limitMax, tag: prod.RELEASE_NOTES_TAG })) {
          problems.push(`⑥ ${p}`);
        }
        const call = async (extra) => {
          const res = await dist.searchBedrockDocs({ query: "release notes", version: "stable", ...extra });
          let j = null;
          try {
            j = JSON.parse(res?.content?.[0]?.text ?? "{}");
          } catch {
            j = null;
          }
          return j?.result ?? j;
        };
        const d = await call({});
        const w = await call({ limit: limitMax });
        if (!d?.ok || !w?.ok) {
          problems.push(`⑥ search_bedrock_docs 真跑没拿到 ok（默认 ${JSON.stringify(d?.ok)} / 放宽 ${JSON.stringify(w?.ok)}）⇒ 这条腿没核到任何东西，别当成通过`);
        } else {
          for (const p of checkLimitWindow(d, w, prod.RELEASE_NOTES_TAG, limitMax, defaultLimit)) problems.push(`⑥ ${p}`);
          notes.push(
            `⑥ limit 真跑：默认 ${d.results.length} 条（池 ${d.demotion.candidates}，窗口内 RN ${d.demotion.demotedInResults}，被降权挤到窗口外 ${d.demotion.demotedDropped} 条）` +
              `→ 放宽到 ${limitMax} 后 ${w.results.length} 条（RN ${w.demotion.demotedInResults}，窗口外剩 ${w.demotion.demotedDropped} 条）`,
          );
        }
      } else {
        problems.push("⑥ dist 里没有 searchBedrockDocs / BEDROCK_RESULT_LIMIT_MAX ⇒ 放宽窗口这条腿没挂上（改了 src 要 npm run build）");
      }
      finish(problems, notes);
    })
    .catch((e) => {
      console.error(`assert-bedrock-genre-demote 无法判定：${e?.message ?? e}`);
      process.exitCode = 2;
    });
}

function finish(problems, notes) {
  for (const n of notes) console.log(`  · ${n}`);
  if (problems.length) {
    for (const p of problems) console.log(`✗ ${p}`);
    console.log(`assert-bedrock-genre-demote: ${problems.length} 项不达标`);
    process.exitCode = 1;
    return;
  }
  console.log("assert-bedrock-genre-demote(GENRE): 达标 —— 拼写三方一致 + 索引与生产者判据逐条相等 + 降权只重排不过滤");
}

/** 判据④的夹具：一个"合规"降权实现（挪行不删行）+ 两种失守（删行 / 不动）。 */
function fixtureDemoteKeep(rows, tagIndex, limit, factor = 0.25) {
  const keyed = rows.map((r, i) => ({ r, i, d: (tagIndex.get(r.id) ?? []).includes(TAG) }));
  keyed.sort((a, b) => (a.d ? 1 : 0) - (b.d ? 1 : 0) || a.i - b.i);   // 被降权的沉到最后，其余保原序
  return keyed.slice(0, limit).map(({ r, d }) => (d ? { ...r, demoted: true, effectiveScore: (rows.length - r.__o) / rows.length * factor } : { ...r, effectiveScore: 1 }));
}
function fixtureDemoteDeletes(rows, tagIndex, limit) {
  return rows.filter((r) => !(tagIndex.get(r.id) ?? []).includes(TAG)).slice(0, limit);
}
function fixtureDemoteNoop(rows, _tagIndex, limit) {
  return rows.slice(0, limit).map((r) => ({ ...r }));
}

/**
 * 判据⑥：按调用放宽窗口（`limit`）必须**只是把窗口拉宽**，不得动排序语义。
 * 三条可反证的性质：默认结果 = 放宽结果的前缀（逐 id 同序）；默认里的 RN 页在放宽结果里
 * 仍在（集合只增不减）；要的比池还多时必须披露（否则"调大没变多"会被读成丢了页）。
 * @param {{results:Array<{id:string,tags?:string[]}>, demotion:{resultLimit:number,requestedLimit:number|null,candidates:number,candidateLimit:number,limitMax:number,demotedInResults:number}}} def
 * @param {object} wide 同一 query 传 limit=limitMax 的响应
 */
export function checkLimitWindow(def, wide, tag, limitMax, defaultLimit) {
  const problems = [];
  const ids = (r) => (r?.results ?? []).map((x) => x.id);
  if (!def?.demotion || !wide?.demotion) return ["⑥ 取不到 search_bedrock_docs 的 demotion 块 ⇒ limit 腿没在看任何东西"];
  const a = ids(def), b = ids(wide);
  if (typeof defaultLimit === "number") {
    // 回显与**可观测量**都要核：只核 `demotion.resultLimit` 会被"截断点被跳过但字段照旧回显"骗过去
    // （实测投毒：把 applyBedrockGenreDemotion 的 limit 换成候选池上限，回显仍是 20，默认却吐 30 条）。
    if (def.demotion.resultLimit !== defaultLimit) {
      problems.push(`⑥ 未传 limit 时窗口应仍是默认 ${defaultLimit}（回显 ${def.demotion.resultLimit}）⇒ 加参数顺手改了默认口径`);
    }
    if (a.length > defaultLimit) {
      problems.push(`⑥ 未传 limit 却返回 ${a.length} 条 > 默认窗口 ${defaultLimit} ⇒ 截断点被跳过（回显对不上可观测量），所有既有调用方的返回条数都变了`);
    }
  }
  if (def.demotion.requestedLimit !== null) {
    problems.push(`⑥ 未传 limit 时 requestedLimit 应为 null（回显被改：${JSON.stringify(def.demotion.requestedLimit)}）⇒ 无法区分"默认"与"放宽"`);
  }
  if (!(wide.demotion.resultLimit === limitMax && wide.demotion.requestedLimit === limitMax)) {
    problems.push(`⑥ 传 limit=${limitMax} 后 effective/回显应同为 ${limitMax}（实得 ${wide.demotion.resultLimit}/${JSON.stringify(wide.demotion.requestedLimit)}）⇒ 参数没接到截断点`);
  }
  if (wide.demotion.candidateLimit < wide.demotion.resultLimit) {
    problems.push(`⑥ 候选池 ${wide.demotion.candidateLimit} < 窗口 ${wide.demotion.resultLimit} ⇒ "放宽"拿不到更多页，只是把同一个池重切一刀`);
  }
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) {
      problems.push(`⑥ 前缀不稳：第 ${i + 1} 行默认给 ${a[i]}、放宽给 ${b[i]} ⇒ 放宽窗口改了排序，不是只多给几条`);
      break;
    }
  }
  if (b.length < a.length) problems.push(`⑥ 放宽后反而少给：${b.length} < ${a.length} 条`);
  const rn = (r) => new Set((r?.results ?? []).filter((x) => (x.tags ?? []).includes(tag) || x.demoted === true).map((x) => x.id));
  const ra = rn(def), rb = rn(wide);
  const lost = [...ra].filter((x) => !rb.has(x));
  if (lost.length) problems.push(`⑥ 放宽窗口后默认结果里的 RN 页反而消失：${lost.slice(0, 3).join(", ")} ⇒ limit 通道夹带了过滤，违反"不删不拉黑"`);
  const pool = wide.demotion.candidates;
  if (limitMax > pool) {
    // `warning` 的真实形状是 joinSearchWarnings 汇成的一**条字符串**，夹具里我用的是数组 ⇒ 两种都得吃
    const w = Array.isArray(wide.warning) ? wide.warning.join(" ") : String(wide.warning ?? "");
    if (!/候选池|池/.test(w)) {
      problems.push(`⑥ limit=${limitMax} 比候选池（${pool} 条）还宽却没披露 ⇒ 调用方会把"只返回 ${b.length} 条"读成丢了页`);
    }
  }
  return problems;
}

/** 判据⑥的 schema 腿：`limit` 必须是带上界的有界整数，且上界给"放宽"留出空间。 */
export function checkLimitSchema({ schema, limitMax, tag }) {
  const problems = [];
  if (typeof schema?.safeParse !== "function") return ["⑥ 导出的 searchBedrockDocsSchema 不可用"];
  const ok = (v) => schema.safeParse({ query: "x", ...(v === undefined ? {} : { limit: v }) }).success;
  if (!ok(undefined)) problems.push("⑥ 不传 limit 必须合法（默认窗口是既有契约）");
  if (!ok(1)) problems.push("⑥ limit=1 被拒 ⇒ 收紧窗口的用法没了");
  if (!ok(limitMax)) problems.push(`⑥ limit=${limitMax}（= 声明的上界）被拒 ⇒ schema 与常量不同源`);
  if (ok(0)) problems.push("⑥ limit=0 被接受 ⇒ 可以一句话把对外结果清空");
  if (ok(limitMax + 1)) problems.push(`⑥ limit=${limitMax + 1} 被接受 ⇒ 无上界（token 与"谎称能给更多"都拦不住）`);
  if (ok(1.5)) problems.push("⑥ 非整数 limit 被接受 ⇒ 截断点会出现 20.5 条这种形态");
  if (ok(String(limitMax))) problems.push("⑥ 字符串 limit 被接受 ⇒ 类型没校验");
  void tag;
  return problems;
}

function selfTest() {
  const problems = [];
  const expect = (label, got, want) => {
    if (got !== want) problems.push(`${label}：期望 ${want}，实得 ${got}`);
  };
  TAG = "release-notes";
  const idx = new Map([["a/rn", ["release-notes"]], ["b/rn", ["release-notes"]], ["c", ["documents"]]]);
  const rows = [{ id: "c", tags: ["documents"] }, { id: "a/rn", tags: ["release-notes"] }, { id: "b/rn", tags: ["release-notes"] }].map((r, i) => ({ ...r, __o: i }));
  expect("干净夹具（合规降权：沉底、不删行、普通页保序）", checkDemotionKeepsRows(rows, idx, 3, fixtureDemoteKeep).length, 0);
  expect("失守 A：降权把 RN 行删掉（= 事实拉黑）", checkDemotionKeepsRows(rows, idx, 3, fixtureDemoteDeletes).length > 0, true);
  expect("失守 D：原序返回（根本没降权）", checkDemotionKeepsRows(rows, idx, 3, fixtureDemoteNoop).length > 0, true);
  expect("失守 B：factor=1（等于什么都没做）必须判不合规", factorInBand(1), false);
  expect("factor 下界 0 必须判不合规（0 = 打死这一族）", factorInBand(0), false);
  expect("factor 正常值", factorInBand(0.25), true);
  // 非降权页相对次序被动过 ⇒ 必须红
  const reorder = (r, _t, l) => [{ ...r[2] }, ...r.slice(0, 2)].slice(0, l);
  expect("失守 C：把普通页相对顺序打乱", checkDemotionKeepsRows(rows, idx, 3, reorder).length > 0, true);
  // 对账腿：缺标 / 多标各必红，逐条相等必绿
  const classify = (id) => /\/update\d+$/.test(id);
  const drift = diffGenreTags(
    [{ id: "s/update1", label: "x", tags: ["release-notes"] }, { id: "s/update2", label: "y", tags: [] }, { id: "s/plain", label: "z", tags: [] }],
    { tag: TAG, classify },
  );
  expect("对账：该标没标 ⇒ 点名 1 条、多标 0 条", `${drift.missing.length}/${drift.extra.length}`, "1/0");
  const poisoned = diffGenreTags(
    [{ id: "s/update1", label: "x", tags: ["release-notes"] }, { id: "s/update2", label: "y", tags: ["release-notes"] }, { id: "s/plain", label: "z", tags: ["release-notes"] }],
    { tag: TAG, classify },
  );
  expect("对账：手改索引硬打 tag ⇒ 多标点名 1 条（缺标 0）", `${poisoned.missing.length}/${poisoned.extra.length}`, "0/1");
  const clean = diffGenreTags(
    [{ id: "s/update1", label: "x", tags: ["release-notes"] }, { id: "s/plain", label: "z", tags: ["documents"] }],
    { tag: TAG, classify },
  );
  expect("对账：索引与判据逐条相等 ⇒ 双向 0", `${clean.missing.length}/${clean.extra.length}`, "0/0");
  // 判据⑥（按调用放宽窗口）。夹具只管"判据会不会红"；真上界与真 schema 的一致性在真跑腿里核
  // （这里故意不用 zod 造一份假 schema 当生产真值 —— 抄一份就等于又造了一个会漂移的期望）。
  const RN = "s/update1.21.40";
  const RN2 = "s/update1.20.30";
  // 夹具世界：默认窗口 2 条（= defRows 行数，与真语料同形：默认窗口就该正好吐满）、
  // 上界 5 条、池 5 条（够宽 ⇒ 不必披露）。每条"⑥ 失守"只红一条腿。
  const DL = 2;
  const defRows = [{ id: "p1", tags: ["documents"] }, { id: RN, tags: ["release-notes"] }];
  const wideRows = [...defRows, { id: "p2", tags: ["documents"] }, { id: RN2, tags: ["release-notes"] }];
  const dem = (o) => ({ resultLimit: DL, requestedLimit: null, candidates: 5, candidateLimit: 60, limitMax: 5, demotedInResults: 1, ...o });
  const resp = (rows, d, warning = []) => ({ results: rows, demotion: dem(d), warning });
  const d6 = resp(defRows, {});
  const w6 = resp(wideRows, { resultLimit: 5, requestedLimit: 5, candidates: 5 });
  expect("⑥ 干净：默认是放宽结果的前缀、RN 只增、池够 ⇒ 绿", checkLimitWindow(d6, w6, TAG, 5, DL).length, 0);
  expect("⑥ 失守：放宽后前缀换了（等于重排）",
    checkLimitWindow(d6, resp([wideRows[1], wideRows[0], wideRows[2], wideRows[3]], { resultLimit: 5, requestedLimit: 5 }), TAG, 5, DL).length > 0, true);
  expect("⑥ 失守：放宽后默认里的 RN 页消失（limit 通道夹带过滤）",
    checkLimitWindow(d6, resp(wideRows.map((r) => ({ ...r, tags: ["documents"] })), { resultLimit: 5, requestedLimit: 5 }), TAG, 5, DL).length > 0, true);
  expect("⑥ 失守：要的比池宽却没披露",
    checkLimitWindow(d6, resp(wideRows, { resultLimit: 5, requestedLimit: 5, candidates: 2 }, []), TAG, 5, DL).length > 0, true);
  expect("⑥ 失守：未传 limit 却回显了数字",
    checkLimitWindow(resp(defRows, { requestedLimit: DL }), w6, TAG, 5, DL).length > 0, true);
  expect("⑥ 失守：默认窗口回显被改（加了参数顺手改默认）",
    checkLimitWindow(resp(defRows, { resultLimit: 5 }), w6, TAG, 5, DL).length > 0, true);
  expect("⑥ 失守：截断点被跳过（回显照旧但默认吐满 4 条 > 2）",
    checkLimitWindow(resp([...defRows, wideRows[2], wideRows[3]], {}), w6, TAG, 5, DL).length > 0, true);
  expect("⑥ 失守：候选池小于窗口（放宽是假的）",
    checkLimitWindow(d6, resp(wideRows, { resultLimit: 5, requestedLimit: 5, candidateLimit: 3, candidates: 5 }, ["候选池 5 条"]), TAG, 5, DL).length > 0, true);
  expect("⑥ 失守：少给行（放宽后反而短）",
    checkLimitWindow(d6, resp(wideRows.slice(0, 1), { resultLimit: 5, requestedLimit: 5 }), TAG, 5, DL).length > 0, true);
  const stubSchema = (max, { int = true, coerced = false } = {}) => ({
    safeParse: (v) => {
      if (v.limit === undefined) return { success: true };
      const x = v.limit;
      const num = typeof x === "number" || (coerced && typeof x === "string" && x.trim() !== "");
      const n = Number(x);
      return { success: num && Number.isFinite(n) && (!int || Number.isInteger(n)) && n >= 1 && n <= max };
    },
  });
  expect("⑥ schema：有界整数上界 = 池上限 ⇒ 绿（且边界都判对）",
    checkLimitSchema({ schema: stubSchema(60), limitMax: 60, tag: TAG }).length, 0);
  expect("⑥ schema：无上界 ⇒ 红", checkLimitSchema({ schema: stubSchema(1e9), limitMax: 60, tag: TAG }).length > 0, true);
  expect("⑥ schema：允许非整数（含 0）⇒ 红", checkLimitSchema({ schema: stubSchema(60, { int: false }), limitMax: 60, tag: TAG }).length > 0, true);
  expect("⑥ schema：字符串被 coerce ⇒ 红", checkLimitSchema({ schema: stubSchema(60, { coerced: true }), limitMax: 60, tag: TAG }).length > 0, true);
  finish(problems, ["--selftest：4 种降权失守（A 删行 / B factor=1 / C 打乱普通页序 / D 原序返回）+ factor 两端 + 3 种对账形态 + 9 种 limit 失守 + 4 种 schema 形状"]);
}

if (SELFTEST) selfTest();
else realRun();
