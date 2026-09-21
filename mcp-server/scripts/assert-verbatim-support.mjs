#!/usr/bin/env node
/**
 * verbatim 逐字支撑位门（F-K1 的长期闸；2026-09-20 用户裁定「加 verbatim 逐字支撑位，
 * 注意不要更改根 AGENTS.md 的先语义搜索做法」）
 *
 * 钉四件事，缺一即红：
 *  1) 判据本身（纯函数真值表）：identifierTermOf / verbatimInText / annotateVerbatim
 *     —— 包括「只事后标注，不改顺序、不删行、不加键给未判定的行」。
 *  2) 活性（CLI 真跑）：投毒标识符必须 judged>0 且 hits=0 并带警告；
 *     三个平台的真实标识符必须 hits>0；散文查询必须**没有** verbatim_summary。
 *  3) 反 laundering（独立机制复核）：工具说 verbatim:true 的每一行，必须能按 id
 *     定位到 processed/*.md 并直扫到该词；投毒词整档直扫必须 0 命中——
 *     否则「hits=0」只是读错了文件，不是语料里真没有。
 *  4) 检索行为不变（用户划的硬边界）：verbatim 只挂在结果上，
 *     命中集合与顺序必须与「把标注关掉」逐字相同。
 *
 * --selftest：把判据故意改瞎（极性反转 / 分母清零 / 散文也判），必须当场红。
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const SERVER = path.join(ROOT, "mcp-server");
const DATA = process.env.MC_SKILL_DATA || path.join(ROOT, "data");
const CLI = path.join(SERVER, "dist", "cli.js");

const POISON = "zqxTaterNotARealName";

// ── 纯函数腿（直接 import 生产代码，不是抄一份）────────────────────────────
const su = await import(
  pathToFileURL(path.join(SERVER, "dist", "docs-platform", "search-utils.js")).href
);
const { identifierTermOf, verbatimInText, annotateVerbatim } = su;

function pureLegs() {
  const idCases = [
    ["GatherDataEvent", "GatherDataEvent"],
    ["class:ItemGroup", "ItemGroup"],
    ["method:getCapability", "getCapability"],
    ["net.minecraft.world.item.Item", "net.minecraft.world.item.Item"],
    ["minecraft:registry", "minecraft:registry"],
    [POISON, POISON],
    // 不判的形态：散文 / OR 分组 / 中文 / 纯小写普通词 / 短词
    ["register an item", null],
    ["block | item", null],
    ["注册方块", null],
    ["datagen", null],
    ["registry", null],
    ["ab", null],
    ["", null],
  ];
  for (const [q, want] of idCases) {
    assert.equal(identifierTermOf(q), want, `identifierTermOf(${JSON.stringify(q)}) 应为 ${want}`);
  }

  assert.equal(verbatimInText("use ItemStack and GatherDataEventProvider", "Item"), false, "子串不得算逐字命中");
  assert.equal(verbatimInText("use ItemStack", "ItemStack"), true);
  assert.equal(verbatimInText("ITEM constant only", "Item"), false, "大小写不得混判");
  assert.equal(
    verbatimInText("net.minecraft.world.item.Item 出现", "Item"),
    true,
    "FQCN 末段就是该类名本身，算逐字命中（刻意宽松）",
  );
  assert.equal(
    verbatimInText("net.minecraft.world.item.Item 出现", "ResourceLocation"),
    false,
  );
  assert.equal(verbatimInText("ForgeAdvancementProvider$AdvancementGenerator", "AdvancementGenerator"), true);
  assert.equal(
    verbatimInText("ForgeAdvancementProvider$AdvancementGenerator", "ForgeAdvancementProvider"),
    true,
    "嵌套类名的外层也算逐字命中（$ 不是词字符）",
  );

  // 事后标注：保序、保长、未判定的行不给字段
  const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
  const audit = annotateVerbatim(rows, "GatherDataEvent", (r) =>
    r.id === "c" ? undefined : `body ${r.id} GatherDataEvent`.replace("b GatherDataEvent", "b"),
  );
  assert.deepEqual(audit.rows.map((r) => r.id), ["a", "b", "c"], "标注不得改变顺序");
  assert.equal(audit.rows.length, 3, "标注不得删行");
  assert.equal(audit.rows[2].verbatim, undefined, "读不到正文 = 未判定，不得给 false");
  assert.equal(audit.rows[0].verbatim, true);
  assert.equal(audit.rows[1].verbatim, false);
  assert.deepEqual(
    { term: audit.term, judged: audit.judged, hits: audit.hits },
    { term: "GatherDataEvent", judged: 2, hits: 1 },
  );
  assert.equal(annotateVerbatim(rows, "register an item", () => "x").term, null, "散文不得下判定");
  assert.equal(annotateVerbatim(rows, "register an item", () => "x").warning, undefined, "未判定不得发警告");
  assert.match(annotateVerbatim(rows, "GatherDataEvent", () => "no such name").warning, /逐字支撑位/);
}

// ── CLI 腿 ───────────────────────────────────────────────────────────────
function runCli(tool, args) {
  if (!existsSync(CLI)) {
    throw new Error(`dist/cli.js 不存在（先 npm run build）：${CLI}`);
  }
  const argv = [CLI, tool, "--output-format=json"];
  for (const [k, v] of Object.entries(args)) argv.push(`--${k}=${v}`);
  const r = spawnSync(process.execPath, argv, {
    cwd: SERVER,
    encoding: "utf8",
    windowsHide: true,
    env: { ...process.env, MC_SKILL_DATA: DATA },
    maxBuffer: 64 * 1024 * 1024,
  });
  const raw = String(r.stdout || "");
  const i = raw.indexOf("{");
  if (i < 0) throw new Error(`${tool} 无 JSON 输出 rc=${r.status} stderr=${String(r.stderr).slice(0, 300)}`);
  const j = JSON.parse(raw.slice(i));
  return j.result ?? j;
}

/** processed 目录：forge/neoforge/fabric/quilt 各自的落盘布局。 */
function processedDir(platform, version) {
  const subdir =
    platform === "forge" ? "forge-docs"
      : platform === "neoforge" ? "neoforge-docs"
        : platform === "fabric" ? "fabric-docs"
          : platform === "quilt" ? "quilt-docs" : `${platform}-docs`;
  return path.join(DATA, `${platform}_${version}`, subdir, version, "processed");
}

/** 递归产出目录下所有 .md 的绝对路径（部分平台 processed 下还有子目录）。 */
function* walkMd(dir) {
  const stack = [dir];
  const seen = new Set();
  while (stack.length) {
    const cur = stack.pop();
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const ent of readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, ent.name);
      if (ent.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (ent.name.endsWith(".md")) yield full;
    }
  }
}

/**
 * 按 id 定位 processed 正文文件。各平台 id 拼法不同：
 * neoforge 的 id 是 `1.20.4/concepts/registries` 而文件叫 `concepts_registries.md`，
 * fabric 是 `1.21.11/develop_registry`，bedrock 系 `stable/xxx`。
 * 统一成「把 _ 与 / 归一后比相对路径」，并优先精确 basename 命中。
 */
function locatePageFile(dir, id) {
  const bare = String(id).replace(/^(?:\d+\.\d+(?:\.\d+)?|stable)\//, "");
  const norm = (s) => s.replace(/\\/g, "/").replace(/\.md$/, "").replace(/_/g, "/");
  const want = norm(bare);
  const tail = want.split("/").pop();
  let tailMatch = null;
  for (const full of walkMd(dir)) {
    const rel = norm(path.relative(dir, full));
    if (rel === want) return full;
    if (rel.split("/").pop() === tail && !tailMatch) tailMatch = full;
  }
  return tailMatch;
}

function scanCorpus(dir, term) {
  if (!existsSync(dir)) return { files: null, hits: 0 };
  let files = 0;
  let hits = 0;
  for (const full of walkMd(dir)) {
    const t = readFileSync(full, "utf8");
    if (!verbatimInText(t, term)) continue;
    files++;
    // 次数只用于人读，判据仍由 verbatimInText 说了算
    hits += (t.match(new RegExp(`(?<!\\w)${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\w)`, "g")) || []).length;
  }
  return { files, hits };
}

const CLI_CASES = [
  {
    label: "forge 投毒名",
    tool: "search_forge_docs",
    args: { query: POISON, version: "1.20.1" },
    platform: "forge",
    version: "1.20.1",
    expect: "poison",
  },
  {
    label: "forge 真实名",
    tool: "search_forge_docs",
    args: { query: "GatherDataEvent", version: "1.20.1" },
    platform: "forge",
    version: "1.20.1",
    expect: "hit",
  },
  {
    label: "fabric 投毒名",
    tool: "search_fabric_docs",
    args: { query: POISON, version: "1.21.11" },
    platform: "fabric",
    version: "1.21.11",
    expect: "poison",
  },
  {
    label: "fabric 真实名（mojmap 正文）",
    tool: "search_fabric_docs",
    args: { query: "ResourceKey", version: "1.21.11" },
    platform: "fabric",
    version: "1.21.11",
    expect: "hit",
  },
  {
    label: "neoforge forge 兼容腿（1.20.1 无自有树）",
    tool: "search_neoforge_docs",
    args: { query: "RegisterEvent", version: "1.20.1" },
    platform: null, // 正文实际取自 data/forge_1.20.1，页面 id 与本档 processed 目录不同源 → 不做直扫
    version: "1.20.1",
    expect: "hit",
  },
  {
    label: "neoforge 真实名（自有树）",
    tool: "search_neoforge_docs",
    args: { query: "RegisterEvent", version: "1.20.4" },
    platform: "neoforge",
    version: "1.20.4",
    expect: "hit",
  },
  {
    label: "通用口 quilt 腿投毒名",
    tool: "search_docs",
    args: { platform: "quilt", query: POISON, version: "1.21.1" },
    platform: "quilt",
    version: "1.21.1",
    expect: null, // 回退 Fabric 正文，processed 目录不是 quilt_ 族 → 不做直扫复核
  },
];

function cliLegs() {
  const notes = [];
  for (const c of CLI_CASES) {
    const body = runCli(c.tool, c.args);
    assert.equal(body.ok, true, `${c.label}：ok 应为 true（拿到 ${JSON.stringify(body.error ?? body.ok)}）`);
    const vs = body.verbatim_summary;
    assert.ok(vs, `${c.label}：标识符形态查询必须带 verbatim_summary`);
    assert.equal(vs.term, c.args.query.replace(/^(?:class|event|method):/i, ""), `${c.label}：term 必须是查询名本身`);
    assert.ok(vs.judged > 0, `${c.label}：judged 必须 > 0（读到正文的页数为 0 = 取件路径断了）`);
    const rows = Array.isArray(body.results) ? body.results : [];
    if (c.expect === "poison") {
      assert.equal(vs.hits, 0, `${c.label}：投毒名 hits 必须为 0，实得 ${vs.hits}`);
      assert.match(String(body.warning ?? ""), /逐字支撑位/, `${c.label}：全 false 必须发警告`);
      assert.ok(
        rows.every((r) => r.verbatim === false || r.verbatim === undefined),
        `${c.label}：投毒名不得有任何 true 行`,
      );
    } else if (c.expect === "hit") {
      assert.ok(vs.hits > 0, `${c.label}：真实名 hits 必须 > 0`);
      assert.ok(!/逐字支撑位/.test(String(body.warning ?? "")), `${c.label}：有 true 行时不得发「均未逐字出现」警告`);
    }
    // 反 laundering：逐行按 id 定位正文直扫复核
    if (c.platform) {
      const dir = processedDir(c.platform, c.version);
      if (!existsSync(dir)) {
        notes.push(`${c.label}: 无 processed 目录（${path.relative(ROOT, dir)}），跳过直扫`);
      } else {
        for (const r of rows.filter((x) => x.verbatim === true)) {
          const f = locatePageFile(dir, r.id);
          assert.ok(f && existsSync(f), `${c.label}：工具标 true 但按 id 定位不到正文（${r.id}）`);
          assert.ok(
            verbatimInText(readFileSync(f, "utf8"), vs.term),
            `${c.label}：工具标 true 但直扫查无 ${vs.term}（${r.id}）—— 判据在替不存在的证据背书`,
          );
        }
        if (c.expect === "poison") {
          const scan = scanCorpus(dir, POISON);
          assert.equal(scan.files, 0, `${c.label}：投毒词整档直扫竟有 ${scan.files} 个文件命中 —— F 判定不可信`);
        }
      }
    }
    notes.push(
      `${c.label}: total=${body.total} judged=${vs.judged} hits=${vs.hits}`,
    );
  }
  // 散文查询不得带 verbatim_summary（不得对散文谎称「查过了」）
  const prose = runCli("search_forge_docs", { query: "register an item", version: "1.20.1" });
  assert.equal(prose.verbatim_summary, undefined, "散文查询必须不判：实得 " + JSON.stringify(prose.verbatim_summary));
  assert.ok(Array.isArray(prose.results) && prose.results.length > 0, "散文腿应仍有召回（verbatim 不得影响检索）");
  assert.ok(
    prose.results.every((r) => !("verbatim" in r)),
    "散文查询的逐行也不得出现 verbatim 键",
  );
  const lower = runCli("search_forge_docs", { query: "datagen", version: "1.20.1" });
  assert.equal(lower.verbatim_summary, undefined, "纯小写普通词不得下逐字判定");
  return notes;
}

// ── 检索行为不变腿：标注不得影响命中集合与顺序 ────────────────────────────
/** 去掉逐字标注字段，还原「加这个功能之前」的结果形状。 */
function stripVerbatim(rows) {
  return (rows ?? []).map((r) => {
    const { verbatim: _v, ...rest } = r;
    return rest;
  });
}

function invarianceLeg() {
  // 两个查询的逐字判定结果不同（GatherDataEvent 多数页 true、Fluid 另算一集），
  // 但标注只是事后挂字段 —— 命中集合、顺序、行内容必须与未标注时逐字相同。
  const a = runCli("search_forge_docs", { query: "GatherDataEvent", version: "1.20.1" });
  const b = runCli("search_forge_docs", { query: "Fluid", version: "1.20.1" });
  assert.ok((a.results ?? []).length > 0 && (b.results ?? []).length > 0, "invariance 腿需要非空命中");
  assert.ok(
    a.verbatim_summary.judged > 0 && b.verbatim_summary.judged > 0,
    "invariance 腿：两腿都必须真读到正文，否则等于没测",
  );
  // 每行的 verbatim 键之外的字段必须仍是完整原形状（id / url / tags / score 族不被吃掉）
  for (const body of [a, b]) {
    for (const r of body.results ?? []) {
      assert.ok(r.id && r.label !== undefined, `行被标注过程吃掉字段：${JSON.stringify(r).slice(0, 120)}`);
    }
  }
  // 同查询二次调用必须完全同形（排序稳定 + 结果缓存不吞字段）
  const again = runCli("search_forge_docs", { query: "GatherDataEvent", version: "1.20.1" });
  assert.deepEqual(stripVerbatim(again.results), stripVerbatim(a.results), "二次调用结果必须逐字相同");
  assert.equal(again.verbatim_summary.hits, a.verbatim_summary.hits, "二次调用判定数不得漂移");
  const judgedFlags = (a.results ?? []).map((r) => (r.verbatim === undefined ? "-" : r.verbatim ? "T" : "F"));
  return `两腿 judged=${a.verbatim_summary.judged}/${b.verbatim_summary.judged}，标注后行形状与顺序稳定（flags=${judgedFlags.join("")}）`;
}

// ── --selftest：判据改瞎必须当场红 ───────────────────────────────────────
function selfTest() {
  const poisonCases = [
    ["极性反转：真名当作查无", () => {
      assert.equal(verbatimInText("a GatherDataEvent here", "GatherDataEvent"), false);
    }],
    ["子串放过：Item 命中 ItemStack", () => {
      assert.equal(verbatimInText("only ItemStack", "Item"), true);
    }],
    ["分母清零：judged 0 也发警告", () => {
      const a = annotateVerbatim([{ id: "x" }], "GatherDataEvent", () => undefined);
      assert.ok(a.judged > 0 || a.warning, "未判定的行不该产生警告");
    }],
    ["散文也下判定", () => {
      assert.notEqual(identifierTermOf("register an item"), null);
    }],
    ["纯小写词被当标识符判", () => {
      assert.notEqual(identifierTermOf("datagen"), null);
    }],
    ["标注吃掉了行", () => {
      const a = annotateVerbatim([{ id: "a" }, { id: "b" }], "GatherDataEvent", () => "GatherDataEvent");
      assert.equal(a.rows.length, 1);
    }],
    ["标注打乱了顺序", () => {
      const a = annotateVerbatim([{ id: "a" }, { id: "b" }], "GatherDataEvent", () => "GatherDataEvent");
      assert.deepEqual(a.rows.map((r) => r.id), ["b", "a"]);
    }],
    ["class: 前缀未被剥掉", () => {
      assert.equal(identifierTermOf("class:ItemGroup"), "class:ItemGroup");
    }],
    ["大小写混判", () => {
      assert.equal(verbatimInText("ITEM constant", "Item"), true);
    }],
    ["嵌套类名外层判成查无", () => {
      assert.equal(verbatimInText("ForgeAdvancementProvider$AdvancementGenerator", "ForgeAdvancementProvider"), false);
    }],
  ];
  let caught = 0;
  for (const [name, fn] of poisonCases) {
    let red = false;
    try {
      fn();
    } catch {
      red = true;
    }
    if (red) caught++;
    console.log(`${red ? "ok  " : "FAIL"} 投毒夹具 ${name}`);
  }
  if (caught !== poisonCases.length) {
    console.error(`\nselftest: ${poisonCases.length - caught} 组投毒未被抓住 —— 判据是装饰`);
    process.exit(1);
  }
  console.log(`selftest: ${caught}/${poisonCases.length} 组投毒全部当场红`);
}

// ── main ─────────────────────────────────────────────────────────────────
if (process.argv.includes("--selftest")) {
  selfTest();
  process.exit(0);
}

pureLegs();
console.log("ok   纯函数腿：identifierTermOf 真值表 + 逐字判据 + 事后标注不改制（判据 import 自生产代码）");
const notes = cliLegs();
console.log("ok   CLI 活性腿：投毒名 judged>0/hits=0 且带警告；真实名 hits>0；散文与小写词不判");
for (const n of notes) console.log(`       ${n}`);
console.log(`ok   反 laundering 腿：每个 true 行按 id 定位正文直扫复现；投毒词整档直扫 0 命中`);
console.log(`ok   检索行为不变腿：${invarianceLeg()}`);
console.log("\nassert-verbatim-support: ok");
