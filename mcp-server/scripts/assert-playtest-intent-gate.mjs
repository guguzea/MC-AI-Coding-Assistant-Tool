#!/usr/bin/env node
/**
 * assert-playtest-intent-gate.mjs —— 任务 B ⑷（用户裁定 4B：opt-in 门）：in_jvm_player_agent
 * 意图执行器（`temp/client tick` 档上的真执行器）与 `playtest_intent` 邮箱工具的执法门。
 *
 * 判据四族（**默认跑前三族，全部离线、只写 OS tmpdir**）：
 *   A. 菜单契约：`generate_playtest_driver(driverMode=in_jvm_player_agent)` 产出的 intent-menu.json
 *      与冻结契约相等 —— 13 条意图名集、禁列 = kill/tnt/fill、每意图 `postcondition.kind` 非空、
 *      `fallback` 非空、预算整数（仅 stop 可为 0）、tp 只在 operator/creative（strict_survival 菜单不含）；
 *      并与生产 `PLAYTEST_INTENTS` 逐条同答（防「菜单与真源分叉」）。
 *   B. 执行器形状（Java 文本）：intent/waitintent/land 步族、INTENT_MENU 字面量与菜单逐字同答、
 *      FORBIDDEN_INTENTS 三禁列、`name.equals("<impl>")` 十条落地面、mine/place/interact **必须**停在
 *      fail-closed 分支（`intent 未实现（v1 白名单外）`）——实现面扩大是门红信号，改契约再放开；
 *      逐意图后置条件 mode（pos/look_yaw/…/stop）与 `intent 预算耗尽`（逐意图预算）都在；
 *      rounds.jsonl 单行拼接（INTENT_LOG 不得用 nl()）与截图新鲜度四件（newestShotMillis 助手 /
 *      shot 步等落盘 / newest ≥ intentStartMillis−1500 判据 / screenshot_timeout 超时判红）也在。
 *      质量批（2026-10-01，F1b/F2/F3/F4/F6）另钉四组：失败原因拆进 `failure` 字段（不再挤 postcondition）、
 *      `firstBadNum` + `param_not_number`（数值参数解析失败判红，不再静默回默认）、
 *      `interpTickBody` fail-closed 兜底（预算/进世界/热重载/completeIntent 抛异常不打穿 tick）、
 *      统一 jsonEsc（\n/\t/\r + 全部拼点过它）与邮箱容错解码（readAllBytes，非 UTF-8 不再断协议）。
 *   B′. spec↔impl kind 覆盖（`checkKindCoverage`）：执行器里每个 `intentPostKind = "…"` 字面量必须 ∈
 *      spec 声明集（`postcondition.kind`，find_and_goto 支持 `a | b | c` 按形态多值），且 spec 声明的每个
 *      kind 在实现里有发射点（未实现意图 mine/place/interact 的 kind 豁免）。此前 spec 只声明
 *      `reached_parsed_tol` 而实现按形态发三种，两道旧对账都看不见这条漂移。
 *   C. 工具矩阵（生产 `playtestIntent` 真调）：禁列 / 不在菜单 / 参数白名单 / 必填 / 未确认 / 合法写入 /
 *      邮箱占用（MAILBOX_BUSY）/ overwrite / strict_survival 禁 tp / 缺菜单 / 菜单不可读 / 候选链 /
 *      授权根外拒绝 / 未授权拒绝，逐码判。
 *   D. 真机 E2E（**opt-in，默认跳过**）：`MC_SKILL_PLAYTEST_INTENT_E2E=1` + `MC_SKILL_PLAYTEST_INTENT_EVIDENCE=<证据目录绝对路径>`
 *      ⇒ 对真机跑出的证据判 invariant：exit-code=0、state.json(intentState/intents≥2/lastIntent)、
 *      rounds.jsonl **每行**须为合法 JSON（逐行 parse；intentLog 条目间插换行会把一行拆成多行）且
 *      末行 ok=true，intentLog 里有「ok:true 带 postcondition/detail」且**有 ok:false 条目**
 *      （fail-closed 链路被演示过）、每条目 postcondition/failure 形状（ok:true ⇒ postcondition 非空且
 *      failure 空；ok:false ⇒ 二者恰一非空）、lastIntent 同形状、ok:true 的截图条目须带 ageMs（新鲜度落证据）、
 *      intent.done.json 已消费、末条意图 = stop、截图 ≥2。
 *      （截图目录默认 <evidenceDir>/screenshots；真机截图在 gameDir 时传 MC_SKILL_PLAYTEST_INTENT_SCREENSHOTS。）
 *      —— 这是「真机只由显式开关触发」的落地：不设该变量时一切按未跑真机处理，不静默通过。
 *
 * 用法：
 *   node scripts/assert-playtest-intent-gate.mjs                       # 离线三族（rc=0 才绿）
 *   MC_SKILL_PLAYTEST_INTENT_E2E=1 MC_SKILL_PLAYTEST_INTENT_EVIDENCE=<abs> node scripts/assert-playtest-intent-gate.mjs
 *   node scripts/assert-playtest-intent-gate.mjs --selftest            # 判据活性自证（投毒必红 + 正对照）
 */
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SELFTEST = process.argv.includes("--selftest");
const SERVER = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = (rel) => pathToFileURL(join(SERVER, "dist", rel)).href;

const { generatePlaytestDriver, PLAYTEST_INTENTS, PLAYTEST_VERIFIED_TIER } = await import(dist("generators/playtest-driver.js"));
const { playtestIntent } = await import(dist("playtest-intent/index.js"));

/** 冻结契约（意图空间定稿 v2，2026-10-01 用户审改；真源见 community_knowledge/authored/ingame-playtest-automation.md §意图空间）。 */
const CONTRACT_INTENTS = [
  "walk_to", "look_at", "find_and_goto", "mine", "place", "interact",
  "open_gui", "inventory", "observe", "screenshot", "wait", "tp", "stop",
];
/** v1 白名单外：命中必须落在 fail-closed 分支（不得静默成功）。实现面扩大 ⇒ 本门红，有意为之。 */
const UNIMPLEMENTED_V1 = ["mine", "place", "interact"];
const IMPLEMENTED_V1 = CONTRACT_INTENTS.filter((n) => !UNIMPLEMENTED_V1.includes(n));
const FORBIDDEN = ["kill", "tnt", "fill"];
/** 允许 fallback 为空的意图（契约 v2 冻结值）：stop = 终态；screenshot = 视觉证据无等价替代。 */
const FALLBACK_MAY_BE_EMPTY = new Set(["screenshot", "stop"]);
/** verdictFor 的分类后置条件 mode（每种意图一条；见 generate 的 Java 模板）。 */
const POST_MODES = ["pos", "look_yaw", "look_pos", "locate", "scan_block", "scan_entity", "scan", "gui", "inv", "shot", "wait", "tp", "stop"];

// ── 族 A：菜单契约 ──────────────────────────────────────────────────────────
export function checkMenuContract(menu, profile) {
  const p = [];
  if (menu?.schema !== "mc-skill/playtest-intent-menu@1") p.push(`菜单 schema 不是 mc-skill/playtest-intent-menu@1：${menu?.schema}`);
  if (menu?.capabilityProfile !== profile) p.push(`菜单 capabilityProfile=${menu?.capabilityProfile} != ${profile}`);
  const names = (menu?.intents ?? []).map((i) => i?.name);
  const want = profile === "strict_survival" ? CONTRACT_INTENTS.filter((n) => n !== "tp") : CONTRACT_INTENTS;
  const setOk = names.length === want.length && want.every((n) => names.includes(n));
  if (!setOk) p.push(`菜单意图名集不等契约（want=${want.join(",")} got=${names.join(",")}）`);
  if (JSON.stringify(menu?.forbidden) !== JSON.stringify(FORBIDDEN)) p.push(`菜单 forbidden != ${FORBIDDEN.join("/")}：${JSON.stringify(menu?.forbidden)}`);
  for (const it of menu?.intents ?? []) {
    if (!it?.postcondition?.kind) p.push(`意图 ${it?.name} 的 postcondition.kind 为空`);
    if (!Array.isArray(it?.fallback) || (it.fallback.length === 0 && !FALLBACK_MAY_BE_EMPTY.has(it?.name))) p.push(`意图 ${it?.name} 的 fallback 为空（失败无替代意图）`);
    const b = it?.budgetTicks;
    if (!Number.isInteger(b) || b < 0) p.push(`意图 ${it?.name} 的 budgetTicks 非非负整数：${b}`);
    if (it?.name !== "stop" && !(Number.isInteger(b) && b > 0)) p.push(`意图 ${it?.name} 的 budgetTicks 必须 > 0：${b}`);
    const declared = new Set((it?.params ?? []).map((x) => x?.name));
    if (it?.name === "walk_to" && !(declared.has("x") && declared.has("z"))) p.push("walk_to 的 params 缺 x/z");
  }
  if (profile === "strict_survival" && names.includes("tp")) p.push("strict_survival 菜单不得列出 tp");
  if (menu?.perIntentBudgetTicks == null) p.push("菜单缺 perIntentBudgetTicks 表");
  return p;
}

/** 族 A′：菜单 ↔ 生产 PLAYTEST_INTENTS 逐条同答。 */
export function checkMenuDrift(menu, profile) {
  const p = [];
  const specs = new Map(PLAYTEST_INTENTS.map((i) => [i.name, i]));
  for (const it of menu?.intents ?? []) {
    const spec = specs.get(it.name);
    if (!spec) { p.push(`菜单意图 ${it.name} 不在生产 PLAYTEST_INTENTS 里`); continue; }
    if (spec.budgetTicks !== it.budgetTicks) p.push(`意图 ${it.name} 预算漂移：菜单 ${it.budgetTicks} != 真源 ${spec.budgetTicks}`);
    if (spec.postcondition?.kind !== it.postcondition?.kind) p.push(`意图 ${it.name} 后置条件漂移：${it.postcondition?.kind} != ${spec.postcondition?.kind}`);
    const m = menu?.perIntentBudgetTicks?.[it.name];
    if (m !== spec.budgetTicks) p.push(`perIntentBudgetTicks[${it.name}]=${m} != 真源 ${spec.budgetTicks}`);
  }
  if (profile === "strict_survival") {
    const tp = specs.get("tp");
    if (!Array.isArray(tp?.profiles) || !tp.profiles.every((x) => x === "operator" || x === "creative")) p.push("真源里 tp 的 profiles 必须 ⊆ operator/creative");
  }
  return p;
}

/** 族 B′：spec 声明 kind ↔ 执行器实际发射 kind 的覆盖对账（2026-10-01 质量批 F1）。
 *  此前 spec（PLAYTEST_INTENTS→菜单）给 find_and_goto 只声明 `reached_parsed_tol`，而实现按形态发
 *  `reached_parsed_tol` / `block_found_and_reached` / `entity_found_and_reached` —— 旧两道对账（菜单契约、
 *  菜单↔真源）都看不见「实现分支 vs 声明」这条缝。spec 的 kind 支持 `a | b | c` 多值（按形态三选一）。 */
export function checkKindCoverage(java, intents, unimplementedNames) {
  const p = [];
  const lit = [...String(java).matchAll(/intentPostKind = "([^"]+)"/g)].map((m) => m[1]);
  if (lit.length < 8) p.push(`执行器 intentPostKind 字面量过少：${lit.length}（预期每种已实现意图一条）`);
  const declared = new Set();
  for (const it of intents ?? []) {
    for (const k of String(it?.postcondition?.kind ?? "").split("|").map((x) => x.trim()).filter(Boolean)) declared.add(k);
  }
  const unimpl = new Set();
  for (const it of intents ?? []) if ((unimplementedNames ?? []).includes(it?.name)) unimpl.add(it?.postcondition?.kind);
  const implSet = new Set(lit);
  for (const k of implSet) if (!declared.has(k)) p.push(`实现发射的 kind "${k}" 不在 spec 声明集里（spec↔impl 漂移）`);
  for (const k of declared) if (!implSet.has(k) && !unimpl.has(k)) p.push(`spec 声明的 kind "${k}" 在实现里没有发射点（非未实现意图的 kind ⇒ 漂移）`);
  return p;
}

// ── 族 B：执行器形状（Java 文本） ───────────────────────────────────────────
export function checkDriverShape(java, menu) {
  const p = [];
  const has = (s) => java.includes(s);
  for (const s of ['case "intent":', 'case "waitintent":', 'case "land":', "static final String[] INTENT_MENU = {", `static final String[] FORBIDDEN_INTENTS = { "kill", "tnt", "fill" };`]) {
    if (!has(s)) p.push(`执行器缺锚点：${s}`);
  }
  // INTENT_MENU 字面量 ↔ 菜单同答（name|budget|profiles）
  const lit = java.match(/INTENT_MENU = \{([\s\S]*?)\};/);
  if (!lit) p.push("执行器缺 INTENT_MENU 字面量（菜单校验失去真源）");
  else {
    const entries = [...lit[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    const parsed = entries.map((e) => { const [name, budget, profs] = e.split("|"); return { name, budget: Number(budget), profs }; });
    const wantNames = (menu?.intents ?? []).map((i) => i.name);
    const gotNames = parsed.map((x) => x.name);
    if (gotNames.length !== wantNames.length || !wantNames.every((n) => gotNames.includes(n))) p.push(`INTENT_MENU 名集与菜单不等：${gotNames.join(",")}`);
    for (const e of parsed) {
      const mb = menu?.perIntentBudgetTicks?.[e.name];
      if (mb !== e.budget) p.push(`INTENT_MENU 预算漂移 ${e.name}：${e.budget} != 菜单 ${mb}`);
    }
    const tp = parsed.find((x) => x.name === "tp");
    if (tp && !tp.profs.includes("operator")) p.push(`INTENT_MENU 的 tp profiles 应含 operator：${tp.profs}`);
  }
  for (const n of IMPLEMENTED_V1) if (!has(`name.equals("${n}")`)) p.push(`执行器缺已实现意图分支：name.equals("${n}")`);
  for (const n of UNIMPLEMENTED_V1) if (has(`name.equals("${n}")`)) p.push(`v1 未实现意图 ${n} 却出现成功分支 —— 实现面变了，请更新契约后再放开`);
  if (!has("intent 未实现（v1 白名单外）")) p.push("执行器缺 fail-closed 标记：intent 未实现（v1 白名单外）");
  // 邮箱形态失败语义（交接验收 §4.3-4「选错→判红→换意图→成功」要求同一会话可续）：
  // 后置条件失败 = 记入 intentLog + 继续守候；脚本形态仍判红停轮（两条都必须在，缺一即语义漂了）。
  if (!has("intent FAIL 已记入 intentLog")) p.push("执行器缺邮箱失败续守候标记（intent FAIL 已记入 intentLog）——失败会杀掉会话，换意图链走不通");
  if (!has('finish(false, "intent 后置条件失败 ')) p.push("执行器缺脚本形态判红停轮（intent 后置条件失败 … finish(false)）");
  // 观测契约（口径单源「每轮喂给 LLM 的观测契约」）：会话起步与每条意图跑完都要刷新 state.json，
  // 否则 LLM 拿不到 player 坐标 / lastIntent / nextSteps 的底料。
  if (!/startRound\(\);\s*writeState\(client, player\);/.test(java)) p.push("会话起步未刷新 state.json（startRound 后缺 writeState——LLM 写第一条意图前无法观测）");
  if (!has("jsonEsc(INTENT_MAILBOX)")) p.push("state.json 的 mailbox 路径未做 JSON 转义（Windows 反斜杠 = 非法转义 ⇒ 整个 state.json 读成 unreadable）");
  if (!has("!stateSeeded && player != null")) p.push("缺进世界后的观测面补种（起步刷新可能早于世界载入，坐标全 0）");
  // 步级失败的意图级出口：goto/land/assert/gui 等在子计划里失败、参数/形态不满足、单意图预算耗尽
  // 必须走 failIntent（邮箱→记数据续守候；脚本→判红停轮），否则「换意图」链在第一次步级失败就被杀。
  if (!has("private static void failIntent(")) p.push("执行器缺 failIntent（步级失败的意图级出口）");
  const routed = (java.match(/failIntent\(client, player, "/g) ?? []).length;
  if (routed < 10) p.push(`意图步级失败走 failIntent 的位点过少：${routed} < 10`);
  if (!has('failIntent(client, player, "goto_target_missing"')) p.push("goto nearest 未命中未走 failIntent（换意图链走不通）");
  // rounds.jsonl 单行契约（实测 2026-10-01：intentLog 条目用 "," + nl() 拼接 ⇒ 一整「行」JSONL 被拆成多行，
  // 判读器按最后一行解析直接挂；证据完好却读不出来）。两处 INTENT_LOG.append 必须是纯 "," 分隔、旧形态必须绝迹。
  {
    const lineJoin = (s) => java.split(s).length - 1;
    const jsonlOk = lineJoin('INTENT_LOG.append(INTENT_LOG.length() > 0 ? "," : "")');
    const jsonlBroken = lineJoin('INTENT_LOG.append(INTENT_LOG.length() > 0 ? "," + nl() : "")');
    if (jsonlOk < 2 || jsonlBroken > 0) {
      p.push(`rounds.jsonl 单行契约破坏：单行拼接 ${jsonlOk}/2 处、带 nl() 的旧形态 ${jsonlBroken} 处（intentLog 条目间换行 ⇒ 一行 JSONL 被拆成多行）`);
    }
  }
  // 截图新鲜度（实测 2026-10-01：目录里 3 小时前的旧图被当本次证据 PASS）。四件：助手 / 步内等落盘 / 判据 / 超时。
  if (!has("private static long newestShotMillis(")) p.push("执行器缺 newestShotMillis（截图新鲜度无从判定，旧图可充新证据）");
  if (!has("newestShotMillis(client) >= shotRequestMillis")) p.push("shot 步未等待新图落盘（截图异步落盘 ⇒ 后置条件会读到上一条旧图）");
  if (!has("newest >= intentStartMillis - 1500")) p.push("截图后置条件缺新鲜度判据（newest >= intentStartMillis - 1500）——「目录里有 png」会拿旧图充新证据");
  if (!has('"screenshot_timeout"')) p.push("shot 步缺落盘超时判红（screenshot_timeout）");
  {
    const ws = java.indexOf("private static void writeState(");
    const wsEnd = ws >= 0 ? java.indexOf("private static void", ws + 10) : -1;
    const body = ws >= 0 && wsEnd > ws ? java.slice(ws, wsEnd) : "";
    if (!body.includes("px = player.getX()")) p.push("writeState 未快照玩家坐标（起步刷新早于世界载入 ⇒ state.json 的 x/y/z 永远 0）");
  }
  const ci = java.indexOf("private static void completeIntent(");
  const ciFail = ci >= 0 ? java.indexOf("if (!v.ok)", ci) : -1;
  if (ci < 0 || ciFail < 0 || !java.slice(ci, ciFail).includes("writeState(client, player);")) p.push("completeIntent 未在每条意图跑完后刷新 state.json（成功/失败都要）");
  for (const m of POST_MODES) if (!has(`intentPostMode.equals("${m}")`)) p.push(`verdictFor 缺后置条件 mode：${m}`);
  for (const s of ["private static void startIntent(", "private static void completeIntent(", "private static Verdict verdictFor(", "private static String[] expandIntent(", "intent 预算耗尽", '\\"postcondition\\": \\"']) {
    if (!has(s)) p.push(`执行器缺锚点：${s}`);
  }
  if (!has("INTENT_MAILBOX") || !has("intent.done.json")) p.push("执行器缺邮箱锚点（INTENT_MAILBOX / intent.done.json）");
  const keys = java.match(/INTENT_PARAM_KEYS = \{([\s\S]*?)\};/);
  if (!keys) p.push("执行器缺 INTENT_PARAM_KEYS 白名单");
  else {
    const km = new Set([...keys[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]));
    // 菜单驱动对账：**菜单里任何意图声明的参数名**都必须在白名单里，否则 driver 会把该参数静默丢掉
    // （实测 2026-10-01：observe 的 blocks 缺键 ⇒ 被滤成空 opts ⇒ 误判「空扫无判据」）。
    const menuParams = new Set((menu?.intents ?? []).flatMap((i) => (i.params ?? []).map((x) => x.name)));
    for (const n of menuParams) {
      if (!km.has(n)) p.push(`INTENT_PARAM_KEYS 缺菜单声明的参数键：${n}（driver 会把该参数静默丢掉）`);
    }
    for (const floor of ["x", "z", "tol"]) if (!km.has(floor)) p.push(`INTENT_PARAM_KEYS 缺键：${floor}`);
  }
  // 质量批（2026-10-01 F1b/F2/F3/F4/F6）——每条对应一类真实缺陷，摘掉即红：
  //   F1b 失败拆字段：失败原因进 `failure`，不再挤 `postcondition`（旧形态：goto_timeout 也占 postcondition）。
  if (!has('\\"postcondition\\": \\"\\", \\"failure\\": \\"')) p.push("failIntent 未把失败原因拆进 failure（失败原因仍挤 postcondition）");
  if (!has("lastIntentFailure")) p.push("state.json lastIntent 缺 failure 字段（拆字段不完整）");
  //   F2 数值参数判红：键存在但解析失败 ⇒ param_not_number，而不是静默回默认（walk_to x=abc 曾假绿）。
  if (!has("private static String firstBadNum(")) p.push("执行器缺 firstBadNum（数值参数解析失败会静默回默认 ⇒ 假绿）");
  if (!has('"param_not_number"')) p.push("执行器缺 param_not_number（数值参数格式判红未接线）");
  //   F3 tick 兜底：预算/进世界/热重载/completeIntent 在步骤级 try 之外，抛异常会打穿 END_CLIENT_TICK。
  if (!has("interpTickBody(client)")) p.push("onInterpTick 未包 fail-closed 兜底（预算/进世界/热重载抛异常会打穿 tick）");
  if (!has("onInterpTick 未捕获异常")) p.push("缺 tick 兜底判红标记（onInterpTick 未捕获异常）");
  if (!has('"脚本步骤"')) p.push("failIntent 脚本形态文案未回退（activeIntent 为空时会写成 \"intent  失败\"）");
  //   F4 统一转义：jsonEsc 必须转控制字符，且成功/失败条目与 rounds 外层 detail 都要过它。
  if (!/\.replace\("\\n", "\\\\n"\)/.test(java)) p.push("jsonEsc 未转义换行（\\n 会把 JSONL 一行劈成两半）");
  if (!has("append(jsonEsc(activeIntent))") || !has("append(jsonEsc(name))")) p.push("INTENT_LOG 条目未过统一 jsonEsc");
  if (!has('\\"detail\\":\\"" + jsonEsc(detail)')) p.push("rounds.jsonl 外层 detail 未过统一 jsonEsc");
  //   F6 邮箱容错读：readString 严格解码遇非 UTF-8 抛 MalformedInputException ⇒ 整轮判红、协议断。
  if (!has("new String(Files.readAllBytes(Path.of(INTENT_MAILBOX)), StandardCharsets.UTF_8)")) p.push("邮箱未用容错解码（严格 UTF-8 遇非 UTF-8 会断协议）");
  if (!has("intent.json 须为 UTF-8")) p.push("邮箱读失败文案未点名 UTF-8 要求");
  return p;
}

// ── 族 C：工具矩阵 ─────────────────────────────────────────────────────────
/** 失败回灌判据（纯函数，便于 selftest 投毒）：read 结果在 lastIntent.ok=false 时应给出 nextSteps。 */
export function checkNextSteps(readRes, wantFallback) {
  const p = [];
  const got = readRes?.nextSteps;
  if (!Array.isArray(got) || got.length === 0) p.push("read 失败回灌: nextSteps 缺失（lastIntent.ok=false 必须给出可换的下一个意图）");
  else if (wantFallback && JSON.stringify(got) !== JSON.stringify(wantFallback)) p.push(`read 失败回灌: nextSteps=${JSON.stringify(got)} != 菜单 fallback=${JSON.stringify(wantFallback)}`);
  return p;
}
/** 生成 driver+菜单并落盘到 evidenceDir；返回 { files, menu, java, problems }。 */
export function genArtifacts(profile, evidenceDir, rootProblems) {
  const r = generatePlaytestDriver({
    platform: "fabric", version: "1.21.11", modId: "examplemod",
    driverMode: "in_jvm_player_agent", capabilityProfile: profile,
    evidenceDir, budgetTicks: 6000,
  });
  const files = r.files ?? {};
  if (!files["playtest/intent-menu.json"]) rootProblems.push("生成器未产出 playtest/intent-menu.json");
  if (!files["playtest/PlaytestQaDriver.java"]) rootProblems.push("生成器未产出 playtest/PlaytestQaDriver.java");
  const menu = files["playtest/intent-menu.json"] ? JSON.parse(files["playtest/intent-menu.json"]) : null;
  const java = files["playtest/PlaytestQaDriver.java"] ?? "";
  return { files, menu, java };
}

/** dirs: { op, strict, noMenu, badMenu, nested, nestedMenuDir } —— 均由调用方先铺好菜单/邮箱。 */
export function runMatrix(impl, dirs) {
  const p = [];
  const call = (dir, q) => impl({ action: "write", evidenceDir: dir, ...q });
  const check = (label, res, want) => {
    if (want.code && res.code !== want.code) p.push(`${label}: 期望 ${want.code}，实际 ok=${res.ok} code=${res.code ?? "(none)"}`);
    if (want.ok && res.ok !== true) p.push(`${label}: 期望 ok:true，实际 code=${res.code ?? "(none)"} msg=${res.message ?? ""}`);
    if (want.writtenIntent && res.written?.intent !== want.writtenIntent) p.push(`${label}: written.intent=${res.written?.intent} != ${want.writtenIntent}`);
  };
  check("kill 在禁列", call(dirs.op, { intent: "kill", params: { x: 1, z: 1 }, confirmed: true }), { code: "INTENT_FORBIDDEN" });
  check("fly_away 不在菜单", call(dirs.op, { intent: "fly_away", confirmed: true }), { code: "INTENT_NOT_IN_MENU" });
  check("参数 boom 未声明", call(dirs.op, { intent: "walk_to", params: { x: 1, z: 2, boom: 1 }, confirmed: true }), { code: "PARAM_NOT_DECLARED" });
  check("缺必填 z", call(dirs.op, { intent: "walk_to", params: { x: 1 }, confirmed: true }), { code: "MISSING_REQUIRED_PARAM" });
  check("未确认", call(dirs.op, { intent: "walk_to", params: { x: 1, z: 2 } }), { code: "CONFIRMATION_REQUIRED" });
  check("合法 walk_to 写入", call(dirs.op, { intent: "walk_to", params: { x: 10, z: -20, tol: 3 }, confirmed: true }), { ok: true, writtenIntent: "walk_to" });
  check("邮箱占用（二次写不覆盖）", call(dirs.op, { intent: "look_at", params: { yaw: 90 }, confirmed: true }), { code: "MAILBOX_BUSY" });
  check("overwrite 覆盖", call(dirs.op, { intent: "mine", params: { blockId: "minecraft:oak_log" }, confirmed: true, overwrite: true }), { ok: true, writtenIntent: "mine" });
  check("strict_survival 禁 tp", call(dirs.strict, { intent: "tp", params: { x: 1, z: 1 }, confirmed: true }), { code: "INTENT_NOT_IN_MENU" });
  check("strict_survival 允许 walk_to", call(dirs.strict, { intent: "walk_to", params: { x: 1, z: 2 }, confirmed: true }), { ok: true, writtenIntent: "walk_to" });
  check("缺菜单 fail-closed", call(dirs.noMenu, { intent: "walk_to", params: { x: 1, z: 2 }, confirmed: true }), { code: "MENU_NOT_FOUND" });
  check("菜单不可读", call(dirs.badMenu, { intent: "walk_to", params: { x: 1, z: 2 }, confirmed: true }), { code: "MENU_UNREADABLE" });
  // read 面 + 菜单候选链（菜单放在 <dir>/../playtest/intent-menu.json）
  const rd = impl({ action: "read", evidenceDir: dirs.nested });
  if (rd.ok !== true || rd.menu?.state !== "present") p.push(`read 候选链: 期望 menu present，实际 ok=${rd.ok} state=${rd.menu?.state}`);
  else if (rd.menu.intents?.length !== CONTRACT_INTENTS.length) p.push(`read 候选链: 菜单意图数 ${rd.menu.intents?.length} != ${CONTRACT_INTENTS.length}`);
  const r0 = impl({ action: "read", evidenceDir: dirs.op });
  if (r0.ok !== true || r0.menu?.state !== "present" || r0.state?.state !== "absent") p.push(`read 面: 期望 ok+menu present+state absent，实际 ${r0.ok}/${r0.menu?.state}/${r0.state?.state}`);
  // 失败回灌（nextSteps）：obsFail 里放一份 lastIntent.ok=false 的 state.json；obsPass 放 ok=true 的。
  const rf = impl({ action: "read", evidenceDir: dirs.obsFail });
  const wantFb = (dirs.obsFailFallback ?? []);
  if (rf.ok !== true) p.push(`read 失败回灌: obsFail 读取失败 ok=${rf.ok}`);
  else p.push(...checkNextSteps(rf, wantFb));
  const rp = impl({ action: "read", evidenceDir: dirs.obsPass });
  if (rp.nextSteps !== undefined) p.push(`read 成功态不应带 nextSteps：${JSON.stringify(rp.nextSteps)}`);
  // 授权根外
  const outDir = dirs.outside;
  const ro = impl({ action: "read", evidenceDir: outDir });
  if (ro.code !== "PATH_OUTSIDE_ALLOWLIST") p.push(`授权根外: 期望 PATH_OUTSIDE_ALLOWLIST，实际 code=${ro.code ?? "(none)"}`);
  return p;
}

// ── 族 D：真机 E2E 证据 invariant ──────────────────────────────────────────
export function checkEvidence(evDir, screenshotsDir) {
  const p = [];
  const exitPath = join(evDir, "exit-code.txt");
  if (!existsSync(exitPath)) p.push("缺 exit-code.txt");
  else if (readFileSync(exitPath, "utf8").trim() !== "0") p.push("exit-code.txt 不是 0（该轮判红）");

  const statePath = join(evDir, "state.json");
  let st = null;
  if (!existsSync(statePath)) p.push("缺 state.json");
  else {
    try { st = JSON.parse(readFileSync(statePath, "utf8")); } catch (e) { p.push(`state.json 解析失败：${String(e.message).slice(0, 80)}`); }
  }
  if (st) {
    if (!st.intentState) p.push("state.json 缺 intentState");
    if (!Array.isArray(st.intents) || st.intents.length < 2) p.push(`state.json intents 数组 < 2（实际 ${Array.isArray(st.intents) ? st.intents.length : "非数组"}）`);
    if (!st.lastIntent?.name) p.push("state.json lastIntent 无 name");
    if (st.lastIntent?.name) {
      // 拆字段形状（2026-10-01 F1b）：ok:true ⇒ postcondition 非空且 failure 空；ok:false ⇒ 二者恰一非空。
      const post = String(st.lastIntent.postcondition ?? "");
      const flr = String(st.lastIntent.failure ?? "");
      const ok = st.lastIntent.ok;
      const good = ok === true ? post !== "" && flr === "" : post !== "" !== (flr !== "");
      if (!good) p.push(`state.json lastIntent postcondition/failure 形状不对（name=${st.lastIntent.name} ok=${ok} post=${JSON.stringify(post)} failure=${JSON.stringify(flr)}）`);
    }
  }

  const roundsPath = join(evDir, "rounds.jsonl");
  let log = [];
  if (!existsSync(roundsPath)) p.push("缺 rounds.jsonl");
  else {
    const lines = readFileSync(roundsPath, "utf8").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    let last = null;
    try { last = JSON.parse(lines[lines.length - 1] ?? ""); } catch (e) { p.push(`rounds.jsonl 最后一行解析失败：${String(e.message).slice(0, 80)}`); }
    const brokenIdx = lines.findIndex((l) => { try { JSON.parse(l); return false; } catch { return true; } });
    if (brokenIdx >= 0) p.push(`rounds.jsonl 第 ${brokenIdx + 1} 行不是合法 JSON（JSONL 每行须为完整一行；intentLog 条目间插换行会把一行拆成多行）`);
    if (last) {
      if (last.ok !== true) p.push("rounds.jsonl 最后一行 ok!==true");
      log = Array.isArray(last.intentLog) ? last.intentLog : [];
      if (log.length < 2) p.push(`rounds.jsonl intentLog < 2（实际 ${log.length}）`);
      if (log.some((e) => !e?.intent)) p.push("intentLog 有条目缺 intent 名");
      const pass = log.filter((e) => e.ok === true && e.postcondition && e.detail);
      if (pass.length === 0) p.push("intentLog 无 ok:true 且带 postcondition/detail 的条目（真执行未留类型化证据）");
      const fail = log.filter((e) => e.ok === false && e.detail);
      if (fail.length === 0) p.push("intentLog 无 ok:false 条目（fail-closed 链路未被演示）");
      // 拆字段形状（2026-10-01 F1b）：ok:true ⇒ postcondition 非空且 failure 空；ok:false ⇒ 二者恰一非空。
      const badShape = log.filter((e) => {
        const post = String(e.postcondition ?? "");
        const flr = String(e.failure ?? "");
        return e.ok === true ? !(post !== "" && flr === "") : !(post !== "" !== (flr !== ""));
      });
      if (badShape.length) p.push(`intentLog 条目 postcondition/failure 形状不对（ok:true ⇒ postcondition 非空且 failure 空；ok:false ⇒ 二者恰一非空）：${badShape.map((e) => e.intent).join(",")}`);
      const aged = log.filter((e) => e.ok === true && /ageMs=-?\d+/.test(String(e.detail ?? "")));
      if (aged.length === 0) p.push("intentLog 无带 ageMs 的截图证据条目（新鲜度未落证据——「目录里有 png」的旧图缺陷类别）");
      if (log.length && log[log.length - 1].intent !== "stop") p.push("intentLog 末尾不是 stop（会话未按协议收尾）");
    }
  }

  if (!existsSync(join(evDir, "intent.done.json"))) p.push("缺 intent.done.json（邮箱未被消费）");

  if (!screenshotsDir || !existsSync(screenshotsDir)) p.push(`截图目录不存在：${screenshotsDir ?? "(未给)"}`);
  else {
    const shots = readdirSync(screenshotsDir).filter((f) => f.toLowerCase().endsWith(".png"));
    if (shots.length < 2) p.push(`截图 < 2（screenshotsDir=${screenshotsDir} 实际 ${shots.length}）`);
  }
  return p;
}

// ── 真实运行 ───────────────────────────────────────────────────────────────
async function main() {
  const root = mkdtempSync(join(tmpdir(), "mc-skill-intent-gate-"));
  const prev = { allow: process.env.MC_SKILL_PLAYTEST_ALLOW, root: process.env.MC_SKILL_PLAYTEST_ROOT };
  process.env.MC_SKILL_PLAYTEST_ALLOW = "1";
  process.env.MC_SKILL_PLAYTEST_ROOT = root;
  const problems = [];
  try {
    const proj = join(root, "proj");
    const dirs = {
      op: join(proj, "playtest-evidence", "run1"),
      strict: join(proj, "playtest-evidence", "run2"),
      noMenu: join(proj, "playtest-evidence", "no-menu"),
      badMenu: join(proj, "playtest-evidence", "bad-menu"),
      nested: join(root, "proj2", "playtest-evidence", "run"),
      nestedMenuDir: join(root, "proj2", "playtest-evidence", "playtest"),
      obsFail: join(root, "proj3", "playtest-evidence", "fail"),
      obsPass: join(root, "proj3", "playtest-evidence", "pass"),
      outside: join(tmpdir(), "mc-skill-intent-outside-" + process.pid),
    };
    for (const d of [dirs.op, dirs.strict, dirs.noMenu, dirs.badMenu, dirs.nested, dirs.nestedMenuDir, dirs.obsFail, dirs.obsPass]) mkdirSync(d, { recursive: true });

    // 族 A：菜单契约（operator + strict_survival 两份）
    const opArt = genArtifacts("operator", dirs.op, problems);
    const strictArt = genArtifacts("strict_survival", dirs.strict, problems);
    writeFileSync(join(dirs.op, "intent-menu.json"), JSON.stringify(opArt.menu, null, 2) + "\n");
    writeFileSync(join(dirs.strict, "intent-menu.json"), JSON.stringify(strictArt.menu, null, 2) + "\n");
    writeFileSync(join(dirs.nestedMenuDir, "intent-menu.json"), JSON.stringify(opArt.menu, null, 2) + "\n");
    writeFileSync(join(dirs.badMenu, "intent-menu.json"), "{ not json");
    // 失败回灌夹具：菜单 + 一份 lastIntent.ok=false / 一份 ok=true 的 state.json
    const walkToFb = opArt.menu?.intents?.find((i) => i.name === "walk_to")?.fallback ?? [];
    dirs.obsFailFallback = walkToFb.filter((x) => typeof x === "string" && x.trim() !== "");
    writeFileSync(join(dirs.obsFail, "intent-menu.json"), JSON.stringify(opArt.menu, null, 2) + "\n");
    writeFileSync(join(dirs.obsFail, "state.json"), JSON.stringify({ intentState: {}, intents: [], lastIntent: { name: "walk_to", ok: false, postcondition: "distance_le_tol_and_moved_ge_min", detail: "dist=99 tol=3" } }) + "\n");
    writeFileSync(join(dirs.obsPass, "intent-menu.json"), JSON.stringify(opArt.menu, null, 2) + "\n");
    writeFileSync(join(dirs.obsPass, "state.json"), JSON.stringify({ intentState: {}, intents: [], lastIntent: { name: "walk_to", ok: true, postcondition: "distance_le_tol_and_moved_ge_min", detail: "dist=1 tol=3" } }) + "\n");
    problems.push(...checkMenuContract(opArt.menu, "operator"));
    problems.push(...checkMenuContract(strictArt.menu, "strict_survival"));
    problems.push(...checkMenuDrift(opArt.menu, "operator"));
    if ((opArt.menu?.intents ?? []).length !== CONTRACT_INTENTS.length) problems.push(`operator 菜单意图数 ${opArt.menu?.intents?.length} != 契约 ${CONTRACT_INTENTS.length}`);
    if ((strictArt.menu?.intents ?? []).some((i) => i.name === "tp")) problems.push("strict_survival 菜单出现 tp");

    // 族 B：执行器形状
    problems.push(...checkDriverShape(opArt.java, opArt.menu));
    // 族 B′：spec 声明 kind ↔ 实现发射 kind（F1 覆盖对账）
    problems.push(...checkKindCoverage(opArt.java, PLAYTEST_INTENTS, UNIMPLEMENTED_V1));

    // 已验证档清单：至少含 fabric/quilt 1.21.11（in_jvm 真执行器的主档），且非空
    const tierKeys = PLAYTEST_VERIFIED_TIER.map((t) => `${t.platform}/${t.version}`);
    for (const must of ["fabric/1.21.11", "quilt/1.21.11"]) if (!tierKeys.includes(must)) problems.push(`PLAYTEST_VERIFIED_TIER 缺 ${must}`);
    if (PLAYTEST_VERIFIED_TIER.length < 4) problems.push(`PLAYTEST_VERIFIED_TIER 过小：${tierKeys.join(",")}`);

    // 非已验证档：只出契约 + 结构壳
    // 探针档必须落在「仍未翻绿」的组合上；每翻绿一档就把本靶挪到仍为结构壳的档
    // （2026-10-03：fabric/1.19.4 已入 tier ⇒ 靶迁到 fabric/1.14.4；同日晚些时候 fabric/1.14.4 **也入了 tier**
    //   ⇒ 靶再迁到 quilt/1.16.5 —— 该组合**没有规则树**（quilt 树 1.18.2 起）、也没有 tier，是**耐久靶**）。
    const shell = generatePlaytestDriver({
      platform: "quilt", version: "1.16.5", modId: "examplemod",
      driverMode: "in_jvm_player_agent", capabilityProfile: "strict_survival",
      evidenceDir: join(root, "shell", "evidence"),
    });
    const shellJava = shell.files?.["playtest/PlaytestQaDriver.java"] ?? "";
    if (!shell.files?.["playtest/intent-menu.json"]) problems.push("非已验证档缺 intent-menu.json 契约文件");
    if (!shellJava.includes("TODO(未核实)")) problems.push("非已验证档的执行器不是结构壳（缺 TODO(未核实)）");
    if (shellJava.includes('case "waitintent"')) problems.push("非已验证档不应带真执行器（waitintent 步族）");

    // 族 C：工具矩阵（先把邮箱清干净）
    for (const d of [dirs.op, dirs.strict]) for (const f of ["intent.json", "intent.done.json"]) if (existsSync(join(d, f))) rmSync(join(d, f));
    problems.push(...runMatrix(playtestIntent, dirs));

    // 未授权拒绝（临时摘掉 ALLOW，再还原）
    delete process.env.MC_SKILL_PLAYTEST_ALLOW;
    const dis = playtestIntent({ action: "read", evidenceDir: dirs.op });
    if (dis.code !== "PLAYTEST_DISABLED") problems.push(`未授权: 期望 PLAYTEST_DISABLED，实际 ${dis.code ?? "(none)"}`);
    process.env.MC_SKILL_PLAYTEST_ALLOW = "1";

    // 族 D：opt-in 真机 E2E
    if (process.env.MC_SKILL_PLAYTEST_INTENT_E2E === "1") {
      const evDir = (process.env.MC_SKILL_PLAYTEST_INTENT_EVIDENCE ?? "").trim();
      if (!evDir) problems.push("E2E 开启但未给 MC_SKILL_PLAYTEST_INTENT_EVIDENCE（证据目录绝对路径）");
      else {
        const shots = (process.env.MC_SKILL_PLAYTEST_INTENT_SCREENSHOTS ?? "").trim() || join(evDir, "screenshots");
        const evProblems = checkEvidence(evDir, shots);
        for (const e of evProblems) problems.push(`E2E: ${e}`);
        if (!evProblems.length) console.log(`  info: E2E 证据全通过（${evDir}）`);
      }
    } else {
      console.log("  info: opt-in 真机 E2E 未开（MC_SKILL_PLAYTEST_INTENT_E2E=1 + MC_SKILL_PLAYTEST_INTENT_EVIDENCE=<abs>）⇒ 族 D 跳过，其余三族已跑");
    }

    if (problems.length) {
      console.error(`assert-playtest-intent-gate: ${problems.length} 项不符`);
      for (const x of problems) console.error(`  ${x}`);
      process.exitCode = 1;
    } else {
      console.log(
        `assert-playtest-intent-gate: ok（菜单 ${CONTRACT_INTENTS.length} 意图 / 禁列 ${FORBIDDEN.join("+")} / 执行器 ${opArt.java.length} 字符 / 矩阵 14 例 / 已验证档 ${tierKeys.join(" ")}）`,
      );
    }
  } finally {
    if (prev.allow === undefined) delete process.env.MC_SKILL_PLAYTEST_ALLOW; else process.env.MC_SKILL_PLAYTEST_ALLOW = prev.allow;
    if (prev.root === undefined) delete process.env.MC_SKILL_PLAYTEST_ROOT; else process.env.MC_SKILL_PLAYTEST_ROOT = prev.root;
    rmSync(root, { recursive: true, force: true });
  }
}

// ── selftest：判据活性自证（投毒必红 + 正对照必绿） ────────────────────────
function runSelftest() {
  const fails = [];
  const R = (name, got, needle, wantRed) => {
    const hit = got.some((x) => String(x).includes(needle));
    if (wantRed && !hit) fails.push(`${name}: 期望红（含「${needle}」），实际 ${JSON.stringify(got.slice(0, 3))}`);
    if (!wantRed && got.length !== 0) fails.push(`${name}: 期望绿，实际 ${JSON.stringify(got.slice(0, 3))}`);
  };
  let poisons = 0;
  let controls = 0;

  // 1) 菜单契约：正对照 + 投毒
  {
    const good = JSON.parse(generatePlaytestDriver({ platform: "fabric", version: "1.21.11", driverMode: "in_jvm_player_agent", capabilityProfile: "operator" }).files["playtest/intent-menu.json"]);
    R("菜单正对照", checkMenuContract(good, "operator"), "", false); controls++;
    const noForbidden = structuredClone(good); noForbidden.forbidden = [];
    R("菜单禁列被掏空", checkMenuContract(noForbidden, "operator"), "forbidden", true); poisons++;
    const tpStrict = JSON.parse(generatePlaytestDriver({ platform: "fabric", version: "1.21.11", driverMode: "in_jvm_player_agent", capabilityProfile: "strict_survival" }).files["playtest/intent-menu.json"]);
    tpStrict.intents.push(structuredClone(good.intents.find((i) => i.name === "tp")));
    R("strict 菜单混入 tp", checkMenuContract(tpStrict, "strict_survival"), "tp", true); poisons++;
    const badBudget = structuredClone(good); badBudget.intents.find((i) => i.name === "walk_to").budgetTicks = -1;
    R("预算负数", checkMenuContract(badBudget, "operator"), "budgetTicks", true); poisons++;
    const drift = structuredClone(good); drift.perIntentBudgetTicks.walk_to = 999;
    R("菜单↔真源预算漂移", checkMenuDrift(drift, "operator"), "perIntentBudgetTicks", true); poisons++;
  }

  // 1b) 失败回灌判据（nextSteps）：正对照 + 投毒
  {
    R("nextSteps 正对照", checkNextSteps({ nextSteps: ["a", "b"] }, ["a", "b"]), "", false); controls++;
    R("nextSteps 缺失", checkNextSteps({}, ["a"]), "nextSteps", true); poisons++;
    R("nextSteps 与 fallback 不符", checkNextSteps({ nextSteps: ["x"] }, ["a"]), "fallback", true); poisons++;
  }

  // 2) 执行器形状：正对照 + 投毒
  {
    const r = generatePlaytestDriver({ platform: "fabric", version: "1.21.11", driverMode: "in_jvm_player_agent", capabilityProfile: "operator" });
    const java = r.files["playtest/PlaytestQaDriver.java"];
    const menu = JSON.parse(r.files["playtest/intent-menu.json"]);
    R("执行器正对照", checkDriverShape(java, menu), "", false); controls++;
    R("摘掉 FORBIDDEN_INTENTS", checkDriverShape(java.replace('static final String[] FORBIDDEN_INTENTS = { "kill", "tnt", "fill" };', ""), menu), "FORBIDDEN", true); poisons++;
    R("摘掉未实现 fail-closed", checkDriverShape(java.replace("intent 未实现（v1 白名单外）", ""), menu), "未实现", true); poisons++;
    R("摘掉邮箱失败续守候", checkDriverShape(java.replaceAll("intent FAIL 已记入 intentLog", ""), menu), "已记入 intentLog", true); poisons++;
    R("摘掉脚本形态判红", checkDriverShape(java.replace('finish(false, "intent 后置条件失败 ', 'finish(false, "zzz '), menu), "脚本形态判红停轮", true); poisons++;
    R("摘掉起步观测刷新", checkDriverShape(java.replace(/startRound\(\);\s*writeState\(client, player\);/g, "startRound();"), menu), "会话起步未刷新", true); poisons++;
    R("摘掉状态补种", checkDriverShape(java.replace("!stateSeeded && player != null", "false"), menu), "补种", true); poisons++;
    R("摘掉 writeState 坐标快照", checkDriverShape(java.replace(/px = player\.getX\(\);/g, "// x"), menu), "writeState 未快照玩家坐标", true); poisons++;
    R("摘掉 failIntent 出口", checkDriverShape(java.replace("private static void failIntent(", "private static void zzzIntent("), menu), "failIntent", true); poisons++;
    R("摘掉菜单参数键 entities", checkDriverShape(java.replace('"blocks", "entities"', '"blocks"'), menu), "参数键：entities", true); poisons++;
    R("goto 未命中回到 finish(false)", checkDriverShape(java.replace('failIntent(client, player, "goto_target_missing"', 'finish(false, "goto nearest'), menu), "goto nearest 未命中未走 failIntent", true); poisons++;
    R("摘掉 JSONL 单行拼接", checkDriverShape(java.replaceAll('? "," : ""', '? "," + nl() : ""'), menu), "单行契约", true); poisons++;
    R("摘掉截图新鲜度判据", checkDriverShape(java.replace("newest >= intentStartMillis - 1500", "true"), menu), "新鲜度", true); poisons++;
    R("摘掉截图落盘等待", checkDriverShape(java.replace("newestShotMillis(client) >= shotRequestMillis", "false"), menu), "落盘", true); poisons++;
    R("摘掉截图新鲜度助手", checkDriverShape(java.replace("private static long newestShotMillis(", "private static long zzShotMillis("), menu), "newestShotMillis", true); poisons++;
    R("摘掉 mailbox JSON 转义", checkDriverShape(java.replace("jsonEsc(INTENT_MAILBOX)", "INTENT_MAILBOX"), menu), "JSON 转义", true); poisons++;
    R("摘掉意图后观测刷新", checkDriverShape(java.replace("writeState(client, player); // 每条意图跑完都刷新观测面（成功 / 失败都要）—— 口径单源「每轮喂给 LLM 的观测契约」", "// (removed)"), menu), "completeIntent 未在每条意图", true); poisons++;
    R("摘掉预算判红", checkDriverShape(java.replace("intent 预算耗尽", ""), menu), "预算", true); poisons++;
    R("摘掉 waitintent 步", checkDriverShape(java.replace('case "waitintent":', 'case "zzz":'), menu), "waitintent", true); poisons++;
    const impl = java + '\n        if (name.equals("mine")) { return new String[] { "wait 1" }; }';
    R("mine 长出成功分支", checkDriverShape(impl, menu), "实现面变了", true); poisons++;
    // 质量批（2026-10-01 F1b/F2/F3/F4/F6）逐锚点毒株：
    R("摘掉数值参数判红", checkDriverShape(java.replaceAll("firstBadNum(", "zzBadNum("), menu), "firstBadNum", true); poisons++;
    R("数值判红未接线", checkDriverShape(java.replaceAll('"param_not_number"', '"zz_other"'), menu), "param_not_number", true); poisons++;
    R("摘掉 tick 兜底", checkDriverShape(java.replace("interpTickBody(client)", "zzBody(client)"), menu), "未包 fail-closed 兜底", true); poisons++;
    R("摘掉 tick 兜底标记", checkDriverShape(java.replace("onInterpTick 未捕获异常", ""), menu), "未捕获异常", true); poisons++;
    R("脚本形态文案未回退", checkDriverShape(java.replace('"脚本步骤"', '"intent"'), menu), "文案未回退", true); poisons++;
    R("邮箱回严格解码", checkDriverShape(java.replace("new String(Files.readAllBytes(Path.of(INTENT_MAILBOX)), StandardCharsets.UTF_8)", "Files.readString(Path.of(INTENT_MAILBOX), StandardCharsets.UTF_8)"), menu), "容错解码", true); poisons++;
    R("摘掉 jsonEsc 换行转义", checkDriverShape(java.replace('.replace("\\n", "\\\\n")', ""), menu), "jsonEsc 未转义换行", true); poisons++;
    R("失败原因挤回 postcondition", checkDriverShape(java.replace('\\"postcondition\\": \\"\\", \\"failure\\": \\"', '\\"postcondition\\": \\"'), menu), "拆进 failure", true); poisons++;
    R("摘掉 lastIntent failure", checkDriverShape(java.replaceAll("lastIntentFailure", "zzFailure"), menu), "lastIntent", true); poisons++;
  }

  // 2b) spec↔impl kind 覆盖（F1）：正对照 + 双向投毒
  {
    const r = generatePlaytestDriver({ platform: "fabric", version: "1.21.11", driverMode: "in_jvm_player_agent", capabilityProfile: "operator" });
    const java = r.files["playtest/PlaytestQaDriver.java"];
    R("kind 覆盖正对照", checkKindCoverage(java, PLAYTEST_INTENTS, UNIMPLEMENTED_V1), "", false); controls++;
    R("实现发了未声明的 kind", checkKindCoverage(java.replace('intentPostKind = "scan_written"', 'intentPostKind = "zz_bogus"'), PLAYTEST_INTENTS, UNIMPLEMENTED_V1), "zz_bogus", true); poisons++;
    const specMut = PLAYTEST_INTENTS.map((i) => (i.name === "walk_to" ? { ...i, postcondition: { ...i.postcondition, kind: "zz_missing" } } : i));
    R("spec 声明了实现没有的 kind", checkKindCoverage(java, specMut, UNIMPLEMENTED_V1), "zz_missing", true); poisons++;
  }

  // 3) 工具矩阵：正对照（生产实现）+ 全 ok 假实现（必红）
  {
    const root = mkdtempSync(join(tmpdir(), "mc-skill-intent-selftest-"));
    const prev = { allow: process.env.MC_SKILL_PLAYTEST_ALLOW, root: process.env.MC_SKILL_PLAYTEST_ROOT };
    try {
      process.env.MC_SKILL_PLAYTEST_ALLOW = "1";
      process.env.MC_SKILL_PLAYTEST_ROOT = root;
      const menu = generatePlaytestDriver({ platform: "fabric", version: "1.21.11", driverMode: "in_jvm_player_agent", capabilityProfile: "operator" }).files["playtest/intent-menu.json"];
      const strictMenu = generatePlaytestDriver({ platform: "fabric", version: "1.21.11", driverMode: "in_jvm_player_agent", capabilityProfile: "strict_survival" }).files["playtest/intent-menu.json"];
      const dirs = { op: join(root, "op"), strict: join(root, "strict"), noMenu: join(root, "noMenu"), badMenu: join(root, "badMenu"), nested: join(root, "p2", "playtest-evidence", "run"), obsFail: join(root, "obsFail"), obsPass: join(root, "obsPass"), outside: join(tmpdir(), "mc-skill-intent-outside-selftest") };
      for (const d of [dirs.op, dirs.strict, dirs.badMenu, dirs.nested, dirs.obsFail, dirs.obsPass, join(root, "p2", "playtest-evidence", "playtest")]) mkdirSync(d, { recursive: true });
      writeFileSync(join(dirs.op, "intent-menu.json"), menu);
      writeFileSync(join(dirs.strict, "intent-menu.json"), strictMenu);
      writeFileSync(join(dirs.badMenu, "intent-menu.json"), "{");
      writeFileSync(join(root, "p2", "playtest-evidence", "playtest", "intent-menu.json"), menu); // 候选链：<dir>/../playtest/intent-menu.json
      const walkToFb = (JSON.parse(menu).intents.find((i) => i.name === "walk_to").fallback ?? []).filter((x) => typeof x === "string" && x.trim() !== "");
      dirs.obsFailFallback = walkToFb;
      writeFileSync(join(dirs.obsFail, "intent-menu.json"), menu);
      writeFileSync(join(dirs.obsFail, "state.json"), JSON.stringify({ lastIntent: { name: "walk_to", ok: false } }));
      writeFileSync(join(dirs.obsPass, "intent-menu.json"), menu);
      writeFileSync(join(dirs.obsPass, "state.json"), JSON.stringify({ lastIntent: { name: "walk_to", ok: true } }));
      R("矩阵正对照（生产实现）", runMatrix(playtestIntent, dirs), "", false); controls++;
      const stubAllOk = (q) => ({ ok: true, action: q.action, written: { intent: q.intent } });
      const stubProbs = runMatrix(stubAllOk, dirs);
      R("假实现全 ok：必须咬住禁列", stubProbs, "INTENT_FORBIDDEN", true); poisons++;
      R("假实现全 ok：必须咬住授权根外", stubProbs, "PATH_OUTSIDE_ALLOWLIST", true); poisons++;
    } finally {
      if (prev.allow === undefined) delete process.env.MC_SKILL_PLAYTEST_ALLOW; else process.env.MC_SKILL_PLAYTEST_ALLOW = prev.allow;
      if (prev.root === undefined) delete process.env.MC_SKILL_PLAYTEST_ROOT; else process.env.MC_SKILL_PLAYTEST_ROOT = prev.root;
      rmSync(root, { recursive: true, force: true });
    }
  }

  // 4) 证据 invariant：好夹具正对照 + 逐 invariant 投毒
  {
    const ev = mkdtempSync(join(tmpdir(), "mc-skill-intent-ev-"));
    const shots = join(ev, "shots");
    mkdirSync(shots, { recursive: true });
    const writeGood = () => {
      writeFileSync(join(ev, "exit-code.txt"), "0\n");
      writeFileSync(join(ev, "state.json"), JSON.stringify({
        intentState: { profile: "operator", menu: {}, mailbox: {}, remainingTicks: 1234, active: "" },
        intents: [{ intent: "walk_to", ok: true }, { intent: "stop", ok: true }],
        lastIntent: { name: "stop", ok: true, postcondition: "driver_stops", failure: "", detail: "stop requested" },
      }));
      writeFileSync(join(ev, "rounds.jsonl"), JSON.stringify({
        round: 1, ok: true, done: 2,
        intentLog: [
          { intent: "mine", params: "", postcondition: "", failure: "unimplemented_v1", ok: false, detail: "intent 未实现（v1 白名单外）：mine" },
          { intent: "walk_to", params: "x=10 z=-20 tol=3", postcondition: "distance_le_tol_and_moved_ge_min", failure: "", ok: true, detail: "dist=2.1 tol=3 traveled=12.0 min=8.9" },
          { intent: "screenshot", params: "testId=e2e", postcondition: "shot", failure: "", ok: true, detail: "file=2026-10-01_1.png bytes=1 ageMs=-84 testId=e2e" },
          { intent: "stop", params: "", postcondition: "driver_stops", failure: "", ok: true, detail: "stop requested" },
        ],
      }) + "\n");
      writeFileSync(join(ev, "intent.done.json"), '{"intent":"stop"}\n');
      writeFileSync(join(shots, "2026-10-01_1.png"), "x");
      writeFileSync(join(shots, "2026-10-01_2.png"), "x");
    };
    try {
      writeGood();
      R("证据正对照", checkEvidence(ev, shots), "", false); controls++;
      writeGood(); writeFileSync(join(ev, "exit-code.txt"), "1\n");
      R("exit-code=1", checkEvidence(ev, shots), "exit-code", true); poisons++;
      writeGood(); rmSync(join(ev, "state.json"));
      R("缺 state.json", checkEvidence(ev, shots), "state.json", true); poisons++;
      writeGood(); const st0 = JSON.parse(readFileSync(join(ev, "state.json"), "utf8")); st0.intents = [st0.intents[0]];
      writeFileSync(join(ev, "state.json"), JSON.stringify(st0));
      R("intents<2", checkEvidence(ev, shots), "intents 数组", true); poisons++;
      writeGood(); const st1 = JSON.parse(readFileSync(join(ev, "state.json"), "utf8")); st1.lastIntent = {};
      writeFileSync(join(ev, "state.json"), JSON.stringify(st1));
      R("lastIntent 无 name", checkEvidence(ev, shots), "lastIntent", true); poisons++;
      writeGood(); writeFileSync(join(ev, "rounds.jsonl"), JSON.stringify({ round: 1, ok: false, done: 0, intentLog: [] }) + "\n");
      R("rounds 末行 ok=false", checkEvidence(ev, shots), "ok!==true", true); poisons++;
      writeGood(); {
        const rl = JSON.parse(readFileSync(join(ev, "rounds.jsonl"), "utf8"));
        rl.intentLog = rl.intentLog.filter((e) => e.ok !== false);
        writeFileSync(join(ev, "rounds.jsonl"), JSON.stringify(rl) + "\n");
      }
      R("无 ok:false（fail-closed 未演示）", checkEvidence(ev, shots), "fail-closed", true); poisons++;
      writeGood(); {
        const rl = JSON.parse(readFileSync(join(ev, "rounds.jsonl"), "utf8"));
        rl.intentLog = rl.intentLog.map((e) => (e.ok === true ? { ...e, detail: "" } : e));
        writeFileSync(join(ev, "rounds.jsonl"), JSON.stringify(rl) + "\n");
      }
      R("pass 条目 detail 空", checkEvidence(ev, shots), "postcondition/detail", true); poisons++;
      writeGood(); rmSync(join(ev, "intent.done.json"));
      R("缺 intent.done.json", checkEvidence(ev, shots), "intent.done", true); poisons++;
      writeGood(); rmSync(join(shots, "2026-10-01_2.png"));
      R("截图 1 张", checkEvidence(ev, shots), "截图 < 2", true); poisons++;
      writeGood(); {
        const rl = JSON.parse(readFileSync(join(ev, "rounds.jsonl"), "utf8"));
        rl.intentLog = rl.intentLog.slice(0, 2); // 去掉 stop
        writeFileSync(join(ev, "rounds.jsonl"), JSON.stringify(rl) + "\n");
      }
      R("末条不是 stop", checkEvidence(ev, shots), "stop", true); poisons++;
      writeGood(); {
        const good = readFileSync(join(ev, "rounds.jsonl"), "utf8");
        writeFileSync(join(ev, "rounds.jsonl"), JSON.stringify({ round: 0, ok: true, done: 1, intentLog: [] }) + "\n{bad\n" + good);
      }
      R("rounds 中间行非 JSON", checkEvidence(ev, shots), "不是合法 JSON", true); poisons++;
      writeGood(); {
        const rl = JSON.parse(readFileSync(join(ev, "rounds.jsonl"), "utf8"));
        rl.intentLog = rl.intentLog.map((e) => (e.ok === true && /\.png/.test(String(e.detail)) ? { ...e, detail: String(e.detail).replace(/ ageMs=-?\d+/, "") } : e));
        writeFileSync(join(ev, "rounds.jsonl"), JSON.stringify(rl) + "\n");
      }
      R("截图条目缺 ageMs", checkEvidence(ev, shots), "ageMs", true); poisons++;
      // 拆字段形状（2026-10-01 F1b）：三类投毒 + 一类 lastIntent 投毒。
      writeGood(); {
        const rl = JSON.parse(readFileSync(join(ev, "rounds.jsonl"), "utf8"));
        rl.intentLog = rl.intentLog.map((e) => (e.intent === "walk_to" ? { ...e, failure: "goto_timeout" } : e));
        writeFileSync(join(ev, "rounds.jsonl"), JSON.stringify(rl) + "\n");
      }
      R("成功条目带 failure", checkEvidence(ev, shots), "postcondition/failure", true); poisons++;
      writeGood(); {
        const rl = JSON.parse(readFileSync(join(ev, "rounds.jsonl"), "utf8"));
        rl.intentLog = rl.intentLog.map((e) => (e.intent === "mine" ? { ...e, postcondition: "unimplemented_v1" } : e));
        writeFileSync(join(ev, "rounds.jsonl"), JSON.stringify(rl) + "\n");
      }
      R("失败条目把原因挤回 postcondition", checkEvidence(ev, shots), "postcondition/failure", true); poisons++;
      writeGood(); {
        const rl = JSON.parse(readFileSync(join(ev, "rounds.jsonl"), "utf8"));
        rl.intentLog = rl.intentLog.map((e) => (e.intent === "mine" ? { ...e, failure: "" } : e));
        writeFileSync(join(ev, "rounds.jsonl"), JSON.stringify(rl) + "\n");
      }
      R("失败条目 postcondition/failure 双空", checkEvidence(ev, shots), "postcondition/failure", true); poisons++;
      writeGood(); const st2 = JSON.parse(readFileSync(join(ev, "state.json"), "utf8")); st2.lastIntent.failure = "x";
      writeFileSync(join(ev, "state.json"), JSON.stringify(st2));
      R("lastIntent 成功态带 failure", checkEvidence(ev, shots), "lastIntent postcondition/failure", true); poisons++;
    } finally {
      rmSync(ev, { recursive: true, force: true });
    }
  }

  if (fails.length) {
    console.error(`assert-playtest-intent-gate(selftest): FAIL（${fails.length} 记不符）`);
    for (const f of fails) console.error(`  ${f}`);
    process.exit(1);
  }
  console.log(`assert-playtest-intent-gate(selftest): OK（${poisons} 记投毒 + ${controls} 正对照，分母现数）`);
}

if (SELFTEST) runSelftest();
else await main();
