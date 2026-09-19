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
 *      （`declared === true` + 非空 `why`）—— 分歧可以有，静默不行。
 *
 * 用法
 *   node scripts/assert-bedrock-script-api-pin.mjs
 *   node scripts/assert-bedrock-script-api-pin.mjs --selftest   # 纯内存投毒（7 例 + 真实输入正对照）
 *
 * 盲区（写明，不假装覆盖）：本门不联网复核 npm（`basis` 里那句 as-of 是人工一手核对的结果，
 * 复核需外网 + 用户拍板是否推进钉值）；也不判断 `@minecraft/server-ui` 等其它 module 的版本。
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

/** 判据①②③ 的纯函数（真跑与 --selftest 共用）。io = { pinText, docsStatusText, scaffoldFiles:[{rel,text}] } */
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
  return { problems, pinnedVersion, stable, declared, diverged: Boolean(pinnedVersion && stable && pinnedVersion !== stable) };
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
  return {
    pinText: read(PIN_RELPATH),
    docsStatusText: read(DOCS_STATUS_RELPATH),
    scaffoldFiles,
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
  ];
  let missed = 0;
  for (const [name, fn] of cases) {
    if (fn().length === 0) {
      missed++;
      console.error(`  ✗ selftest「${name}」应红实绿`);
    }
  }
  const real = judge(REAL_IO);
  if (real.problems.length > 0) {
    missed++;
    console.error(`  ✗ selftest 正对照：真实仓库本应绿，实得 ${real.problems.length} 项：`);
    for (const p of real.problems.slice(0, 5)) console.error(`      ${p}`);
  }
  console.log(
    `\nassert-bedrock-script-api-pin(selftest): ${
      missed === 0
        ? `OK（${cases.length} 类畸形全检出 + 真实输入正对照绿：钉值 ${real.pinnedVersion} / 模板声明 ${real.declared} 处 / 快照 ${real.stable}）`
        : `${missed} 例不符`
    }`,
  );
  process.exit(missed === 0 ? 0 : 1);
}

const { problems, pinnedVersion, stable, declared, diverged } = judge(REAL_IO);
if (problems.length) {
  console.error(`assert-bedrock-script-api-pin: RED（${problems.length} 条）`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(
  `assert-bedrock-script-api-pin: ok（模板钉值 ${pinnedVersion} · ${declared} 处模板声明与之逐字一致 · ` +
    `文档快照 scriptApiStable=${stable}${diverged ? "（与钉值不同，分歧已登记 —— 语义分层：模板钉值按 npm 复核、快照随抓取滞后）" : "（与钉值相同）"}）`,
);
