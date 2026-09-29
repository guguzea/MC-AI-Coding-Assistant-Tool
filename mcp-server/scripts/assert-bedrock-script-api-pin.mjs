#!/usr/bin/env node
/**
 * assert-bedrock-script-api-pin.mjs — bedrock 模板 `@minecraft/server` 钉值的真值源门
 * （2026-09-19 用户裁定 N9(c) 落地：「统一真值，但先区分语义」）。
 *
 * 立门缘由：sweep85 把 `bedrock/scaffold/BP/manifest.json` 的依赖从 2.9.0 提到 2.10.0（依据 npm
 * dist-tags，as-of 2026-09-18），而 `data/bedrock-docs-status.json` 的 `scriptApiStable` 仍是 2.9.0
 * （Learn 快照 fetchedAt=2026-08-14）—— 两个数都「对」，但当时**没有任何机械判据**：
 * `validate_addon_manifest` 完全不看 `dependencies`，于是模板与生成器默认值可以静默分叉，
 * 「谁是真值、为什么不同」只写在散文里（写散文的地方还会被下一次 sweep 覆盖）。
 *
 * 语义分层（**不得把两个数当同一个比对**）
 *   · `data/bedrock-docs-status.json.scriptApiStable` = Learn 文档快照所载 stable，随抓取更新、天然滞后
 *     ⇒ 它是 `generate_addon_manifest` 的**默认值来源**（2026-09-18 既定语义，本次不动）。
 *   · `mcp-server/data/bedrock-script-api-pin.json` = 本仓给新工程的**模板钉值**，按 npm dist-tags 推进。
 *   统一的是「真值只有一个来源、分歧必须显式登记、单侧改动即红」，不是把两个数拉平。
 *
 * 判据（任一不满足即红）
 *   ① 钉值文件存在、可解析，`scaffoldDependency.module_name === "@minecraft/server"`，
 *      `version` 是 `x.y.z`，且 `basis` / `asOf`（YYYY-MM-DD）非空；
 *   ② 每个 `bedrock/scaffold/<pack>/manifest.json` 里声明了该 module_name 的条目，
 *      `version` 必须等于钉值；且**至少有一个**模板声明它（防「把依赖删光 ⇒ 门没有看守对象」的假绿）；
 *   ③ 钉值 ≠ `docsStatus.scriptApiStable` 时，必须显式登记 `divergenceFromDocsStatus`
 *      （`declared === true` + 非空 `why`）—— 分歧可以有，静默不行；
 *   ④（2026-09-28 用户点名「每条必须有 basis+asOf 挂入形状类门」）`scripts/fabric-api-version-pins.json`
 *      存在、可解析，且**逐条**：键是 MC 版本号 ∧ 该档在本仓有 `data/fabric_<键>` 语料树 ∧
 *      `version` 是 `<api>+<mc>` 而 `+` 后段归本档 ∧ `basis` / `asOf`（YYYY-MM-DD）非空；
 *      条目数地板 ≥1（与判据②同形：删光条目 = 门失去对象，不是「没有需要 pin 的档」）；
 *   ⑤ `scripts/fetch-loader-api-jars.mjs` 源码仍引用那份 pins（三个锚点）—— 否则 ④ 守的是一份
 *      **没人消费**的文件，而抓取器退回「借邻版坐标」。
 *
 * 范围说明（别被文件名骗）：本门自 2026-09-28 起是**仓内 pins 类文件的形状门**，①②③ 是 bedrock 模板钉值、
 * ④⑤ 是 fabric-api 版本 pins。不改名（改名会打断 `test-scripts.mjs` 的 §S4 数组与 `bugfix_list.md` 里
 * 按旧名登记的历史行），口径以本注释为准。
 *
 * 用法
 *   node scripts/assert-bedrock-script-api-pin.mjs
 *   node scripts/assert-bedrock-script-api-pin.mjs --selftest   # 纯内存投毒（例数由 cases.length 现算，勿在此写死）
 *
 * 盲区（写明，不假装覆盖）：本门不联网复核 npm（`basis` 里那句 as-of 是人工一手核对的结果，
 * 复核需外网 + 用户拍板是否推进钉值）；也不判断 `@minecraft/server-ui` 等其它 module 的版本。
 * 判据④⑤ 同理只核**形状与接线**，不复核 `basis` 里那句 modrinth 读数是不是真的（需外网）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const MODULE = "@minecraft/server";

const PIN_RELPATH = "mcp-server/data/bedrock-script-api-pin.json";
const DOCS_STATUS_RELPATH = "data/bedrock-docs-status.json";
const SCAFFOLD_DIR = "bedrock/scaffold";
// 判据④⑤（2026-09-28）：fabric-api 版本 pins + 它唯一消费者（抓取器）的接线锚点。
const FAPI_PINS_RELPATH = "scripts/fabric-api-version-pins.json";
const FETCHER_RELPATH = "scripts/fetch-loader-api-jars.mjs";
const FETCHER_ANCHORS = [/FABRIC_API_PINS_PATH/, /fabricApiPinFor/, /fabricVerBelongsToMc/];

/**
 * 判据④：fabric-api 版本 pins 的形状（纯函数，真跑与 --selftest 共用）。
 * `text`：undefined = 调用方没把这一腿接进 io（不得塌成「没有 pins」）；null = 文件不在盘上。
 * `packs`：本仓 `data/fabric_*` 的档位清单（null = 调用方没接「档位实存」这条腿）。
 */
export function fapiPinProblems(text, packs) {
  const problems = [];
  const bad = (msg) => problems.push(`判据④：${msg}`);
  if (text === undefined) return { problems: [`判据④：io 里没有 fapiPinsText 字段 ⇒ 调用方未接这一腿（读不到 ≠ 没有条目）`], count: -1 };
  if (text === null) return { problems: [`判据④：${FAPI_PINS_RELPATH} 不在盘上 —— 这是那些档唯一的「不借邻版」坐标出处 [PINS-MISSING]`], count: -1 };
  let j;
  try {
    j = JSON.parse(text);
  } catch (e) {
    return { problems: [`判据④：${FAPI_PINS_RELPATH} 不是合法 JSON —— ${e.message}（读不动不得静默当「没有 pin」）`], count: -1 };
  }
  if (!j || typeof j !== "object" || Array.isArray(j)) return { problems: [`判据④：${FAPI_PINS_RELPATH} 顶层必须是对象`], count: -1 };
  const keys = Object.keys(j).filter((k) => !k.startsWith("_"));
  if (keys.length === 0) bad(`${FAPI_PINS_RELPATH} 零条目 —— 门失去看守对象，不是「没有需要 pin 的档」[PINS-EMPTY]`);
  if (packs === undefined) bad("io 里没有 fabricPacks 字段 ⇒ 调用方未接「档位实存」这条腿");
  const packSet = Array.isArray(packs) ? new Set(packs) : null;
  for (const k of keys) {
    if (!/^\d+(\.\d+)+$/.test(k)) {
      bad(`键 ${JSON.stringify(k)} 不是 MC 版本号（不带下划线前缀的键一律按「档 → pin」解释）`);
      continue;
    }
    const e = j[k];
    if (!e || typeof e !== "object" || Array.isArray(e)) {
      bad(`${k} 的条目不是对象`);
      continue;
    }
    for (const f of ["basis", "asOf"]) {
      if (typeof e[f] !== "string" || !e[f].trim()) bad(`${k} 缺 ${f}（钉值必须带依据与 as-of 日期，否则无从复核 —— 与判据①同一条）`);
    }
    if (typeof e.asOf === "string" && e.asOf.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(e.asOf)) {
      bad(`${k} 的 asOf 应为 YYYY-MM-DD，实得 ${JSON.stringify(e.asOf)}`);
    }
    if (packSet && !packSet.has(k)) bad(`${k} 在本仓没有 data/fabric_${k} 语料树 —— 钉了一档不存在的档（拼错或已删档）`);
    if (typeof e.version !== "string" || !e.version.includes("+")) {
      bad(`${k} 的 version 应为「<api>+<mc>」（fabric-api 坐标自带所属 MC 版），实得 ${JSON.stringify(e.version ?? null)}`);
    } else {
      const tail = e.version.split("+")[1];
      if (!(tail === k || k.startsWith(tail + "."))) {
        bad(
          `${k} 的 pin 是 ${e.version}，其 + 后段 ${tail} 不归本档 ⇒ 那是**借邻版**（禁止）。` +
            `复核入口：query_upstream_releases --source=modrinth --slug=fabric-api --minecraftVersion=${k}`,
        );
      }
    }
  }
  return { problems, count: keys.length };
}

/** 判据⑤：抓取器仍引用那份 pins（否则④守的是没人消费的文件）。按源码锚点判，不复制判据实现。 */
export function fetcherWiringProblems(text) {
  const problems = [];
  if (text === undefined) return { problems: [`判据⑤：io 里没有 fetcherText 字段 ⇒ 调用方未接这一腿`], anchored: -1 };
  if (text === null) return { problems: [`判据⑤：${FETCHER_RELPATH} 不在盘上 —— 谁删了第三坐标来源的唯一消费者？`], anchored: -1 };
  const missing = FETCHER_ANCHORS.filter((re) => !re.test(text)).map(String);
  if (missing.length) {
    problems.push(
      `判据⑤：抓取器里这些锚点不见了 ⇒ ${FAPI_PINS_RELPATH} 已无人消费（坐标会退回借邻版或干脆不取）：${missing.join("、")}`,
    );
  }
  return { problems, anchored: FETCHER_ANCHORS.length - missing.length };
}

/** 判据①②③④⑤ 的纯函数（真跑与 --selftest 共用）。
 *  io = { pinText, docsStatusText, scaffoldFiles:[{rel,text}], fapiPinsText, fabricPacks, fetcherText }
 *  后三个字段缺失（undefined）本身判红 —— 「调用方没接线」不得塌成「这条腿没事可做」。 */
export function judge(io) {
  const problems = [];
  let pin = null;
  try {
    pin = JSON.parse(io.pinText);
  } catch (e) {
    problems.push(`判据①：钉值文件 ${PIN_RELPATH} 不是合法 JSON —— ${e.message}（不许静默回退到「没钉值」）`);
  }
  let pinnedVersion = null;
  let divergence = null;
  if (pin && typeof pin === "object") {
    const dep = pin.scaffoldDependency;
    if (!dep || typeof dep !== "object") problems.push(`判据①：缺 scaffoldDependency 对象`);
    else {
      if (dep.module_name !== MODULE) {
        problems.push(`判据①：scaffoldDependency.module_name 必须是 ${MODULE}，实得 ${JSON.stringify(dep.module_name ?? null)}`);
      }
      if (typeof dep.version !== "string" || !/^\d+\.\d+\.\d+$/.test(dep.version)) {
        problems.push(`判据①：scaffoldDependency.version 必须是 x.y.z，实得 ${JSON.stringify(dep.version ?? null)}`);
      } else {
        pinnedVersion = dep.version;
      }
    }
    for (const k of ["basis", "asOf"]) {
      if (typeof pin[k] !== "string" || !pin[k].trim()) problems.push(`判据①：缺 ${k}（钉值必须带依据与 as-of 日期，否则无从复核）`);
    }
    if (typeof pin.asOf === "string" && pin.asOf.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(pin.asOf)) {
      problems.push(`判据①：asOf 应为 YYYY-MM-DD，实得 ${JSON.stringify(pin.asOf)}`);
    }
    divergence = pin.divergenceFromDocsStatus ?? null;
  }

  // ② 模板 ↔ 钉值
  let declared = 0;
  for (const f of io.scaffoldFiles) {
    let man;
    try {
      man = JSON.parse(f.text);
    } catch (e) {
      problems.push(`判据②：${f.rel} 不是合法 JSON —— ${e.message}`);
      continue;
    }
    const deps = Array.isArray(man?.dependencies) ? man.dependencies : [];
    for (const d of deps) {
      if (!d || d.module_name !== MODULE) continue;
      declared++;
      if (pinnedVersion && d.version !== pinnedVersion) {
        problems.push(
          `判据②：${f.rel} 的 ${MODULE} 依赖是 ${JSON.stringify(d.version ?? null)}，与钉值 ${pinnedVersion} 不一致` +
            `（模板与钉值单侧改动；要么改模板，要么按 npm 一手复核后改钉值+asOf）`,
        );
      }
    }
  }
  if (declared === 0) {
    problems.push(`判据②：${SCAFFOLD_DIR} 下没有任何 manifest 声明 ${MODULE} 依赖 —— 门失去看守对象（不是「没有分歧」）`);
  }

  // ③ 与文档快照的分歧必须登记
  let stable = null;
  try {
    const st = JSON.parse(io.docsStatusText);
    stable = typeof st?.scriptApiStable === "string" ? st.scriptApiStable : null;
  } catch (e) {
    problems.push(`判据③：${DOCS_STATUS_RELPATH} 不可解析 —— ${e.message}（无法判断分歧是否已登记）`);
  }
  if (stable === null) {
    problems.push(`判据③：${DOCS_STATUS_RELPATH} 缺 scriptApiStable 字符串`);
  } else if (pinnedVersion && stable !== pinnedVersion) {
    if (!divergence || divergence.declared !== true || typeof divergence.why !== "string" || !divergence.why.trim()) {
      problems.push(
        `判据③：钉值 ${pinnedVersion} ≠ 文档快照 scriptApiStable ${stable}，但 divergenceFromDocsStatus 未显式登记` +
          `（declared:true + 非空 why）—— 分歧可以有，静默不行`,
      );
    }
  }
  // ④ fabric-api 版本 pins 的形状（basis / asOf / 归本档 / 档位实存 / 条目地板）
  const pins = fapiPinProblems(io.fapiPinsText, io.fabricPacks);
  problems.push(...pins.problems);
  // ⑤ 那份 pins 的唯一消费者仍在读它
  const wire = fetcherWiringProblems(io.fetcherText);
  problems.push(...wire.problems);
  return {
    problems,
    pinnedVersion,
    stable,
    declared,
    diverged: Boolean(pinnedVersion && stable && pinnedVersion !== stable),
    pinsCount: pins.count,
    anchored: wire.anchored,
  };
}

function readAll() {
  const read = (rel) => {
    const p = path.join(ROOT, rel);
    return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
  };
  const scaffoldFiles = [];
  const base = path.join(ROOT, SCAFFOLD_DIR);
  if (fs.existsSync(base)) {
    for (const e of fs.readdirSync(base, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const rel = `${SCAFFOLD_DIR}/${e.name}/manifest.json`;
      const text = read(rel);
      if (text !== null) scaffoldFiles.push({ rel, text });
    }
  }
  const fabricPacks = (() => {
    // 档位清单现扫（不抄 AGENTS 里的手列快照）：只认 data/fabric_<\d+(\.\d+)+>，排除 fabric_porting 这类非版本目录
    try {
      return fs
        .readdirSync(path.join(ROOT, "data"), { withFileTypes: true })
        .filter((e) => e.isDirectory() && /^fabric_.+$/.test(e.name))
        .map((e) => e.name.slice("fabric_".length))
        .filter((v) => /^\d+(\.\d+)+$/.test(v));
    } catch {
      return null;
    }
  })();
  return {
    pinText: read(PIN_RELPATH),
    docsStatusText: read(DOCS_STATUS_RELPATH),
    scaffoldFiles,
    fapiPinsText: read(FAPI_PINS_RELPATH),
    fetcherText: read(FETCHER_RELPATH),
    fabricPacks,
  };
}

const REAL_IO = readAll();

// ── --selftest：纯内存投毒（不碰仓库文件）───────────────────────────────────────────────
if (process.argv.includes("--selftest")) {
  if (REAL_IO.pinText === null) {
    console.error(`assert-bedrock-script-api-pin: 钉值文件缺失 ${PIN_RELPATH}`);
    process.exit(1);
  }
  const realPin = JSON.parse(REAL_IO.pinText);
  const mkPin = (patch) => JSON.stringify({ ...realPin, ...patch });
  const bp = REAL_IO.scaffoldFiles.find((f) => /\/BP\//.test(f.rel)) ?? REAL_IO.scaffoldFiles[0];
  // 判据④⑤ 的夹具底：从**真树**上取一条 pin，各臂只改一个字段 ⇒ 红了只能怪那一条判据。
  // 真树上 pins 不可用（缺失/零条目/抓取器不在）时，夹具无从构造 —— 那是门本身该红，不许让 selftest 假装通过。
  const realFapi = REAL_IO.fapiPinsText ? JSON.parse(REAL_IO.fapiPinsText) : null;
  const pk = realFapi ? Object.keys(realFapi).find((k) => !k.startsWith("_")) : undefined;
  if (!pk || REAL_IO.fetcherText === null) {
    console.error(
      `assert-bedrock-script-api-pin: 判据④⑤ 的夹具底不可用（${FAPI_PINS_RELPATH} ${pk ? "" : "缺失或零条目"} / ` +
        `${FETCHER_RELPATH} ${REAL_IO.fetcherText === null ? "不在盘上" : "在"}）⇒ 先修真树，再谈自证`,
    );
    process.exit(1);
  }
  const setPin = (key, patch) => JSON.stringify({ ...realFapi, [key]: { ...realFapi[key], ...patch } });
  const cases = [
    ["钉值不是合法 JSON", () => judge({ ...REAL_IO, pinText: "{ not json" }).problems],
    ["钉值 version 形态非法", () => judge({ ...REAL_IO, pinText: mkPin({ scaffoldDependency: { module_name: MODULE, version: "2.x" } }) }).problems],
    ["钉值缺 asOf", () => judge({ ...REAL_IO, pinText: mkPin({ asOf: "" }) }).problems],
    [
      "模板版本与钉值不符",
      () =>
        judge({
          ...REAL_IO,
          scaffoldFiles: REAL_IO.scaffoldFiles.map((f) =>
            f === bp ? { ...f, text: f.text.replace(/"2\.10\.0"/, '"2.9.9"') } : f,
          ),
        }).problems,
    ],
    ["模板全都不声明该依赖", () => judge({ ...REAL_IO, scaffoldFiles: REAL_IO.scaffoldFiles.map((f) => ({ ...f, text: '{"dependencies":[]}' })) }).problems],
    [
      "分歧未登记",
      () => judge({ ...REAL_IO, pinText: mkPin({ divergenceFromDocsStatus: { declared: false, why: "" } }) }).problems,
    ],
    ["文档快照缺 scriptApiStable", () => judge({ ...REAL_IO, docsStatusText: '{"scriptApiBeta":"beta"}' }).problems],
    // ── 判据④：fabric-api 版本 pins 的形状（2026-09-28 用户点名「每条必须有 basis+asOf」）──────
    [`pins 缺 basis（真树那条 ${pk}，只改一个字段）`, () => judge({ ...REAL_IO, fapiPinsText: setPin(pk, { basis: "" }) }).problems, /缺 basis/],
    ["pins 缺 asOf", () => judge({ ...REAL_IO, fapiPinsText: setPin(pk, { asOf: "" }) }).problems, /缺 asOf/],
    ["pins 的 asOf 不是 YYYY-MM-DD", () => judge({ ...REAL_IO, fapiPinsText: setPin(pk, { asOf: "2026-9-2" }) }).problems, /asOf 应为 YYYY-MM-DD/],
    [
      "pins 借邻版（+后段不归本档）",
      () => judge({ ...REAL_IO, fapiPinsText: setPin(pk, { version: String(realFapi[pk].version).split("+")[0] + "+9.9.9" }) }).problems,
      /不归本档/,
    ],
    [
      "pins 键指向本仓没有的 fabric 档",
      () => judge({ ...REAL_IO, fapiPinsText: JSON.stringify({ ...realFapi, "1.99.9": realFapi[pk] }) }).problems,
      /data\/fabric_1\.99\.9/,
    ],
    ["pins 不是合法 JSON", () => judge({ ...REAL_IO, fapiPinsText: "{ not json" }).problems, /不是合法 JSON/],
    ["pins 文件缺失（不得静默退回「没有第三来源」）", () => judge({ ...REAL_IO, fapiPinsText: null }).problems, /PINS-MISSING/],
    ["pins 零条目（只剩注释键 ⇒ 门失去对象）", () => judge({ ...REAL_IO, fapiPinsText: '{"_note":"x"}' }).problems, /PINS-EMPTY/],
    // ── 判据⑤：接线与「调用方没接」不得塌成绿 ──────────────────────────────────────────
    ["抓取器不再引用 pins（消费者被摘 ⇒ ④ 守空文件）", () => judge({ ...REAL_IO, fetcherText: "// 锚点已摘\nconst x = 1;\n" }).problems, /判据⑤/],
    [
      "调用方未接新腿（io 里没有这三个字段 ⇒ 必须红，不许当「无事可做」）",
      () => judge({ pinText: REAL_IO.pinText, docsStatusText: REAL_IO.docsStatusText, scaffoldFiles: REAL_IO.scaffoldFiles }).problems,
      /未接这一腿/,
    ],
  ];
  let missed = 0;
  for (const [name, fn, must] of cases) {
    const ps = fn();
    if (ps.length === 0) {
      missed++;
      console.error(`  ✗ selftest「${name}」应红实绿`);
      continue;
    }
    // 红了还得**因这条腿**红：别的判据顺手红不算这条臂的证据（同一形状只切一个字段 ⇒ 红因唯一）
    if (must && !must.test(ps.join("\n"))) {
      missed++;
      console.error(`  ✗ selftest「${name}」红了但红因不含 ${must}：\n      ${ps.slice(0, 3).join("\n      ")}`);
    }
  }
  const real = judge(REAL_IO);
  if (real.problems.length > 0) {
    missed++;
    console.error(`  ✗ selftest 正对照：真实仓库本应绿，实得 ${real.problems.length} 项：`);
    for (const p of real.problems.slice(0, 5)) console.error(`      ${p}`);
  }
  // 绿那一侧的活性自证：④⑤ 必须在真树上**真的有条目可守**（零条目会被地板判红，但「未接线」是 -1 ⇒ 单独点名）
  if (!(real.pinsCount >= 1)) {
    missed++;
    console.error(`  ✗ selftest 正对照：判据④ 在真树上守到的条目数是 ${real.pinsCount}（-1 = 腿没接上）`);
  }
  if (real.anchored !== FETCHER_ANCHORS.length) {
    missed++;
    console.error(`  ✗ selftest 正对照：判据⑤ 命中锚点 ${real.anchored}/${FETCHER_ANCHORS.length} ⇒ 抓取器与 pins 的接线不成立`);
  }
  console.log(
    `\nassert-bedrock-script-api-pin(selftest): ${
      missed === 0
        ? `OK（${cases.length} 类畸形全检出 + 真实输入正对照绿：钉值 ${real.pinnedVersion} / 模板声明 ${real.declared} 处 / 快照 ${real.stable} / ` +
          `pins ${real.pinsCount} 条 basis+asOf 齐 / 抓取器锚点 ${real.anchored}/${FETCHER_ANCHORS.length}）`
        : `${missed} 例不符`
    }`,
  );
  process.exit(missed === 0 ? 0 : 1);
}

const { problems, pinnedVersion, stable, declared, diverged, pinsCount, anchored } = judge(REAL_IO);
if (problems.length) {
  console.error(`assert-bedrock-script-api-pin: RED（${problems.length} 条）`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(
  `assert-bedrock-script-api-pin: ok（模板钉值 ${pinnedVersion} · ${declared} 处模板声明与之逐字一致 · ` +
    `文档快照 scriptApiStable=${stable}${diverged ? "（与钉值不同，分歧已登记 —— 语义分层：模板钉值按 npm 复核、快照随抓取滞后）" : "（与钉值相同）"} · ` +
    `fabric-api pins ${pinsCount} 条逐条带 basis+asOf（${FAPI_PINS_RELPATH}），其消费者锚点 ${anchored}/${FETCHER_ANCHORS.length} 仍在）`,
);
