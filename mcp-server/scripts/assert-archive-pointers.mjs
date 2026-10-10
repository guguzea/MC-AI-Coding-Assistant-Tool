#!/usr/bin/env node
/**
 * 门：档案指针守卫 —— 「档案/历史/证据搬走 + 留指针」的执法面（2026-10-09）。
 *
 * 起因（同轮实测依据）：指针跟随实验 13 臂（夹具只在 `temp/`，不进仓库；数字与结论记进
 * `mcp-server/CHANGELOG.md` 同批）—— 代理**会**跟指针读（第一轮 B/C、第二轮 K2；1000 文件
 * 规模仍成立），**唯一实测到的失败形态**是「档案/约束存在，但没有任何一行出现在它会读到的
 * 面上」（静默失效臂 K4 的特征：约束文件在场，而任务书连「有规范」都没提）。本门把那形变红。
 *
 * 判据（四腿，fail-closed；围栏 ``` 内不计提及 —— 与 `assert-authoring-lint.mjs` 的 J2 同口径）：
 *   P1 档案在盘：`REGISTRY` 每条的文件必须在盘（防改名 / 删除后指针悬空 ⇒ 读者按指针找不到东西）。
 *   P2 存在被提到：`REGISTRY` 每条必须被 ≥1 份**常驻/必读面**（`FACES`）按**仓库相对路径逐字**提及。
 *      简名不算——`CHANGELOG.md` 命中不了 `mcp-server/CHANGELOG.md`（否则「提到过某本账」会
 *      冒充「指到这本账」）；`README*` / `AUTO_SETUP` 也不在面里——人读面不在 agent 常驻路径上，
 *      那里的提及防不了静默失效（T4 夹具钉住这个区别）。
 *   P3 面在盘：`FACES` 文件缺 ⇒ 红。缺面不得塌成「没提到」（否则删掉 `AGENTS.md` 能让 P2 变绿）。
 *   P4 账本候选在册：扫「名字就像账本」的两层（根 `*.md`、`mcp-server/*.md`，
 *      模式 `/(PROVENANCE|CHANGELOG|_LIST|LEDGER)/i`），每个候选必须在 `REGISTRY`，或在
 *      `EXPLICIT_EXEMPT`（带原因）里 —— 防「新账本加了、必读面没人指」这类盲区。
 *
 * 盲区（写明，不假装覆盖）：本门只判「存在被提到」，**不判措辞是否构成合格指针**（指针三件套
 * 由人按 `WRITING-FOR-AGENTS.md` §2 把关）；P4 只扫那两层（本仓账本命名都在那里），
 * `community_knowledge/authored/**` 里哪份算「档案」由人登记（本表第 3 条即此），名字模式扫不到。
 *
 * 真值源：本文件的 `REGISTRY` / `EXPLICIT_EXEMPT` / `FACES`。**新增账本时：在此登记 + 在必读面留一行指针。**
 * 用法：node assert-archive-pointers.mjs [--root=<dir>] [--selftest]
 */
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARGV = process.argv.slice(2);
const SELFTEST = ARGV.includes("--selftest");
function argVal(name) {
  const hit = ARGV.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
}
const ROOT = path.resolve(argVal("root") ?? path.join(HERE, "..", ".."));

/** 在册档案：搬走的「史/证据」的家。每条 = 必须在盘 + 必须被必读面提到。 */
export const REGISTRY = [
  { file: "CORPUS_PROVENANCE.md", why: "语料来源 / 抓取 / 换源 / 逐档复测史（别名：取证史的家）" },
  { file: "mcp-server/CHANGELOG.md", why: "门与基线的实现史（逐批记录；WRITING-FOR-AGENTS §5/§6 指派的家）" },
  {
    file: "community_knowledge/authored/ingame-playtest-automation.md",
    why: "游玩自测的口径 / 坑位 / 逐轮取证史（根纲「游玩自测」段指派的家）",
  },
];

/** 常驻 / 必读面：这些文件在 agent 的默认读取路径上，提及才防得住静默失效。 */
export const FACES = ["AGENTS.md", "WRITING-FOR-AGENTS.md", "CONTRIBUTING.md"];

/** P4 豁免：名字像账本、但按设计不由本门管（各带原因 + 它实际被谁指着；新增豁免要在 commit message 里说清）。 */
export const EXPLICIT_EXEMPT = new Map([
  ["CHANGELOG.md", "根版本索引，本身就是指针文件（明细的家是 mcp-server/CHANGELOG.md）；读者是人类发布流程"],
  ["CONTRIBUTING_LIST.md", "维护侧台账（批次 / 未排期清单），读者是维护会话，不在 agent 常驻路径"],
  ["bugfix_list.md", "发布增量台账（V1.0.4..HEAD 逐条，发版时搬进 Release 正文）；指路在 README（人读面），agent 的逐批实现史家在 mcp-server/CHANGELOG.md"],
]);

/** P4 扫描层：本仓账本命名都在这两层；扩面另批（见门头「盲区」）。 */
const LEDGER_NAME = /(PROVENANCE|CHANGELOG|_LIST|LEDGER)/i;
const LEDGER_SCAN_DIRS = [".", "mcp-server"];

const norm = (rel) => rel.replace(/\\/g, "/");

/** 围栏感知：``` 块内内容不计（示例 / 注释里的名字不构成指针）。 */
export function stripFences(text) {
  let fence = false;
  return text
    .split(/\r?\n/)
    .map((line) => {
      if (/^\s*```/.test(line)) {
        fence = !fence;
        return "";
      }
      return fence ? "" : line;
    })
    .join("\n");
}

/**
 * 纯判据（真跑与 selftest 共用；IO 全注入 ⇒ 投毒只碰内存）。
 * @param {{registry:Array,faces:Array,exempt:Map,candidates:Array,exists:Function,read:Function}} io
 * @returns {{errors:string[],mentions:Array<{file:string,face:string|null}>,faceCount:number,registered:number}}
 */
export function evaluate({ registry, faces, exempt, candidates, exists, read }) {
  const errors = [];
  const mentions = [];
  // P3 面在盘（先判面，避免缺面把 P2 塌成「没提到」）
  const faceTexts = [];
  for (const face of faces) {
    if (!exists(face)) {
      errors.push(`[FACE-MISSING] 必读面缺文件：${face}（缺面不得塌成「没提到」——先补回面）`);
      continue;
    }
    faceTexts.push({ face, text: stripFences(String(read(face) ?? "")) });
  }
  for (const { file } of registry) {
    const rel = norm(file);
    // P1 档案在盘
    if (!exists(rel)) {
      errors.push(`[ARCHIVE-MISSING] 在册档案不在盘：${rel}（改名 / 删除会让必读面的指针悬空）`);
      continue;
    }
    // P2 存在被提到（按仓库相对路径逐字，围栏外）
    const hit = faceTexts.find(({ text }) => text.includes(rel));
    mentions.push({ file: rel, face: hit ? hit.face : null });
    if (!hit) {
      errors.push(
        `[ARCHIVE-UNMENTIONED] 在册档案没有任何必读面提到：${rel} ⇒ 静默失效风险` +
          `（修法：在 ${faces.join(" / ")} 之一留一行按路径点名的指针）`,
      );
    }
  }
  // P4 账本候选在册
  const registered = new Set(registry.map((e) => norm(e.file)));
  for (const cand of candidates) {
    const rel = norm(cand);
    if (registered.has(rel) || exempt.has(rel)) continue;
    errors.push(
      `[LEDGER-UNREGISTERED] 名字像账本的文件不在册：${rel}` +
        `（修法：登记进 REGISTRY（若它是 agent 要读的史/证据的家）或在 EXPLICIT_EXEMPT 写明原因）`,
    );
  }
  return { errors, mentions, faceCount: faceTexts.length, registered: registered.size };
}

function listCandidates(root, readdir) {
  const out = [];
  for (const relDir of LEDGER_SCAN_DIRS) {
    let ents;
    try {
      ents = readdir(path.join(root, relDir));
    } catch {
      continue;
    }
    for (const e of ents) {
      if (!e.isFile()) continue;
      if (!/\.md$/i.test(e.name) || !LEDGER_NAME.test(e.name)) continue;
      out.push(norm(path.join(relDir, e.name)));
    }
  }
  return [...new Set(out)].sort();
}

function runGate() {
  const exists = (rel) => fs.existsSync(path.isAbsolute(rel) ? rel : path.join(ROOT, rel));
  const read = (rel) => {
    try {
      return fs.readFileSync(path.join(ROOT, rel), "utf8");
    } catch {
      return null;
    }
  };
  const candidates = listCandidates(ROOT, (abs) => fs.readdirSync(abs, { withFileTypes: true }));
  const { errors, mentions, faceCount, registered } = evaluate({
    registry: REGISTRY,
    faces: FACES,
    exempt: EXPLICIT_EXEMPT,
    candidates,
    exists,
    read,
  });
  if (errors.length > 0) {
    for (const e of errors) console.error(`  ✗ ${e}`);
    console.error(`\nassert-archive-pointers: 红（${errors.length} 条）`);
    process.exit(1);
  }
  const ev = mentions.map((m) => `${m.file} ← ${m.face}`).join("；");
  // 算术不变式（防摘要行自述漂掉）：候选 = 在册 ∪ 豁免，两块之和必须等于候选总数。
  const candRegistered = candidates.filter((c) => new Set(REGISTRY.map((e) => norm(e.file))).has(c)).length;
  const exempted = candidates.filter((c) => EXPLICIT_EXEMPT.has(c)).length;
  if (candRegistered + exempted !== candidates.length) {
    console.error(
      `  ✗ [TALLY-BROKEN] 候选 ${candidates.length} ≠ 在册 ${candRegistered} + 豁免 ${exempted}（判据内部不一致，别信这行的绿）`,
    );
    process.exit(1);
  }
  console.log(
    `assert-archive-pointers: 在册档案 ${registered} 全部在盘且被必读面提到（面 ${faceCount}/${FACES.length}：${FACES.join(" / ")}）；` +
      `账本候选 ${candidates.length}（在册 ${candRegistered} + 豁免 ${exempted}）；证据：${ev}`,
  );
}

function runSelftest() {
  const mk = (files) => ({
    exists: (rel) => files.has(norm(rel)),
    read: (rel) => files.get(norm(rel)) ?? null,
  });
  const R = [{ file: "archive-a.md", why: "t" }, { file: "mcp-server/archive-b.md", why: "t" }];
  const F = ["AGENTS.md", "WRITING-FOR-AGENTS.md"];
  const X = new Map([["legacy-index.md", "fixture"]]);
  const base = () =>
    new Map([
      ["archive-a.md", "档案头\n史…\n"],
      ["mcp-server/archive-b.md", "档案头\n史…\n"],
      ["AGENTS.md", "见 `archive-a.md`；见 `mcp-server/archive-b.md`\n"],
      ["WRITING-FOR-AGENTS.md", ""],
    ]);
  const run = (files, candidates = ["archive-a.md", "mcp-server/archive-b.md", "legacy-index.md"]) =>
    evaluate({ registry: R, faces: F, exempt: X, candidates, exists: mk(files).exists, read: mk(files).read });

  // 正对照：两册在盘 + 面按路径提及 + 候选全在册/豁免 ⇒ 绿
  {
    const got = run(base());
    assert.deepEqual(got.errors, [], `正对照被误报：\n${got.errors.join("\n")}`);
    assert.equal(got.mentions.filter((m) => m.face === "AGENTS.md").length, 2, "两册都应记到 AGENTS.md 这条证据");
  }
  // 投毒 P1：档案不在盘 ⇒ 红 [ARCHIVE-MISSING]
  {
    const f = base();
    f.delete("mcp-server/archive-b.md");
    const got = run(f);
    assert.ok(
      got.errors.some((e) => e.startsWith("[ARCHIVE-MISSING]") && e.includes("mcp-server/archive-b.md")),
      `档案缺失应报 ARCHIVE-MISSING，实得：${got.errors.join("；")}`,
    );
  }
  // 投毒 P2：档案在盘但没有任何面提 ⇒ 红 [ARCHIVE-UNMENTIONED]
  {
    const f = base();
    f.set("AGENTS.md", "什么都没有\n");
    const got = run(f);
    assert.ok(
      got.errors.some((e) => e.startsWith("[ARCHIVE-UNMENTIONED]") && e.includes("archive-a.md")),
      `无人提及应报 ARCHIVE-UNMENTIONED，实得：${got.errors.join("；")}`,
    );
  }
  // 投毒 P2 区别钉：提及只出现在 README（人读面）⇒ 仍红（面 ≠ 人读面）
  {
    const f = base();
    f.set("AGENTS.md", "什么都没有\n");
    f.set("README.md", "见 `archive-a.md` 与 `mcp-server/archive-b.md`\n");
    const got = run(f);
    assert.ok(
      got.errors.filter((e) => e.startsWith("[ARCHIVE-UNMENTIONED]")).length === 2,
      `README 的提及不得替代必读面，实得：${got.errors.join("；")}`,
    );
  }
  // 投毒 P3：面缺文件 ⇒ 红 [FACE-MISSING]（且不得把 P2 塌成绿）
  {
    const f = base();
    f.delete("AGENTS.md");
    const got = run(f);
    assert.ok(
      got.errors.some((e) => e.startsWith("[FACE-MISSING]") && e.includes("AGENTS.md")),
      `缺面应报 FACE-MISSING，实得：${got.errors.join("；")}`,
    );
    assert.ok(
      got.errors.some((e) => e.startsWith("[ARCHIVE-UNMENTIONED]")),
      `缺面时档案不应被当作「已提到」，实得：${got.errors.join("；")}`,
    );
  }
  // 围栏两向：提及只在 ``` 块里 ⇒ 红；同文再补一处围栏外 ⇒ 绿（证明围栏排除是活的，不是扫描恒不命中）
  {
    const f = base();
    f.set("AGENTS.md", "```\n见 `archive-a.md` 与 `mcp-server/archive-b.md`\n```\n");
    const fenced = run(f);
    assert.equal(
      fenced.errors.filter((e) => e.startsWith("[ARCHIVE-UNMENTIONED]")).length,
      2,
      `围栏内提及不算指针，实得：${fenced.errors.join("；")}`,
    );
    f.set("AGENTS.md", "```\n见 `archive-a.md`\n```\n正文：见 `archive-a.md` 与 `mcp-server/archive-b.md`\n");
    assert.deepEqual(run(f).errors, [], "围栏外补一处后应转绿（证明上一条是被围栏排除打红的）");
  }
  // 投毒 P4：候选不在册 ⇒ 红 [LEDGER-UNREGISTERED]；登记豁免后 ⇒ 绿（两向）
  {
    const f = base();
    const cands = ["archive-a.md", "mcp-server/archive-b.md", "legacy-index.md", "mcp-server/NEW_LEDGER.md"];
    const got = run(f, cands);
    assert.ok(
      got.errors.some((e) => e.startsWith("[LEDGER-UNREGISTERED]") && e.includes("NEW_LEDGER.md")),
      `新账本未在册应报 LEDGER-UNREGISTERED，实得：${got.errors.join("；")}`,
    );
    const exempt2 = new Map([...X, ["mcp-server/NEW_LEDGER.md", "fixture 补登记"]]);
    const got2 = evaluate({
      registry: R,
      faces: F,
      exempt: exempt2,
      candidates: cands,
      exists: mk(f).exists,
      read: mk(f).read,
    });
    assert.deepEqual(got2.errors, [], `补登记后应绿，实得：${got2.errors.join("；")}`);
  }
  console.log(
    "assert-archive-pointers: selftest OK（1 例正对照 + 投毒：P1 缺失 / P2 无提及 / P2 README 替代 / " +
      "P3 缺面 / 围栏两向 / P4 未在册两向）",
  );
}

if (SELFTEST) runSelftest();
else runGate();
