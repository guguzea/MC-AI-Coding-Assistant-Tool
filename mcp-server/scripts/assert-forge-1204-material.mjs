/**
 * Gate：F145 —— forge/1.20.4 档源稿不得再引用 1.20+ 已移除的方块 `Material`。
 *
 * 背景：`BlockBehaviour.Properties.of(Material.X)` 这一族在本档规则 / Skill / knowledge 里
 * 成片出现过（27 个 `Material.` 记号 / 21 行），是从 `forge/1.19.4` 整篇复制时带进来的回归
 * （1.19.4 里 `Properties.of(Material)` 是对的，1.20+ 参数被删）。手工改一轮挡不住下一次
 * 「从邻档拷正文」，所以钉成档级静态门。
 *
 * 三条一手证据（复核命令，均在仓库根跑）：
 *   1. node -e "…"：data/forge_1.20.4/extracted/api-index.json 里
 *      `net/minecraft/world/level/block/state/BlockBehaviour$Properties` 的工厂只有
 *      `of => ()L…$Properties;`（**无参**），且有
 *      `mapColor => (Lnet/minecraft/world/level/material/MapColor;)L…$Properties;` 三重载；
 *      整份索引里 `MaterialColor` 0 次、`Material.STONE` 0 次、包名 `block.material` 0 次。
 *   2. grep -c "block[.]material" data/forge_1.20.4/mappings/client.txt → 0（官方 1.20.4 mojmap
 *      里 `net.minecraft.world.level.block.material.Material` 类不存在）；同文件
 *      `net.minecraft.world.level.material.MapColor -> eev:` 段列出 62 个常量
 *      （STONE/WOOD/GRASS/DIRT/SAND/SNOW/ICE/PLANT/WATER/NONE/COLOR_*…，**无 GLASS**）。
 *   3. 同仓自述：forge/1.20.1/knowledge/version-changes/1.20.x.md:36
 *      「1.20+ 已移除 `Material`；使用无参 `of()` + `mapColor`」。
 *   正解形态的本档一手出处：
 *      data/forge_1.20.4/forge-docs/1.20.4/processed/concepts_registries.md:25
 *      `new Block(BlockBehaviour.Properties.of().mapColor(MapColor.STONE))`
 *
 * 断言分两层：
 *  A. 内容层（任何数据根都跑，含 MC_SKILL_MAT_TEST_ROOT 假根）
 *     A1 只扫 forge/1.20.4 的**源稿**：`.cursor/rules/*.mdc`、`.cursor/skills/**`、
 *        `knowledge/**`、`code-patterns/**`、`scaffold/**`（.md/.mdc/.java）。
 *        7 份 IDE 投影（.agents/.claude/.continue/.opencode/.pi/.trae/.zcode）与
 *        `.cursor/agent/` 不扫 —— 一致性由 assert-skill-mirrors.mjs 保证。
 *     A2 禁用形态：
 *        - 常量引用 `(?<![A-Za-z0-9_$])Material\s*[.]\s*[A-Za-z_$]`
 *          （负向前查保证 `ArmorMaterial.IRON` / `MyArmorMaterial.COPPER` /
 *            `// items/MyArmorMaterial.java` 这类**合法** 1.20.4 名字不被误伤）
 *        - 工厂传参 `\b(?:of|create)\s*\(\s*Material\b`
 *          （`Properties.of(Material)`、`of(Material material)`、`create(Material.WOOD)`）
 *     A3 假绿兜底：被扫文件数为 0 = 红（换错根 / 档被搬走不等于零缺陷）。
 *  B. 台账层（只跑真数据根；TEST_ROOT 跳过；MC_SKILL_MAT_RELEDGER=1 只重算并打印、不判红）
 *     钉住「被扫文件数 / 命中数 / 合法豁免的 Armor 材质记号数 / 正解形态出现次数」，
 *     防止「正则被改瞎 → 零候选 → 零命中」或「把示例整段删空」蒙混过关。
 *     台账层还会复核前提：`data/forge_1.20.4/mappings/client.txt` 里 `block.material` 必须仍为
 *     0 次、`MapColor` 必须仍存在；哪天语料把 `Material` 类还回来，本门要显式重评而不是沉默放行。
 *
 * 用法：
 *   node scripts/assert-forge-1204-material.mjs
 *   node scripts/assert-forge-1204-material.mjs --selftest                         # S16/t9 判据自证（全内存、不读档面、不落盘）
 *   MC_SKILL_MAT_RELEDGER=1 node scripts/assert-forge-1204-material.mjs      # 重算台账并打印新数
 *   MC_SKILL_MAT_TEST_ROOT=<假根> node scripts/assert-forge-1204-material.mjs # 投毒用
 *   MC_SKILL_MAT_GATE_INFO=1 node scripts/assert-forge-1204-material.mjs      # 打印命中清单
 *   MC_SKILL_MAT_REQUIRE_PREMISE=1 / MC_SKILL_MAT_CLIENT_TXT=<path>            # 前提腿强制 / 换件投毒
 *
 * S16/t9（第 47 轮，2026-09-25）：**为什么必须补这条 `--selftest`**。上面五个环境变量钩子
 * （`MC_SKILL_MAT_TEST_ROOT` / `_RELEDGER` / `_REQUIRE_PREMISE` / `_CLIENT_TXT` / `_GATE_INFO`）
 * 在补自检之前**全仓只有本文件自己读**（`git grep` 实测零 harness 消费者）⇒ 它们写着「投毒用」
 * 却没有任何夹具真去投毒，是装饰性投毒口。本轮做法与 `assert-powershell.mjs`（第 46 轮）同形：
 *   ① 判定逻辑抽成**判定核**纯函数（`entryScanned` / `collectInto` / `scanText` /
 *      `collectorFloorFailures` / `ledgerDriftFailures` / `premiseCheck` / `gateVerdict`），
 *      live run 与自检**吃同一批函数**，自检不复制判据；
 *   ② 每条腿一个**必须红**的投毒例；
 *   ③ 至少一条**不判定的对照**必须仍绿（正解形态 / 合法豁免 / 现盘台账 / 合规映射文件）；
 *   ④ `[PREMISE] SKIPPED` 那条与 powershell 那道同族：**skip 不得记成 pass** ——
 *      `gateVerdict` 给的是 `pass-unverified-premise` 标签，自检断言它永不塌成 `pass`；
 *   ⑤ 三桶**计数地板**（投毒 ≥12 / 反退化 ≥4 / 对照 ≥6）写死在本文件里：`SELFTEST_GATES` 的循环
 *      只看 rc，把例数掏空成 1 条它照样绿，故地板必须长在门内。
 * 反证（「能红」）由退化副本给出，见 `temp/ralph-20260922/round-47-*.md` §2。
 *
 * 注：本 gate 只读知识库源稿，不依赖 dist，也不需要 npm run build。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, '..');
const REPO_ROOT = path.resolve(SERVER_ROOT, '..');

/** 测试假根：与 assert-scaffold-rules-conflict 的 MC_SKILL_SCAFFOLD_TEST_ROOT 同形态。 */
const TEST_ROOT = process.env.MC_SKILL_MAT_TEST_ROOT;
const ROOT = TEST_ROOT ? path.resolve(TEST_ROOT) : REPO_ROOT;
const RELEDGER = process.env.MC_SKILL_MAT_RELEDGER === '1';
// S16-6：把「前提文件不在场」从静默放行改成显式跳过；设 1 则缺件即红（自备映射的机器 / CI 用）。
const REQUIRE_PREMISE = process.env.MC_SKILL_MAT_REQUIRE_PREMISE === '1';

const PACK_REL = path.join('forge', '1.20.4');
/** 7 份 IDE 投影 + `.cursor/agent`（同为投影），只查源稿。 */
const PROJECTION_DIRS = ['.agents', '.claude', '.continue', '.opencode', '.pi', '.trae', '.zcode'];
const SCAN_EXT = /\.(md|mdc|java)$/;

const BANNED = [
  {
    id: 'block-material-constant',
    re: new RegExp('(?<![A-Za-z0-9_$])Material\\s*[.]\\s*[A-Za-z_$]', 'g'),
    why: '方块 `Material` 常量在 1.20+ 已被移除；1.20.4 写 `Properties.of().mapColor(MapColor.X)`',
    /** S16/t9①：每条禁用式自带「必须能抓住」的样例 —— 被改瞎即反退化断言红。 */
    mustCatch: 'BlockBehaviour.Properties.of(Material.STONE)',
  },
  {
    id: 'block-material-factory-arg',
    re: /\b(?:of|create)\s*\(\s*Material\b/g,
    why: '`Properties.of/create` 在 1.20.4 只接受无参形态；材质位改 `.mapColor(MapColor…)`',
    mustCatch: 'public static Properties of(Material material) {',
  },
];
/** 合法形态：`ArmorMaterial` / `MyArmorMaterial` 等 1.20.4 仍在世的成员（不得被上条误伤）。 */
const EXEMPT = new RegExp('[A-Za-z0-9_$]Material\\s*[.]\\s*[A-Za-z_$]', 'g');
/** 正解形态出现次数（假绿兜底：改对了才会有的数）。 */
const POSITIVE = [
  { id: 'mapColorCalls', re: /mapColor\s*\(/g },
  { id: 'propertiesOfNoArg', re: /Properties\.of\(\s*\)/g },
];

const LEDGER = {
  filesScanned: 74,
  bannedHits: 0,
  armorDotExempt: 6,
  mapColorCalls: 18,
  propertiesOfNoArg: 21,
};

/* ── 判定核（S16/t9 抽出：live run 与 --selftest 共用同一批纯函数）──────────────── */

/** A1 采集谓词：目录按投影名单 + `.cursor/agent` 剪枝，文件按扩展名入选。 */
export function entryScanned(name, isDirectory, absPath) {
  if (isDirectory) {
    if (PROJECTION_DIRS.includes(name)) return false;
    return !absPath.endsWith(path.join('.cursor', 'agent'));
  }
  return SCAN_EXT.test(name);
}

/** A1 采集器：对 `entryScanned` 入选的文件就地收集（live 与自检的假树都走这里）。 */
export function collectInto(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!entryScanned(e.name, true, p)) continue;
      collectInto(p, out);
    } else if (entryScanned(e.name, false, p)) {
      out.push(p);
    }
  }
  return out;
}

/** A2 内容扫描：逐行布尔判定（禁用式不带 g，避免 lastIndex 跨行残留）。 */
export function scanText(text, dispName, banned = BANNED) {
  const lines = text.split(String.fromCharCode(10));
  const hits = [];
  const armorDotExempt = (text.match(EXEMPT) || []).length;
  const positives = {};
  for (const pos of POSITIVE) positives[pos.id] = (text.match(new RegExp(pos.re.source, 'g')) || []).length;
  for (const b of banned) {
    const re = new RegExp(b.re.source);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\r$/, '');
      if (!re.test(line)) continue;
      hits.push(`${dispName}:${i + 1}: [${b.id}] ${line.trim().slice(0, 120)} — ${b.why}`);
    }
  }
  return { hits, census: { bannedHits: hits.length, armorDotExempt, mapColorCalls: positives.mapColorCalls, propertiesOfNoArg: positives.propertiesOfNoArg } };
}

/** A3 假绿兜底：被扫文件数为 0 ⇒ 判红（换错根 / 档被搬走不等于零缺陷）。 */
export function collectorFloorFailures(filesScanned, rootLabel, packLabel) {
  return filesScanned === 0
    ? [`根 ${rootLabel} 下 ${packLabel} 没有可扫源稿 —— 零文件不等于零缺陷，检查换根路径`]
    : [];
}

/** B 台账层：逐键比对，任一动过即红。 */
export function ledgerDriftFailures(got, pinned) {
  const out = [];
  for (const k of Object.keys(pinned)) {
    if (got[k] !== pinned[k]) {
      out.push(`台账漂移: ${k}=${got[k]}，钉的是 ${pinned[k]}（本档源稿或禁用形态变了 → 复核后 MC_SKILL_MAT_RELEDGER=1 重钉）`);
    }
  }
  return out;
}

/** B 前提层：三态（在场复核 / 不在场显式跳过 / REQUIRE 下缺件即红）。 */
export function premiseCheck({ exists, text, requirePremise, pathLabel }) {
  if (!exists) {
    return {
      checked: false,
      note: `SKIPPED(${pathLabel} 不在场 = 未复核，不是通过)`,
      failures: requirePremise
        ? [`MC_SKILL_MAT_REQUIRE_PREMISE=1 但前提文件 ${pathLabel} 不在场 —— 该件被 .gitignore 排除，需自备 1.20.4 mojmap 再跑（或撤掉 REQUIRE）`]
        : [],
    };
  }
  const materialPkg = (text.match(/world[.]level[.]block[.]material/g) || []).length;
  const mapColorPresent = text.includes('net.minecraft.world.level.material.MapColor');
  if (materialPkg > 0 || !mapColorPresent) {
    return {
      checked: true,
      note: 'overturned',
      failures: [`前提被推翻：${pathLabel} 里 block.material=${materialPkg}、MapColor=${mapColorPresent} —— 语料变了，本门的禁用形态需要重评`],
    };
  }
  return { checked: true, note: 'ok(block.material=0 / MapColor 在场)', failures: [] };
}

/** skip 行：措辞必须与判绿行可区分（含 SKIPPED / 未复核 / 本行不是判绿，且不含 `ok(block.material`）。 */
export function premiseSkipLine(pathLabel) {
  return `  [PREMISE] SKIPPED-NOT-VERIFIED —— ${pathLabel} 不在场 ⇒ 「block.material 仍为 0」本轮未复核，本行不是判绿（要强制：MC_SKILL_MAT_REQUIRE_PREMISE=1）`;
}

/** 终判：failures>0 ⇒ fail；skip 永不塌成 pass。 */
export function gateVerdict({ failCount, premiseChecked, testRoot, reledger }) {
  if (failCount > 0) return { label: 'fail', exitCode: 1 };
  if (testRoot) return { label: 'pass-content-only(台账与前提未跑)', exitCode: 0 };
  if (reledger) return { label: 'recomputed(台账未判、只打印)', exitCode: 0 };
  if (!premiseChecked) return { label: 'pass-unverified-premise', exitCode: 0 };
  return { label: 'pass', exitCode: 0 };
}

/** 反退化④：禁用面本身活性自证 —— 每条禁用式必须抓住自己的样例，且合法名不得被抓。 */
export function bannedRulesAliveFailures(banned = BANNED) {
  const out = [];
  for (const b of banned) {
    if (!b.id || !b.why) out.push(`禁用项缺 id/why（判据空转）：${JSON.stringify(b.id || null)}`);
    if (!b.mustCatch) { out.push(`禁用项 ${b.id} 没有 mustCatch 样例 ⇒ 无法自证它抓得住东西（装饰性判据）`); continue; }
    if (scanText(b.mustCatch, 'fixture', [b]).census.bannedHits === 0) {
      out.push(`禁用项 ${b.id} 抓不住自己的 mustCatch 样例 ⇒ 正则被改瞎，本门的 A2 判据已失效`);
    }
  }
  for (const ok of ['private static final ArmorMaterial ARMOR = ArmorMaterial.IRON;', 'MyArmorMaterial.COPPER', '// items/MyArmorMaterial.java']) {
    if (scanText(ok, 'fixture').census.bannedHits > 0) out.push(`合法形态被误伤：${ok}`);
  }
  return out;
}

/* ── S16/t9：in-gate 自检（全内存，不读 forge/1.20.4 档面、不落盘）──────────────── */

const FLOOR_POISON = 12; // 现盘 13 例投毒
const FLOOR_ANTIDEG = 4;
const FLOOR_CONTROL = 6;

function runSelftest() {
  // 例形：{ bucket, name, expect: 'red' | 'green', signal: string[] }
  //   expect red   ⇒ 判据核必须对这份夹具报出失败（投毒不红 = 本门是装饰）
  //   expect green ⇒ 不判定的输入 / 健康核的自证，必须保持零失败（判红 = 误伤或核退化）
  const cases = [];
  const RED = '毒', DEG = '断', CTL = '照';
  const push = (bucket, name, expect, signal) => cases.push({ bucket, name, expect, signal });

  /* ── ① 投毒必红：每条腿一个必须被抓到的夹具 ── */
  push(RED, 'A2 毒·方块 Material 常量形态', 'red', scanText('props = BlockBehaviour.Properties.of(Material.STONE);', 'fake.mdc').hits);
  push(RED, 'A2 毒·工厂传参 of(Material material)', 'red', scanText('public static Properties of(Material material) {', 'fake.java').hits);
  push(RED, 'A2 毒·create(Material.WOOD)', 'red', scanText('return create(Material.WOOD);', 'fake.java').hits);
  push(RED, 'A2 毒·同文件多处命中须逐行点名（不得合并成一条）', 'red', (() => {
    const h = scanText(['A Material.STONE', 'B Material.WOOD', 'C Properties.of(Material.X)'].join(String.fromCharCode(10)), 'fake.md').hits;
    return h.length === 4 ? h : [`期望逐行 4 处（第 3 行两条禁用式都抓），实为 ${h.length}`];
  })());
  push(RED, 'A3 毒·采集面返回 0 个文件 ⇒ 假绿兜底必须红', 'red', collectorFloorFailures(0, 'fake-root', 'forge/1.20.4'));
  push(RED, 'B 毒·台账 filesScanned 从 74 掉到 40', 'red', ledgerDriftFailures({ ...LEDGER, filesScanned: 40 }, LEDGER));
  push(RED, 'B 毒·方块 Material 回归 27 处（钉的是 0）', 'red', ledgerDriftFailures({ ...LEDGER, bannedHits: 27 }, LEDGER));
  push(RED, 'B 毒·正解示例被整段删空（mapColor 18→0）', 'red', ledgerDriftFailures({ ...LEDGER, mapColorCalls: 0 }, LEDGER));
  push(RED, 'B 毒·前提被推翻：映射里回了 block.material 包', 'red',
    premiseCheck({ exists: true, text: 'net.minecraft.world.level.block.material.Material -> a:\nnet.minecraft.world.level.material.MapColor -> eev:', pathLabel: 'client.txt', requirePremise: false }).failures);
  push(RED, 'B 毒·前提被推翻：映射里 MapColor 不见了', 'red',
    premiseCheck({ exists: true, text: 'nothing here about colors', pathLabel: 'client.txt', requirePremise: false }).failures);
  push(RED, 'B 毒·前提文件不在场 + REQUIRE_PREMISE=1 ⇒ 必须红', 'red',
    premiseCheck({ exists: false, requirePremise: true, pathLabel: 'data/forge_1.20.4/mappings/client.txt' }).failures);
  push(RED, 'A2 毒·药空的禁用式（永不匹配）被活性自证当场抓到', 'red',
    bannedRulesAliveFailures([{ id: 'crippled', re: /MaterialZZZNeverMatches/g, why: 'x', mustCatch: 'Material.STONE' }]));
  push(RED, 'A2 毒·禁用项丢了 mustCatch ⇒ 无法自证，判装饰', 'red',
    bannedRulesAliveFailures([{ id: 'no-sample', re: /\bMaterial\b/g, why: 'x' }]));

  /* ── ② 反退化断言：健康核的自证必须为绿；核一旦被改坏，这几条就地红 ── */
  push(DEG, '断·禁用式抓得住自己的 mustCatch（健康规则集零失败）', 'green', bannedRulesAliveFailures());
  push(DEG, '断·skip 不得被记成 pass（gateVerdict 的未核前提分支）', 'green', (() => {
    const v = gateVerdict({ failCount: 0, premiseChecked: false, testRoot: false, reledger: false });
    return v.label === 'pass-unverified-premise' ? [] : [`判据核退化：前提未核时 label 必须是 pass-unverified-premise，实为 ${v.label}`];
  })());
  push(DEG, '断·SKIP 行的措辞与判绿行可区分', 'green', (() => {
    const line = premiseSkipLine('data/forge_1.20.4/mappings/client.txt');
    const ok = line.includes('SKIPPED') && line.includes('不是判绿') && !/assert-forge-1204-material: ok/.test(line) && !line.includes('ok(block.material');
    return ok ? [] : ['SKIP 行缺少 SKIPPED/不是判绿 或与判绿行同形'];
  })());
  push(DEG, '断·RELEDGER 面仍算得出漂移（只打印≠不判）', 'green',
    ledgerDriftFailures({ ...LEDGER, propertiesOfNoArg: 3 }, LEDGER).length === 1 ? [] : ['漂移计算被掏空 ⇒ RELEDGER 会把回归洗成绿']);
  push(DEG, '断·五个环境变量钩子在本文件内都有读者（此前零 harness 消费者 = 装饰）', 'green', (() => {
    const src = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    const hooks = ['MC_SKILL_MAT_TEST_ROOT', 'MC_SKILL_MAT_RELEDGER', 'MC_SKILL_MAT_REQUIRE_PREMISE', 'MC_SKILL_MAT_CLIENT_TXT', 'MC_SKILL_MAT_GATE_INFO'];
    const dead = hooks.filter((h) => (src.split(h).length - 1) < 2);
    return dead.length ? [`钩子在本文件出现不足两次（声明了没人读）：${dead.join(',')}`] : [];
  })());
  push(DEG, '断·终判函数对真失败给 fail/exit 1', 'green', (() => {
    const v = gateVerdict({ failCount: 2, premiseChecked: true, testRoot: false, reledger: false });
    return v.label === 'fail' && v.exitCode === 1 ? [] : [`有失败时终判不是 fail/1，实为 ${v.label}/${v.exitCode}`];
  })());

  /* ── ③ 不判定的对照：必须全部判绿（没有它们，「投毒全红」本身证不了门不是恒红）── */
  push(CTL, '照·正解形态 Properties.of().mapColor(MapColor.STONE) 不判红', 'green',
    scanText('new Block(BlockBehaviour.Properties.of().mapColor(MapColor.STONE))', 'fixture').hits);
  push(CTL, '照·合法 ArmorMaterial / MyArmorMaterial 不被误伤', 'green',
    scanText('ArmorMaterial.IRON\nMyArmorMaterial.COPPER\n// items/MyArmorMaterial.java', 'fixture').hits);
  push(CTL, '照·正解计数在对照夹具里如实被数到（mapColor 1 / of() 无参 1）', 'green', (() => {
    const c = scanText('new Block(BlockBehaviour.Properties.of().mapColor(MapColor.STONE))', 'fixture').census;
    return c.mapColorCalls === 1 && c.propertiesOfNoArg === 1 ? [] : [`正解形态计数失效：${JSON.stringify(c)}`];
  })());
  push(CTL, '照·现盘台账逐字相等 ⇒ 零失败', 'green', ledgerDriftFailures({ ...LEDGER }, LEDGER));
  push(CTL, '照·合规映射文件（block.material=0 且 MapColor 在场）⇒ 零失败', 'green',
    premiseCheck({ exists: true, text: 'net.minecraft.world.level.material.MapColor -> eev:\n    62:65:STONE -> a\n', pathLabel: 'client.txt', requirePremise: false }).failures);
  push(CTL, '照·采集谓词判面对（源稿入选 / 投影与非源稿剪掉）', 'green', (() => {
    const bad = [];
    if (!entryScanned('02-block.mdc', false, path.join('a', '02-block.mdc'))) bad.push('.mdc 源稿被漏扫');
    if (!entryScanned('SKILL.md', false, 'SKILL.md')) bad.push('.md 源稿被漏扫');
    if (entryScanned('notes.txt', false, 'notes.txt')) bad.push('.txt 被当源稿');
    if (!entryScanned('knowledge', true, path.join('a', 'knowledge'))) bad.push('普通目录被剪掉');
    if (entryScanned('agent', true, path.join('.cursor', 'agent'))) bad.push('.cursor/agent 未剪枝');
    for (const d of ['.agents', '.claude', '.continue', '.opencode', '.pi', '.trae', '.zcode']) {
      if (entryScanned(d, true, path.join('fake', d))) bad.push(`IDE 投影 ${d} 被当源稿`);
    }
    return bad;
  })());
  push(CTL, '照·缺件但不强制 ⇒ 只跳过、零失败', 'green',
    premiseCheck({ exists: false, requirePremise: false, pathLabel: 'client.txt' }).failures);
  push(CTL, '照·零失败 + 前提已核 ⇒ 终判 pass 且 exit 0', 'green', (() => {
    const v = gateVerdict({ failCount: 0, premiseChecked: true, testRoot: false, reledger: false });
    return v.label === 'pass' && v.exitCode === 0 ? [] : [`合规盘面被判成 ${v.label}/${v.exitCode}`];
  })());

  const bad = [];
  const count = { [RED]: 0, [DEG]: 0, [CTL]: 0 };
  for (const c of cases) {
    const signal = Array.isArray(c.signal) ? c.signal : [];
    const caught = signal.length > 0;
    const ok = c.expect === 'red' ? caught : !caught;
    if (!ok) {
      bad.push([
        c.expect === 'red' ? `RED ${c.bucket}·投毒未判红（本 gate 是装饰）` : `${c.bucket === CTL ? 'GREEN 照' : 'RED 断'}·判据核退化 / 对照被误伤`,
        c.name, signal.join(' | '),
      ]);
    } else count[c.bucket]++;
  }
  console.log(`    assert-forge-1204-material --selftest: ${cases.length} 例（${count[RED]} 投毒必红 + ${count[DEG]} 反退化断言 + ${count[CTL]} 正对照），腿 = A1 采集 / A2 禁用形态 / A3 假绿兜底 / B 台账 / B 前提`);
  if (bad.length) {
    console.log(`    assert-forge-1204-material --selftest: ${bad.length} 例失效`);
    for (const [kind, name, why] of bad) console.log(`      ${kind} :: ${name}${why ? ' :: ' + why : ''}`);
    process.exit(1);
  }
  // 三桶地板（跑完再兜一次：`SELFTEST_GATES` 的循环只看 rc，例数被掏空它看不见）
  if (count[RED] < FLOOR_POISON || count[DEG] < FLOOR_ANTIDEG || count[CTL] < FLOOR_CONTROL) {
    console.log(`    assert-forge-1204-material --selftest: 三桶计数 ${count[RED]}/${count[DEG]}/${count[CTL]} 低于地板 ${FLOOR_POISON}/${FLOOR_ANTIDEG}/${FLOOR_CONTROL} ⇒ 判据面变薄`);
    process.exit(1);
  }
  console.log(`    assert-forge-1204-material --selftest: ok（${count[RED]} 投毒全部判红 · ${count[DEG]} 反退化断言全部成立 · ${count[CTL]} 对照全部判绿）`);
  process.exit(0);
}
if (process.argv.includes('--selftest')) runSelftest();

/* ── live run ──────────────────────────────────────────────────────────── */

const failures = [];
const fail = (msg) => failures.push(msg);
const rel = (p) => path.relative(REPO_ROOT, p).split(path.sep).join('/');
const relPack = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const PACK_LABEL = PACK_REL.split(path.sep).join('/');

const packDir = path.join(ROOT, PACK_REL);
if (!fs.existsSync(packDir)) {
  console.error(`assert-forge-1204-material: 档目录不存在 ${relPack(packDir)}（根=${rel(ROOT) || '.'}）`);
  process.exit(1);
}

const files = collectInto(packDir, []);
files.sort();

const hits = [];
const census = { filesScanned: files.length, bannedHits: 0, armorDotExempt: 0, mapColorCalls: 0, propertiesOfNoArg: 0 };

// ── A. 内容层 ───────────────────────────────────────────────────────────
for (const file of files) {
  const one = scanText(fs.readFileSync(file, 'utf8'), relPack(file));
  hits.push(...one.hits);
  census.bannedHits += one.census.bannedHits;
  census.armorDotExempt += one.census.armorDotExempt;
  census.mapColorCalls += one.census.mapColorCalls;
  census.propertiesOfNoArg += one.census.propertiesOfNoArg;
}

for (const h of hits) fail(h);
for (const f of collectorFloorFailures(census.filesScanned, rel(ROOT) || '.', PACK_LABEL)) fail(f);
for (const f of bannedRulesAliveFailures()) fail(`判据自证：${f}`);

// ── B. 台账层 ───────────────────────────────────────────────────────────
let premiseNote = 'skipped(test-root)';
let premiseChecked = false;
if (!TEST_ROOT) {
  const got = {
    filesScanned: census.filesScanned,
    bannedHits: census.bannedHits,
    armorDotExempt: census.armorDotExempt,
    mapColorCalls: census.mapColorCalls,
    propertiesOfNoArg: census.propertiesOfNoArg,
  };
  if (RELEDGER) {
    console.log('  [reledger] 台账重算（把下面的数抄回 LEDGER 常量再提交）：');
    console.log(`    const LEDGER = ${JSON.stringify(got, null, 2).replace(/\n/g, String.fromCharCode(10) + '    ')};`);
    console.log(`    本轮未判的台账漂移 ${ledgerDriftFailures(got, LEDGER).length} 项（RELEDGER 只打印、不改写本文件）`);
  } else {
    for (const f of ledgerDriftFailures(got, LEDGER)) fail(f);
  }

  // 前提复核：官方 1.20.4 映射里方块 Material 包必须仍然不存在，MapColor 必须仍然在。
  // S16-6（2026-09-24）：原来「文件不在场」只把 premiseNote 改成字符串就继续报 ok —— 而
  // `data/**/mappings/client.txt` 被 .gitignore 排除（实测 `git check-ignore -v` → `.gitignore:50`，
  // Mojang 映射不许再分发）⇒ **干净克隆上这条腿永远不跑**，「前提被推翻必红」成了只在有该文件的
  // 机器上成立的保证。现三态明说 + 可强制（S16/t9 后：三态全在 `premiseCheck` 判定核里，并被
  // `--selftest` 逐态投毒；本块与自检吃同一函数 ⇒ 改坏任一态，自检当场红）：
  //   · 在场 → 照旧复核（判据一字未动，未削弱前提）；
  //   · 不在场 → 打一行 `[PREMISE] SKIPPED …不是通过` 并把它写进汇总行（显式跳过，不再冒充已核）；
  //   · `MC_SKILL_MAT_REQUIRE_PREMISE=1` → 不在场直接 fail（给自备映射的机器 / CI 用）。
  //   另有 `MC_SKILL_MAT_CLIENT_TXT=<path>` 换件钩子：给「文件缺失」和「前提被推翻」两条腿做投毒用。
  const clientTxt = process.env.MC_SKILL_MAT_CLIENT_TXT
    ? path.resolve(process.env.MC_SKILL_MAT_CLIENT_TXT)
    : path.join(ROOT, 'data', 'forge_1.20.4', 'mappings', 'client.txt');
  const exists = fs.existsSync(clientTxt);
  const pr = premiseCheck({
    exists,
    text: exists ? fs.readFileSync(clientTxt, 'utf8') : '',
    requirePremise: REQUIRE_PREMISE,
    pathLabel: rel(clientTxt),
  });
  premiseChecked = pr.checked;
  premiseNote = pr.note;
  for (const f of pr.failures) fail(f);
  if (!exists && !REQUIRE_PREMISE) console.log(premiseSkipLine(rel(clientTxt)));
}

const verdict = gateVerdict({ failCount: failures.length, premiseChecked, testRoot: Boolean(TEST_ROOT), reledger: RELEDGER });

if (process.env.MC_SKILL_MAT_GATE_INFO === '1') {
  for (const h of hits) console.log(`  info: ${h}`);
  console.log(`  info: files=${census.filesScanned} 命中=${census.bannedHits} 合法Armor材质记号(豁免)=${census.armorDotExempt} mapColor=${census.mapColorCalls} of()无参=${census.propertiesOfNoArg} 前提=${premiseNote} 根=${rel(ROOT) || '.'} 判定=${verdict.label}`);
}

if (failures.length > 0) {
  console.error(
    `assert-forge-1204-material: ${failures.length} 项不通过（forge/1.20.4 源稿 ${census.filesScanned} 个文件 · ` +
      `残留方块 Material 形态 ${census.bannedHits} 处 · 台账 ${TEST_ROOT ? 'skipped(test-root)' : RELEDGER ? 'recomputed' : 'checked'}）`,
  );
  for (const f of failures.slice(0, 25)) console.error(`  ✗ ${f}`);
  if (failures.length > 25) console.error(`  …另有 ${failures.length - 25} 项`);
  process.exit(verdict.exitCode);
}

console.log(
  `  assert-forge-1204-material: forge/1.20.4 源稿 ${census.filesScanned} 个文件 · 方块 Material 形态 0 · ` +
    `正解 mapColor ${census.mapColorCalls} / of() 无参 ${census.propertiesOfNoArg} · ` +
    `台账 ${TEST_ROOT ? 'skipped(test-root)' : RELEDGER ? 'recomputed' : 'checked'} · 前提复核=${TEST_ROOT ? 'n/a' : premiseChecked ? 'yes' : 'NO（未复核，不是通过）'} · 前提 ${premiseNote} · 判定=${verdict.label}`,
);
