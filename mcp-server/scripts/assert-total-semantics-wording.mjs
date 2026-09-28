#!/usr/bin/env node
/**
 * 「total 语义」这句话到底有没有到消费者眼前（2026-09-27 用户裁定：值得从 test-core 抽成门，挂进默认门链）。
 *
 * 立案背景：`L79①` 那次同一句被写进 6 处 docs-platform 的 schema 包装对象，而 `src/tool-registry.ts`
 * 注册时用的是**另一份字面量** ⇒ 实测 82 件工具的顶层描述含该句 0 件（A-2）。补落点后（`TOTAL_SEMANTICS_DESC`
 * 并进 4 个 search 的两条机制）这句确实到了消费者眼前，但**没有门**：删掉措辞不会红 = `L72` 的「改了没有门 = 老路」。
 *
 * 判什么（真跑六断）：
 *  1 源面：`+ VERBATIM_DESC + TOTAL_SEMANTICS_DESC,` 的配对点恰好 8（4 处 registerTool + 4 处 indexToolSchemas）。
 *  2 镜像面：`indexToolSchemas`（CLI list-tools 读的那份）里 4 个具名 search 工具的 description 各含该句。
 *  3 地板：全镜像含该句的工具数 ≥ 4（掉到 0 = 采集面塌，不当「干净」读）。
 *  4 消费者面：真跑 `node dist/cli.js list-tools` 子进程，其输出含该句 ≥ 4 —— 看被测系统自己印的东西，不看源码字符串。
 *  5 注入面：根 `AGENTS.md` 含「本次返回条数」≥ 2（quilt 两条）+ `README.md` ≥ 1（响应契约段）。
 *  6 机读面（`L79` ② + `L114` 两档两判据）：直调 **生产搜索函数**，11 个面各两发 ——
 *    低档（limit=1／bedrock 与平台面 2）+ 高档（limit = 从 `dist` 现取的该面 limitMax，门里不抄数字，先例 = `assert-bedrock-genre-demote.mjs:28`）。
 *    面分两桶：**发射点桶 8 个具名 label**（八个载荷 `return`，含 quilt 的两条腿）与 **平台路由桶 3 个面**（liteloader／rift／modloader，走通用口）。
 *    七条腿（与 `checkPoolFaces` 内注释同序）：① 逐行自洽（`totalPool` 是数／`truncated` 是布尔／`total === results.length`／池 ≥ 返回／`truncated === (n < 池)`）
 *    ② 高档那发的 `limit` 必须等于该面 `limitMax`（探针接错档 = 跨档腿白量；常量没接到 dist 也在这里响）
 *    ③ 两桶各自逐名点名，低档与高档各一遍 ⇒ 摘腿或改名即红并点名缺哪个（地板只由发射点桶计 = 8，平台行数养不肥它）
 *    ④ 平台桶半接（只有一档）即红
 *    ⑤ **跨档 `totalPool` 必须相等**（逐面、无条件，不含容量假设 ⇒ 专抓「池是从窗口里取的」那一形：limit=1 时池会读成 1）
 *    ⑥ 反向腿：高档至少一面 `truncated === false ∧ totalPool === n` ⇒ 防恒真（专职载体 = `search_docs(platform=modloader) @1.6.4`，
 *       池 1 ≤ `limit` 下界 ⇒ 结构上翻不出 true；若哪天该面语料涨过面界，红字点名换载体，**禁止改成钉数字**）
 *    ⑦ 防恒假：低档至少一面 `truncated === true`。
 *    只读公开载荷，不碰 store／私有接口（`L114` 裁定：直测内部真值要给 10 个取数点各造一份内部真值源，判据会架在私有接口上）。
 *
 * --selftest：十八组投毒（判据 1–5 的六条断言各一记 + 判据 6 的十二记：缺位／池比返回小／式子不符／全取尽只剩恒假／
 * 发射点整面被摘／取数失败／高档被摘／跨档不等／modloader 被冒充／高档全截断／平台桶半接／高档 limit 接错档）
 * + 三组正控 + 四组反证（防恒真、防「读不出」塌成「到了」、防恒红装饰、防平台行数养肥地板），
 * 另带三桶例数地板（链上那圈 `--selftest` 只看 rc ⇒ 掏空 cases 必须在门内自己红）。
 * 每条投毒臂断言的是**具体那条腿的红字**（`hasErr(res, 那条腿的措辞)`），不接受「反正整体红了」。
 * 编号刻意不叫 S20：那个号在本仓 harness 里已被占用两处（test-scripts 的写盘 guard 与另一处语境）。
 */
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const MCP = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = join(MCP, "..");
const MARK = "total 语义";
const DOC_MARK = "本次返回条数";
const PAIR = "+ VERBATIM_DESC + TOTAL_SEMANTICS_DESC,";
const NEED = ["search_forge_docs", "search_fabric_docs", "search_neoforge_docs", "search_docs"];

/** 判据本体（纯函数）：非字符串一律不算到达 —— 「读不出来」不得塌成「到了」。 */
export function reaches(desc) {
  return typeof desc === "string" && desc.includes(MARK);
}

/** 五断 + 两条地板，输入全是现测数 ⇒ selftest 可以用合成载荷把每一断单独做红。 */
export function checkWiring(m) {
  const errors = [];
  if (m.pairs !== 8) {
    errors.push(`注册面配对点 = ${m.pairs}（须恰好 8 = 4 处 registerTool + 4 处 indexToolSchemas）⇒ 有人把措辞从某条机制上摘了，或加了第 5 个 search 面没跟上`);
  }
  if (m.missing.length) errors.push(`镜像里这些工具的顶层描述不含该句：${m.missing.join(", ")}`);
  if (!(m.onFace >= 4)) errors.push(`[FLOOR] 含该句的镜像条目只有 ${m.onFace}（下界 4）⇒ 措辞被整体摘掉或镜像改名`);
  if (!(m.cliHits >= 4)) errors.push(`[FLOOR] 真 CLI 输出只数到 ${m.cliHits} 处（下界 4）⇒ 源码与产出不同源（没重新 build？dist 是旧的？）`);
  if (!(m.agentsHits >= 2)) errors.push(`[FLOOR] 根 AGENTS.md 只数到 ${m.agentsHits} 处「${DOC_MARK}」（下界 2 = quilt 两条）⇒ 注入面被删空`);
  if (!(m.readmeHits >= 1)) errors.push(`[FLOOR] README 数到 ${m.readmeHits} 处「${DOC_MARK}」（下界 1 = 响应契约段）`);
  return { ok: errors.length === 0, errors };
}

/**
 * 判据 6 的两桶名单（八个载荷发射点 + 三个平台路由面）。
 * 发射点桶逐名点名（地板只由该桶计）；平台桶**不参与地板**，只在「在场」时核自洽与跨档配对
 * —— 删掉三个平台面仍绿（证明地板没被平台行数养肥），某个面只剩一档则红（半接）。
 */
export const EMISSION_LABELS = [
  "search_fabric_docs",
  "search_forge_docs",
  "search_neoforge_docs",
  "search_community_docs",
  "search_docs(platform=forge)",
  "search_docs(platform=quilt,自有语料腿)",
  "search_docs(platform=quilt,回退Fabric腿)",
  "search_bedrock_docs",
];
export const PLATFORM_LABELS = ["search_docs(platform=liteloader)", "search_docs(platform=rift)", "search_docs(platform=modloader)"];

/**
 * 判据 6（`L79` ② 机读位 + `L114` 两档两判据）七条腿，按本函数内的执行顺序编号：
 *  ① 逐行自洽：`totalPool` 是数 / `truncated` 是布尔 / `total === results.length` / 池 ≥ 返回 / `truncated === (n < 池)`
 *  ② 高档那发的 `limit` 必须等于该面 `limitMax`（探针接错档 = 跨档那条腿白量；常量没接到 dist 也在这里响）
 *  ③ 发射点桶逐名点名，低档与高档各一遍（缺名或改名 ⇒ 红并点名；地板只由该桶计 ⇒ 平台行数养不肥它）
 *  ④ 平台桶半接即红（在场才核，不参与地板）
 *  ⑤ **跨档 `totalPool` 必须相等**（逐面、无条件；不含容量假设 ⇒ 专抓「池是从窗口里取的」那一形）
 *  ⑥ 反向腿（高档）：至少一面 `truncated === false ∧ totalPool === n` ⇒ 防恒真；专职载体 = `search_docs(platform=modloader) @1.6.4`
 *     （池 1 ≤ `limit` 下界，结构上翻不出 true）；若哪天该面语料涨过面界，红字会点名换载体，禁止改成钉数字
 *  ⑦ 防恒假（低档）：至少一面 `truncated === true`
 * 只钉不变式，禁止钉池数（补抓／换源必然让 pool 涨）。
 */
export function checkPoolFaces(rows, opts = {}) {
  const emission = opts.emission ?? EMISSION_LABELS;
  const platform = opts.platform ?? PLATFORM_LABELS;
  const errors = [];
  const at = (label, tier) => rows.find((r) => r.face === label && r.tier === tier);
  for (const r of rows) {
    const tag = `${r.face}/${r.tier ?? "?"}`;
    if (r.error) {
      errors.push(`${tag} 取不到载荷 ⇒ 无法取证（${r.error}）`);
      continue;
    }
    if (typeof r.totalPool !== "number") errors.push(`${tag} 缺机读位 totalPool（实得 ${String(r.totalPool)}）⇒ 「措辞到了但字段没到」`);
    if (typeof r.truncated !== "boolean") errors.push(`${tag} 缺机读位 truncated（实得 ${String(r.truncated)}）`);
    if (typeof r.n !== "number") {
      errors.push(`${tag} 数不出 results 条数 ⇒ 本面的式子无法核对`);
      continue;
    }
    if (typeof r.total === "number" && r.total !== r.n) errors.push(`${tag} 的 total(${r.total}) != results 条数(${r.n}) ⇒ 两个数不同源`);
    if (typeof r.totalPool === "number") {
      if (r.totalPool < r.n) errors.push(`${tag} 的池(${r.totalPool}) 比返回(${r.n}) 还小 ⇒ 取数点落在截断之后，这条位等于没加`);
      else if (typeof r.truncated === "boolean" && r.truncated !== r.n < r.totalPool) errors.push(`${tag} 的 truncated(${r.truncated}) 与「n<池」(${r.n < r.totalPool}) 不符`);
    }
  }
  // ③ 高档那发的 limit 必须真的等于该面面界（探针接错档 ⇒ 跨档那条腿量的就不是「放宽到顶」）
  for (const r of rows) {
    if (r.tier !== "high" || r.error) continue;
    if (typeof r.limit === "number" && typeof r.limitMax === "number" && r.limit !== r.limitMax)
      errors.push(`${r.face} 高档那发的 limit(${r.limit}) 不是该面的 limitMax(${r.limitMax}) ⇒ 跨档腿量的不是「放宽到面界」，且该常量没接到 dist`);
  }
  for (const tier of ["low", "high"]) {
    const missing = emission.filter((l) => !at(l, tier));
    const got = rows.filter((r) => r.tier === tier && emission.includes(r.face)).length;
    if (missing.length) errors.push(`[发射点桶/${tier}] 这些具名发射点没测到：${missing.join("、")} ⇒ 摘腿或改名，不得按「其余都过」放行`);
    if (got < emission.length) errors.push(`[FLOOR-未跑/${tier}] 发射点桶只测到 ${got}（下界 ${emission.length}，按名点名）⇒ 有一条腿没接上`);
  }
  for (const l of platform) {
    const lo = at(l, "low");
    const hi = at(l, "high");
    if (!lo && !hi) continue;
    if (!lo || !hi) errors.push(`${l} 平台桶半接（缺${lo ? "高档" : "低档"}）⇒ 跨档那条腿对它等于没跑`);
  }
  for (const l of [...emission, ...platform]) {
    const lo = at(l, "low");
    const hi = at(l, "high");
    if (!lo || !hi || lo.error || hi.error) continue;
    if (typeof lo.totalPool !== "number" || typeof hi.totalPool !== "number") continue;
    if (lo.totalPool !== hi.totalPool) errors.push(`${l} 跨档池不等：低档(${lo.totalPool}) vs 高档(${hi.totalPool}) ⇒ 该面的池是从窗口里取的，不是在手候选`);
  }
  const hiRows = rows.filter((r) => r.tier === "high" && !r.error);
  const hiExhausted = hiRows.filter((r) => r.truncated === false && r.totalPool === r.n).length;
  if (hiRows.length > 0 && hiExhausted === 0)
    errors.push(`高档 ${hiRows.length} 发全部报 truncated=true ⇒ 反向腿熄火（这条位可能恒真，或池被高估到超过一切面界）；专职载体应是 search_docs(platform=modloader) @1.6.4，见判据 6 腿 ⑥ 注`);
  const loRows = rows.filter((r) => r.tier === "low" && !r.error);
  const loTrue = loRows.filter((r) => r.truncated === true).length;
  if (loRows.length >= emission.length && loTrue === 0)
    errors.push(`低档 ${loRows.length} 发全部报 truncated=false ⇒ 截断位可能恒假（池 == 返回 只有在真的取尽时才成立），必须有一面能报 true`);
  const bucket = (labels, tier) => rows.filter((r) => r.tier === tier && labels.includes(r.face)).length;
  return {
    ok: errors.length === 0,
    errors,
    faces: rows.length,
    emissionLow: bucket(emission, "low"),
    emissionHigh: bucket(emission, "high"),
    platformLow: bucket(platform, "low"),
    platformHigh: bucket(platform, "high"),
    hiExhausted,
    loTrue,
  };
}

/**
 * 判据 6 的取数：直接叫生产搜索函数（与 CLI 同一份实现），每个面**两档各一发**。
 * 高档的 limit 从 `dist` 取该面 limitMax 常量 ⇒ 门里不抄任何数字（先例 = `assert-bedrock-genre-demote.mjs:28`）。
 * 只读公开载荷，不碰 store／私有接口（`L114` 裁定：直测内部真值的成本 = 给 10 个取数点各造一份内部真值源，判据会架在私有接口上）。
 */
async function measurePoolFaces() {
  const url = (p) => pathToFileURL(join(MCP, "dist", p)).href;
  const docs = await import(url("docs-platform/index.js"));
  const quiltConsts = await import(url("docs-platform/quilt-search.js"));
  const bedrockMod = await import(url("bedrock/index.js"));
  const consts = { ...docs, ...quiltConsts, ...bedrockMod };
  const forgeMod = () => import(url("docs-platform/forge/index.js"));
  const specs = [
    ["search_fabric_docs", "E", "FABRIC_SEARCH_LIMIT_MAX", 1, (a) => import(url("docs-platform/fabric/index.js")).then((m) => m.searchFabricDocs({ query: "registry", version: "1.21.11", ...a }))],
    ["search_forge_docs", "E", "FORGE_SEARCH_LIMIT_MAX", 1, (a) => forgeMod().then((m) => m.searchForgeDocs({ query: "event", version: "1.20.1", ...a }))],
    ["search_neoforge_docs", "E", "NEOFORGE_SEARCH_LIMIT_MAX", 1, (a) => import(url("docs-platform/neoforge/index.js")).then((m) => m.searchNeoForgeDocs({ query: "registry", version: "1.21.1", ...a }))],
    ["search_community_docs", "E", "COMMUNITY_SEARCH_LIMIT_MAX", 1, (a) => import(url("docs-platform/community/index.js")).then((m) => m.searchCommunityDocs({ query: "崩溃", ...a }))],
    ["search_docs(platform=forge)", "E", "SEARCH_DOCS_LIMIT_MAX", 1, (a) => forgeMod().then((m) => m.searchDocs({ platform: "forge", query: "registry", version: "1.20.1", ...a }))],
    ["search_docs(platform=quilt,自有语料腿)", "E", "QUILT_SEARCH_LIMIT_MAX", 1, (a) => forgeMod().then((m) => m.searchDocs({ platform: "quilt", query: "registry", version: "1.20.1", ...a }))],
    ["search_docs(platform=quilt,回退Fabric腿)", "E", "QUILT_SEARCH_LIMIT_MAX", 1, (a) => forgeMod().then((m) => m.searchDocs({ platform: "quilt", query: "registry", version: "1.21.4", ...a }))],
    ["search_bedrock_docs", "E", "BEDROCK_RESULT_LIMIT_MAX", 2, (a) => bedrockMod.searchBedrockDocs({ query: "block", version: "stable", ...a })],
    ["search_docs(platform=liteloader)", "P", "SEARCH_DOCS_LIMIT_MAX", 2, (a) => forgeMod().then((m) => m.searchDocs({ platform: "liteloader", query: "item", version: "1.12.2", ...a }))],
    ["search_docs(platform=rift)", "P", "SEARCH_DOCS_LIMIT_MAX", 2, (a) => forgeMod().then((m) => m.searchDocs({ platform: "rift", query: "event", version: "1.13.2", ...a }))],
    ["search_docs(platform=modloader)", "P", "SEARCH_DOCS_LIMIT_MAX", 2, (a) => forgeMod().then((m) => m.searchDocs({ platform: "modloader", query: "block", version: "1.6.4", ...a }))],
  ];
  const rows = [];
  for (const [face, bucket, maxKey, lowLimit, call] of specs) {
    const max = consts[maxKey];
    for (const [tier, limit] of [
      ["low", lowLimit],
      ["high", max],
    ]) {
      if (typeof max !== "number") {
        rows.push({ face, bucket, tier, error: `dist 里取不到该面 limitMax 常量 ${maxKey}（实得 ${String(max)}）⇒ 门不许抄数字，这条腿没挂上（改了 dist 导出要重新 build）` });
        continue;
      }
      try {
        const raw = await call({ limit });
        const text = raw?.content?.[0]?.text;
        const p = typeof text === "string" ? JSON.parse(text) : raw;
        rows.push({
          face,
          bucket,
          tier,
          limit,
          limitMax: max,
          total: p?.total,
          n: Array.isArray(p?.results) ? p.results.length : undefined,
          totalPool: p?.totalPool,
          truncated: p?.truncated,
        });
      } catch (e) {
        rows.push({ face, bucket, tier, error: String(e?.message ?? e).slice(0, 140) });
      }
    }
  }
  return rows;
}

async function realRun() {
  const srcPath = join(MCP, "src", "tool-registry.ts");
  if (!existsSync(srcPath)) return [`源面不在：${srcPath}`];
  const srcTs = readFileSync(srcPath, "utf8").replace(/\r\n/g, "\n");
  const pairs = srcTs.split(PAIR).length - 1;

  const regUrl = pathToFileURL(join(MCP, "dist", "tool-registry.js")).href;
  const { indexToolSchemas } = await import(regUrl);
  const face = Array.isArray(indexToolSchemas) ? indexToolSchemas : [];
  const missing = NEED.filter((n) => !reaches(face.find((e) => e?.name === n)?.description));
  const onFace = face.filter((e) => reaches(e?.description)).length;

  const cli = spawnSync(process.execPath, [join(MCP, "dist", "cli.js"), "list-tools"], {
    cwd: MCP,
    encoding: "utf8",
    windowsHide: true,
    env: { ...process.env, MC_SKILL_DATA: process.env.MC_SKILL_DATA ?? join(REPO, "data") },
  });
  if (cli.status !== 0) return [`list-tools 跑不起来（rc=${cli.status}）⇒ 消费者面无法取证：${String(cli.stderr).slice(0, 200)}`];
  const cliHits = String(cli.stdout).split(MARK).length - 1;

  const agents = existsSync(join(REPO, "AGENTS.md")) ? readFileSync(join(REPO, "AGENTS.md"), "utf8") : "";
  const readme = existsSync(join(REPO, "README.md")) ? readFileSync(join(REPO, "README.md"), "utf8") : "";
  const m = {
    pairs,
    need: NEED,
    missing,
    onFace,
    cliHits,
    agentsHits: agents.split(DOC_MARK).length - 1,
    readmeHits: readme.split(DOC_MARK).length - 1,
  };
  const { ok, errors } = checkWiring(m);
  const poolRows = await measurePoolFaces();
  const pf = checkPoolFaces(poolRows);
  const all = [...errors, ...pf.errors];
  const brief = (tier) =>
    poolRows
      .filter((r) => r.tier === tier)
      .map((r) => `${r.face.replace("search_docs(platform=", "docs:").replace(")", "")}:${r.limit ?? "?"}=${r.error ? "取数失败" : `${r.n}/${r.totalPool}/${r.truncated ? "截断" : "取尽"}`}`)
      .join(" · ");
  if (all.length === 0) {
    console.log(
      `assert-total-semantics-wording: ok · 配对 ${m.pairs}/8 · 镜像具名 4/4 · 全镜像含句 ${m.onFace} 件 · CLI 实输出 ${m.cliHits} 处 · AGENTS ${m.agentsHits} · README ${m.readmeHits} · ` +
        `发射点 ${pf.emissionLow}/${pf.emissionLow} 名 × 两档 · 平台面 ${pf.platformLow}/${pf.platformHigh} 对（共 ${pf.faces} 发） · 低档截断 ${pf.loTrue} 发 · 高档取尽 ${pf.hiExhausted} 发\n` +
        `    低档（limit/返回/池/态）：${brief("low")}\n` +
        `    高档（limit/返回/池/态）：${brief("high")}`,
    );
    return [];
  }
  console.error("assert-total-semantics-wording: FAIL\n" + all.map((e) => `  - ${e}`).join("\n"));
  return all;
}

function selfTest() {
  const ok = () => ({ pairs: 8, need: NEED, missing: [], onFace: 4, cliHits: 4, agentsHits: 2, readmeHits: 1 });
  // 判据 6 的两桶两档夹具（形状照真跑的 11 个面；数字是夹具不是实测，门只核不变式）。
  // 每个面两发：低档 n 小 ⇒ 截断，高档 n == 池 ⇒ 取尽 —— 「跨档池相等」这条腿要求两发的 pool 一致。
  const POOL_TABLE = [
    ["search_fabric_docs", "E", 1, 20, 15],
    ["search_forge_docs", "E", 1, 20, 12],
    ["search_neoforge_docs", "E", 1, 30, 8],
    ["search_community_docs", "E", 1, 50, 6],
    ["search_docs(platform=forge)", "E", 1, 30, 5],
    ["search_docs(platform=quilt,自有语料腿)", "E", 1, 20, 4],
    ["search_docs(platform=quilt,回退Fabric腿)", "E", 1, 20, 3],
    ["search_bedrock_docs", "E", 2, 60, 38],
    ["search_docs(platform=liteloader)", "P", 2, 30, 10],
    ["search_docs(platform=rift)", "P", 2, 30, 5],
    ["search_docs(platform=modloader)", "P", 1, 30, 1],
  ];
  const poolRowsOk = () =>
    POOL_TABLE.flatMap(([face, bucket, nLow, limitMax, pool]) => [
      { face, bucket, tier: "low", limit: nLow, limitMax, total: nLow, n: nLow, totalPool: pool, truncated: nLow < pool },
      { face, bucket, tier: "high", limit: limitMax, limitMax, total: pool, n: pool, totalPool: pool, truncated: false },
    ]);
  const rowsWith = (mut) => poolRowsOk().map((r) => ({ ...r, ...mut(r) }));
  const dropRow = (face, tier) => poolRowsOk().filter((r) => !(r.face === face && (!tier || r.tier === tier)));
  const hasErr = (res, needle) => res.errors.some((e) => e.includes(needle));
  const cases = [
    ["正控：五断齐全 ⇒ 绿", checkWiring(ok()).ok === true],
    ["正控：判据对含句描述 ⇒ true", reaches(`前缀 ${MARK} 后缀`) === true],
    ["反证①：判据对无句描述必须 false（防恒真装饰）", reaches("搜索官方文档，返回页面 ID 列表") === false],
    ["反证②：判据对 undefined 必须 false（读不出 ≠ 到了）", reaches(undefined) === false],
    ["投毒①：一处机制被摘（配对 7）⇒ 红", checkWiring({ ...ok(), pairs: 7 }).ok === false],
    ["投毒②：镜像里某个 search 工具丢了该句 ⇒ 红并点名", checkWiring({ ...ok(), missing: ["search_docs"] }).ok === false],
    ["投毒③：全镜像含句掉到 0 ⇒ 红（采集面塌不读成干净）", checkWiring({ ...ok(), onFace: 0, missing: NEED.slice() }).ok === false],
    ["投毒④：改了 src 没重新 build（CLI 输出 0 处）⇒ 红", checkWiring({ ...ok(), cliHits: 0 }).ok === false],
    ["投毒⑤：根 AGENTS 注入面被删空 ⇒ 红", checkWiring({ ...ok(), agentsHits: 0 }).ok === false],
    ["投毒⑥：README 响应契约段丢了 ⇒ 红", checkWiring({ ...ok(), readmeHits: 0 }).ok === false],
    // —— 判据 6（截断位）的两桶两档臂：每条都断言**具体那条腿**的红字，不接受「反正整体红了」
    ["正控：判据 6 两桶两档齐全 ⇒ 绿", checkPoolFaces(poolRowsOk()).ok === true],
    [
      "投毒⑦：一面缺 totalPool ⇒ 红并点名「字段没到」",
      hasErr(checkPoolFaces(poolRowsOk().map((r, i) => (i === 0 ? { ...r, totalPool: undefined } : r))), "totalPool"),
    ],
    [
      "投毒⑧：池比返回还小 ⇒ 红并点名「落在截断之后」",
      hasErr(checkPoolFaces(rowsWith((r) => (r.face === "search_forge_docs" && r.tier === "low" ? { totalPool: 0, truncated: false } : {}))), "截断之后"),
    ],
    [
      "投毒⑨：truncated 与「n<池」不符 ⇒ 红并点名该面",
      hasErr(checkPoolFaces(rowsWith((r) => (r.face === "search_neoforge_docs" && r.tier === "low" ? { truncated: false } : {}))), "search_neoforge_docs"),
    ],
    [
      "投毒⑩：两档同步把返回抬到池（全报取尽）⇒ 恰好一条红，且就是防恒假那条",
      (() => {
        const res = checkPoolFaces(rowsWith((r) => ({ n: r.totalPool, total: r.totalPool, truncated: false })));
        return res.errors.length === 1 && hasErr(res, "恒假");
      })(),
    ],
    ["投毒⑪：摘掉一个发射点面（两档都没了）⇒ 红并按名点出缺哪个", hasErr(checkPoolFaces(dropRow("search_community_docs")), "search_community_docs")],
    [
      "投毒⑫：某面取数失败 ⇒ 红并点名（不得塌成「该面没这条位」）",
      hasErr(checkPoolFaces(poolRowsOk().map((r) => (r.face === "search_docs(platform=forge)" && r.tier === "low" ? { face: r.face, bucket: "E", tier: "low", error: "boom" } : r))), "取不到载荷"),
    ],
    [
      "投毒⑬：只摘高档那一发（发射点面）⇒ 高档桶地板红并点名",
      hasErr(checkPoolFaces(dropRow("search_fabric_docs", "high")), "FLOOR-未跑/high"),
    ],
    [
      "投毒⑭：同一面跨档池不等 ⇒ 红并点名该面与两个数",
      hasErr(checkPoolFaces(rowsWith((r) => (r.face === "search_forge_docs" && r.tier === "high" ? { totalPool: 999 } : {}))), "跨档池不等"),
    ],
    [
      "投毒⑮：modloader 高档被冒充（truncated=true ∧ 池>返回）⇒ 跨档腿必红",
      hasErr(
        checkPoolFaces(
          rowsWith((r) => (r.face === "search_docs(platform=modloader)" && r.tier === "high" ? { n: 1, total: 1, totalPool: 2, truncated: true } : {})),
        ),
        "platform=modloader",
      ),
    ],
    [
      "投毒⑯：高档 11 发全报截断 ⇒ 反向腿红（这条位可能恒真）",
      hasErr(checkPoolFaces(rowsWith((r) => (r.tier === "high" ? { n: Math.max(0, r.totalPool - 1), total: Math.max(0, r.totalPool - 1), truncated: true } : {}))), "反向腿熄火"),
    ],
    [
      "投毒⑰：平台桶半接（只留低档）⇒ 红并点名该面",
      hasErr(checkPoolFaces(dropRow("search_docs(platform=rift)", "high")), "半接"),
    ],
    [
      "投毒⑱：高档那发的 limit 不是该面面界（探针接错档）⇒ 红并点名",
      hasErr(checkPoolFaces(rowsWith((r) => (r.tier === "high" && r.face === "search_bedrock_docs" ? { limit: 2 } : {}))), "不是该面的 limitMax"),
    ],
    ["反证③：判据对齐全夹具必须真绿（防恒红装饰）", checkPoolFaces(poolRowsOk()).ok === true],
    ["反证④：删掉 3 个平台面（共 6 发）⇒ 仍绿（地板没被平台行数养肥）", checkPoolFaces(poolRowsOk().filter((r) => r.bucket !== "P")).ok === true],
  ];
  let bad = 0;
  for (const [label, pass] of cases) {
    console.log(`  ${pass ? "✓" : "✗"} ${label}`);
    if (!pass) bad++;
  }
  const pos = cases.filter(([l]) => l.startsWith("正控")).length;
  // 三桶地板（先例 = assert-powershell #14a）：链上那圈 `--selftest` 只看 rc ⇒ 把 cases 掏空到 1 条
  // 也不会红，所以「例数塌陷」必须在门内自己判红。分母口径 = 本函数现数的 cases，不写死在别处。
  const poison = cases.filter(([l]) => l.startsWith("投毒")).length;
  const antiTrue = cases.filter(([l]) => l.startsWith("反证")).length;
  let floorBad = 0;
  for (const [name, got, floor] of [
    ["正控", pos, 3],
    ["投毒", poison, 18],
    ["反证（防恒真／防塌成『读不出=到了』／防平台行数养肥地板）", antiTrue, 4],
  ]) {
    if (got < floor) {
      console.error(`selftest 例数塌陷：${name}只剩 ${got}（地板 ${floor}）⇒ 自检被掏空，rc 判红`);
      floorBad++;
    }
  }
  console.log(
    `selftest: ${cases.length - bad}/${cases.length} 例通过（${pos} 正控 + ${poison} 投毒 + ${antiTrue} 反证，分母现数）` +
      (floorBad ? ` · 三桶地板 ${floorBad} 条判红` : " · 三桶地板齐"),
  );
  return bad + floorBad;
}

if (process.argv.includes("--selftest")) {
  process.exit(selfTest() ? 1 : 0);
}
const errs = await realRun();
if (errs.length) process.exit(1);
