#!/usr/bin/env node
/**
 * assert-rule-ban-vs-example — 同档「禁令 vs 活围栏示范」一致性门（story S4 task 4 / 类一）。
 *
 * 钉的性质（方向无关）：**同一档内不得既把某种写法列为禁令、又在活围栏代码里示范它。**
 * 修「禁 A 又用 A」有两条合法路径 —— 把示范改成 B，或把禁令改准；本门只要求二者不再互斥，
 * 不规定往哪边走（所以判据不含「哪一侧才是对的」的任何假设）。
 *
 * 为什么新建而不是挂 `assert-rule-java-shapes.mjs`（2026-09-23 复核其 :92-95/:100-114/:118-141/:147-165）：
 *   那四条判据全是**同一文件内自洽**（super(null) / 近似名 / 构造实参 / 工厂方法引用），抓不到
 *   「禁令在 A 件、示范在 B 件」的跨文件互斥；且其采集面 `collectRuleFiles()` :170-184 只收
 *   `<平台>/<版本>/.cursor/rules/*.mdc`，**不读 skills/、不读 AGENTS.md**。`assert-forge-blockshape-family.mjs`
 *   是 forge-only 的「族 × 版本区间」形态表，把 neoforge 语义塞进去会污染它的口径 ⇒ 另建。
 *
 * ── 覆盖面（诚实标注，禁止读成「全面检查」）────────────────────────────────
 *   本门是**表驱动的回归守卫**：只钉 `PAIRS` 里逐条登记过的 (禁令 ↔ 示范面) 对。
 *   新缺陷要靠**人工新增登记**才会红；表外的档 / 表外的对**不判**。⇒ 它是回归守卫，**不是万能检测器**。
 *   为什么必须自带表（不能机器自动区分档级禁令 / 处方）：实测 2968 份文档里含禁令字样的行 7226 条、
 *   禁令文件 2763 份、其中同档还带 ```java 围栏的 277 份（`temp/ralph-20260922/scout-gate-and-projection.md` A9），
 *   且禁令与其针对的处方行之间**没有任何可机读的绑定线索** ⇒ 档级自动判定必然自我开火。
 *
 * 判据（三条，全部行级）：
 *   ① 禁令侧 = 锚点文件里「同时含 NEG 负例词 + `banHint` 串」的那一行；NEG 正则照抄
 *      `assert-skill-yarn-attest.mjs:69`（同行带 未核实/禁止/不得/零命中/… ⇒ 那是「告诉读者别写」）。
 *      锚点行不再含 NEG 或不再含 hint ⇒ 该对判为 `lifted`（禁令已改准 / 已挪走），**不判红**，
 *      但会计入采集面地板（见 R47），静默删禁令会撞地板。
 *   ② 示范侧 = 对面文件集内**围栏代码块（``` 成对块）里的行**，命中 `shape` 且不含 `shapeOk`
 *      且该行自身不含 NEG（围栏外的散文、以及「禁止写 X」这种教学行都不算示范）。
 *   ③ 禁令活 + 有示范 ⇒ 红，同时点名两侧 `file:line`。
 *
 * R47 采集面地板（形状照抄 `assert-forge-blockshape-family.mjs` :468-485）：
 *   采集为 0 ⇒ `[FLOOR-COLLECTOR]` 红（明写「这是采集器失效，不是代码干净」）；
 *   实扫**低于**地板 ⇒ `[FLOOR-LOW]` 红；**地板是下界 `<`，不是等式**（正常新增只会抬高计数）；
 *   汇总行**无条件**打印「扫文件 / 判行 / 拒 / 采集面 / 地板」五数。
 *
 * 用法：
 *   node scripts/assert-rule-ban-vs-example.mjs                 # 判红/绿
 *   node scripts/assert-rule-ban-vs-example.mjs --selftest      # 纯内存投毒（不落盘）
 *   node scripts/assert-rule-ban-vs-example.mjs --discover      # 只读普查：列出表外「禁令 ↔ 围栏示范」候选（不影响 rc）
 *   MC_SKILL_BVE_GATE_INFO=1  node scripts/assert-rule-ban-vs-example.mjs   # 打印每对锚点与示范命中
 *   MC_SKILL_BVE_TEST_ROOT=<假根> node scripts/assert-rule-ban-vs-example.mjs  # 换根（投毒用）
 *
 * 注：只读知识库源稿，不依赖 dist，不需要 npm run build。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, '..');
const REPO_ROOT = path.resolve(SERVER_ROOT, '..');
const TEST_ROOT = process.env.MC_SKILL_BVE_TEST_ROOT;
const ROOT = TEST_ROOT ? path.resolve(TEST_ROOT) : REPO_ROOT;
const INFO = process.env.MC_SKILL_BVE_GATE_INFO === '1';

/** 行级负例正则 —— 照抄 mcp-server/scripts/assert-skill-yarn-attest.mjs:69，勿改口径。 */
export const NEG = /未核实|禁止|不得|零命中|没有|无源|不写|另一套|别的版本|勿抄/;

/**
 * 两条腿各自过一次行级 NEG（禁令腿 = 「必须含 NEG 才算禁令」；示范腿 = 「含 NEG 就不算示范」）。
 * 拆成两个钩子只为让 --selftest 能单独把一条腿改瞎（ST5b），证明 NEG 不是装饰。
 */
export const HOOKS = {
  ban: (line) => NEG.test(line),
  demo: (line) => NEG.test(line),
};

/**
 * 登记表：每条形如 { 档, 禁令锚点 file+line+hint, 被禁形态正则, 允许示范的对面文件集 }。
 * line 只是**位置提示**（挪位由 hint 全文重找兜住）；判据以「NEG ∧ hint」的行为准。
 */
export const PAIRS = [
  {
    id: 'neoforge-26.1-bare-properties',
    pack: 'neoforge/26.1',
    why: '01-registry 明令禁止把裸 `BlockBehaviour.Properties.of()` 当 `registerSimpleBlock` 第二参，示范面须跟 Supplier/UnaryOperator（本档 scaffold/ExampleMod.java:36 即 unary；语料 `blocks.md:296/:304` 只列这两态，`advanced_featureflags.md:112` 仍出现裸形态 ⇒ 见 01-registry:12 的括注口径）',
    ban: { file: 'neoforge/26.1/.cursor/rules/01-registry.mdc', line: 12, hint: '裸 Properties' },
    shape: /(?<![\w$.])(?:BlockBehaviour\.)?Properties\s*\.\s*of\s*\(\s*\)/,
    shapeOk: /->\s*(?:BlockBehaviour\.)?Properties\s*\.\s*of\s*\(\s*\)/,
    examples: [
      'neoforge/26.1/.cursor/rules/02-block.mdc',
      'neoforge/26.1/.cursor/skills/mc-registry/SKILL.md',
    ],
  },
  {
    id: 'neoforge-26.1-simplechannel',
    pack: 'neoforge/26.1',
    why: '06-networking:28 与 05-events:14 明令禁止 Forge `SimpleChannel`（26.1 走 Payload），示范面不得出现该类的构造/调用',
    ban: { file: 'neoforge/26.1/.cursor/rules/06-networking.mdc', line: 28, hint: 'SimpleChannel' },
    shape: /(?<![\w$.])SimpleChannel\s*[.(]/,
    examples: [
      'neoforge/26.1/.cursor/rules/02-block.mdc',
      'neoforge/26.1/.cursor/rules/05-events.mdc',
      'neoforge/26.1/.cursor/rules/08-client-server.mdc',
      'neoforge/26.1/.cursor/skills/mc-networking/SKILL.md',
      'neoforge/26.1/.cursor/skills/mc-blockentity/SKILL.md',
    ],
  },
  {
    id: 'neoforge-26.1-addonplugin-ctor',
    pack: 'neoforge/26.1',
    why: '01-registry:27 / 00-project-setup:42 明令禁止 `NeoForgeAddonPlugin`（本档入口是 `@Mod` + ModContainer 构造参数）',
    ban: { file: 'neoforge/26.1/.cursor/rules/01-registry.mdc', line: 27, hint: 'NeoForgeAddonPlugin' },
    shape: /(?<![\w$.])NeoForgeAddonPlugin\b/,
    examples: [
      'neoforge/26.1/.cursor/rules/00-project-setup.mdc',
      'neoforge/26.1/.cursor/rules/09-anti-patterns.mdc',
      'neoforge/26.1/.cursor/skills/mc-registry/SKILL.md',
      'neoforge/26.1/.cursor/skills/mc-datagen/SKILL.md',
    ],
  },
  {
    id: 'neoforge-12110-registryobject',
    pack: 'neoforge/1.21.10',
    why: '03-item:13 明令禁止把 Forge `RegistryObject<Item>` 当本档持有类型（本档 = DeferredItem/DeferredBlock）',
    ban: { file: 'neoforge/1.21.10/.cursor/rules/03-item.mdc', line: 13, hint: 'RegistryObject' },
    shape: /(?<![\w$.])RegistryObject\s*<[A-Za-z_$]/,
    examples: [
      'neoforge/1.21.10/.cursor/rules/01-registry.mdc',
      'neoforge/1.21.10/.cursor/rules/03-item.mdc',
      'neoforge/1.21.10/.cursor/rules/02-block.mdc',
      'neoforge/1.21.10/.cursor/skills/mc-registry/SKILL.md',
      'neoforge/1.21.10/.cursor/skills/mc-item/SKILL.md',
    ],
  },
  {
    // B7（2026-09-25）：把「同面两名并存」的 FLUIDTYPES 形从表外收进表内 ——
    // 判据源 = L6 已闭环裁定（两 build 全分母互证：1.18.2 无 FLUIDTYPES 也无 FLUID_TYPES，流体 = FLUIDS）。
    // 形状不同处：禁的不是「跨 loader 类」而是「本档不存在的注册表键名」（含写法变体 FLUID_TYPES）。
    id: 'forge-1182-fluidtypes-ban',
    pack: 'forge/1.18.2',
    why: 'mc-fluid SKILL:22 明令「不要 ForgeRegistries.FLUIDTYPES」（本档没有 FluidType；L6 裁定：FLUIDTYPES 与 FLUID_TYPES 在 1.18.2 都不存在，流体走 ForgeRegistries.FLUIDS，出处 = 40.1.80 sources.jar 逐字 + 40.3.12 javap 全分母）⇒ 同档围栏不得再示范这两个键名',
    ban: { file: 'forge/1.18.2/.cursor/skills/mc-fluid/SKILL.md', line: 22, hint: 'FLUIDTYPES' },
    shape: /(?<![\w$.])(?:ForgeRegistries\.)?(?:FLUIDTYPES|FLUID_TYPES)\b/,
    examples: [
      'forge/1.18.2/.cursor/skills/mc-fluid/SKILL.md',
      'forge/1.18.2/knowledge/antipatterns/registry.md',
      'forge/1.18.2/knowledge/porting/01-api-cross-loader.md',
    ],
  },
];

/**
 * 采集面地板（R47）。口径与 as-of 随值注明：
 *   filesMin —— 表内出现过的**去重文件数**（禁令锚点 + 对面文件集），按 ROOT 真读到的件数；
 *     as-of 2026-09-23 实扫 = 16 件（`node scripts/assert-rule-ban-vs-example.mjs` 汇总行「扫文件=16」；
 *     地板取 12，留出「人工删对/并档」的余量，**不是**等式棘轮）。
 *   bansMin —— 表内**活禁令**数（锚点文件里确实存在「NEG ∧ hint」行）；
 *     as-of 2026-09-23 实扫 = 4/4（`--selftest` 的 ST3 另证地板是下界：实扫高于地板仍绿）。
 *   两者都取**低于实扫**的下界（不是等式），避免「等式棘轮」型假绿/假红。
 */
export const FLOORS = { filesMin: 12, bansMin: 3 };

/** ``` 成对围栏块内的行（含行号，1 起）；块外散文不算示范。 */
export function fenceLines(text) {
  const lines = String(text).split(String.fromCharCode(10));
  const out = [];
  let open = false;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].replace(/\r$/, '');
    if (/^\s*(```|~~~)/.test(raw)) {
      open = !open;
      continue;
    }
    if (open) out.push({ no: i + 1, line: raw });
  }
  return out;
}

/** 定位活禁令：锚点行附近（±8）优先，退化到全文；必须同时含 NEG 与 hint。 */
export function findBan(text, ban) {
  const lines = String(text).split(String.fromCharCode(10));
  const near = Math.max(0, (ban.line || 1) - 1 - 8);
  const order = [];
  for (let i = near; i < Math.min(lines.length, near + 17); i++) order.push(i);
  for (let i = 0; i < lines.length; i++) if (!order.includes(i)) order.push(i);
  for (const i of order) {
    const l = lines[i].replace(/\r$/, '');
    if (!HOOKS.ban(l) || !l.includes(ban.hint)) continue;
    return { no: i + 1, text: l.trim().slice(0, 140) };
  }
  return null;
}

/**
 * 纯判定腿（--selftest 与真跑共用）。
 * @param pairs   登记表
 * @param floors  {filesMin,bansMin}
 * @param read    (rel) => text | null（null = 文件读不到）
 */
export function judge(pairs, floors, read) {
  const conflicts = [];
  const lifted = [];
  const faceFiles = new Set();
  for (const p of pairs) {
    faceFiles.add(p.ban.file);
    for (const f of p.examples) faceFiles.add(f);
  }
  const texts = new Map();
  let missing = 0;
  for (const rel of [...faceFiles].sort()) {
    const t = read(rel);
    if (t == null) {
      missing++;
      continue;
    }
    texts.set(rel, t);
  }
  let judged = 0;
  for (const t of texts.values()) judged += t.split(String.fromCharCode(10)).length;

  for (const p of pairs) {
    const banText = texts.get(p.ban.file);
    if (banText == null) {
      lifted.push({ id: p.id, reason: '禁令锚点文件读不到' });
      continue;
    }
    const ban = findBan(banText, p.ban);
    if (!ban) {
      lifted.push({ id: p.id, reason: `锚点 ${p.ban.file} 内已无「NEG ∧ ${JSON.stringify(p.ban.hint)}」行（禁令改准或挪位 ⇒ 该对不再判，计入地板）` });
      continue;
    }
    for (const rel of p.examples) {
      const t = texts.get(rel);
      if (t == null) continue;
      for (const fl of fenceLines(t)) {
        if (HOOKS.demo(fl.line)) continue;
        if (p.shapeOk && p.shapeOk.test(fl.line)) continue;
        if (!p.shape.test(fl.line)) continue;
        conflicts.push({ id: p.id, pack: p.pack, ban: `${p.ban.file}:${ban.no}`, banText: ban.text, demo: `${rel}:${fl.no}`, demoText: fl.line.trim().slice(0, 140) });
      }
    }
  }

  const scanned = texts.size;
  const liveBans = pairs.length - lifted.length;
  const floorTrips = [];
  if (scanned === 0) {
    floorTrips.push({ kind: 'COLLECTOR', msg: `[FLOOR-COLLECTOR] 采集面 扫文件=0 —— 这是**采集器失效**（换错根 / 表内路径写错 / 档被搬走），不是代码干净（地板 地板≥${floors.filesMin}；口径见 FLOORS 注释与 as-of）` });
  } else if (scanned < floors.filesMin) {
    floorTrips.push({ kind: 'LOW', msg: `[FLOOR-LOW] 扫文件=${scanned} < 地板 ${floors.filesMin}（口径：PAIRS 去重文件在 ROOT 真读到件数；as-of 2026-09-23）` });
  }
  if (scanned > 0 && liveBans === 0) {
    floorTrips.push({ kind: 'COLLECTOR', msg: `[FLOOR-COLLECTOR] 采集面 活禁令=0（登记 ${pairs.length} 对）—— 这是**采集器失效**（NEG 正则改瞎 / hint 串全部失配 / 禁令被静默删除），不是代码干净（地板 ≥${floors.bansMin}；as-of 2026-09-23）` });
  } else if (liveBans > 0 && liveBans < floors.bansMin) {
    floorTrips.push({ kind: 'LOW', msg: `[FLOOR-LOW] 活禁令=${liveBans} < 地板 ${floors.bansMin}（口径：表内「NEG ∧ hint」锚点行仍存在的对数；as-of 2026-09-23）` });
  }
  return { conflicts, lifted, scanned, missing, judged, liveBans, floorTrips, pairs: pairs.length };
}

function relOf(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

/** --discover：只读普查表外候选（不影响 rc），供人工决定要不要新增登记。 */
function discover() {
  const roots = ['neoforge', 'fabric', 'quilt', 'liteloader', 'rift', 'modloader', 'bedrock'];
  let banLines = 0;
  let candidates = 0;
  let packs = 0;
  for (const plat of roots) {
    const platDir = path.join(ROOT, plat);
    if (!fs.existsSync(platDir)) continue;
    const packDirs = [platDir, ...fs.readdirSync(platDir, { withFileTypes: true }).filter((e) => e.isDirectory() && /^\d/.test(e.name)).map((e) => path.join(platDir, e.name))];
    for (const packDir of packDirs) {
      const cur = path.join(packDir, '.cursor');
      if (!fs.existsSync(cur)) continue;
      const files = [];
      (function walk(d) {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
          const p = path.join(d, e.name);
          if (e.isDirectory()) walk(p);
          else if (/\.(mdc|md)$/.test(e.name) && !/^\.(agents|claude|continue|opencode|pi|trae|zcode)/.test(path.relative(cur, p))) files.push(p);
        }
      })(cur);
      const fences = [];
      const bans = [];
      for (const f of files) {
        const text = fs.readFileSync(f, 'utf8');
        for (const fl of fenceLines(text)) {
          for (const m of fl.line.matchAll(/(?<![\w$.])([A-Z][A-Za-z0-9_$]{5,})\s*(?:[.(<]|::)/g)) {
            if (!isNeg(fl.line)) fences.push({ rel: relOf(f), no: fl.no, name: m[1] });
          }
        }
        const lines = text.split(String.fromCharCode(10));
        for (let i = 0; i < lines.length; i++) {
          const l = lines[i].replace(/\r$/, '');
          if (!isNeg(l)) continue;
          for (const m of l.matchAll(/`([A-Z][A-Za-z0-9_$]{5,})`/g)) bans.push({ rel: relOf(f), no: i + 1, name: m[1] });
        }
      }
      let local = 0;
      for (const b of bans) {
        for (const fz of fences) {
          if (fz.rel === b.rel && fz.no === b.no) continue;
          if (fz.name !== b.name) continue;
          local++;
          candidates++;
          if (local <= 5) console.log(`  cand ${b.rel}:${b.no} [${b.name}] ↔ 围栏 ${fz.rel}:${fz.no}`);
        }
      }
      banLines += bans.length;
      if (local) packs++;
      console.log(`  ${relOf(packDir)}: 禁令候选行 ${bans.length} / 围栏标识符 ${fences.length} / 交叉 ${local}`);
    }
  }
  console.log(`assert-rule-ban-vs-example(discover 只读普查): 平台档扫描面见上；交叉候选 ${candidates} 条 / 有候选的档 ${packs} —— 候选须人工裁定后才能进 PAIRS，本输出不参与 rc`);
}

function selftest() {
  const F = { filesMin: 2, bansMin: 2 };
  /** 夹具假根：{rel: text} ⇒ judge 需要的 read(rel)。 */
  const mk = (o) => {
    const m = new Map(Object.entries(o));
    return (rel) => (m.has(rel) ? m.get(rel) : null);
  };
  const BAN_A = 'neoforge/X/.cursor/rules/01-registry.mdc';
  const DEMO_B = 'neoforge/X/.cursor/rules/02-block.mdc';
  const banText = [
    '# 01',
    '',
    '```java',
    '    BLOCKS.registerSimpleBlock("d", () -> BlockBehaviour.Properties.of().mapColor(MapColor.STONE));',
    '    // 禁止裸 Properties（那是 1.21.1 重载）。',
    '```',
  ].join(String.fromCharCode(10));
  const demoBare = [
    '# 02',
    '',
    '```java',
    '    BLOCKS.registerBlock(',
    '        "d",',
    '        Block::new,',
    '        BlockBehaviour.Properties.of().mapColor(MapColor.STONE));',
    '```',
  ].join(String.fromCharCode(10));
  const demoSupplier = demoBare.replace('        BlockBehaviour.Properties.of()', '        () -> BlockBehaviour.Properties.of()');
  /** 裸形态只出现在「围栏外散文」+「围栏内带『禁止写』的教学行」⇒ 正常口径下零示范。 */
  const demoTeach = [
    '# 02',
    '',
    '正文里提到 BlockBehaviour.Properties.of() 这个名字（围栏外）。',
    '',
    '```java',
    '    // 禁止写 BlockBehaviour.Properties.of()（裸形态）',
    '```',
  ].join(String.fromCharCode(10));
  const pair = {
    id: 't-bare-properties',
    pack: 'neoforge/X',
    why: 'fixture',
    ban: { file: BAN_A, line: 5, hint: '裸 Properties' },
    shape: /(?<![\w$.])(?:BlockBehaviour\.)?Properties\s*\.\s*of\s*\(\s*\)/,
    shapeOk: /->\s*(?:BlockBehaviour\.)?Properties\s*\.\s*of\s*\(\s*\)/,
    examples: [DEMO_B],
  };

  const cases = [
    {
      // ① 表内一对「禁令 + 活围栏示范」⇒ 红并点名两侧
      name: 'ST1 禁令活 + 围栏示范裸形态 ⇒ 红并点名两侧',
      r: judge([pair, pair], F, mk({ [BAN_A]: banText, [DEMO_B]: demoBare })),
      want: (r) => r.conflicts.length === 2 && r.conflicts[0].ban === `${BAN_A}:5` && r.conflicts[0].demo === `${DEMO_B}:7` && r.liveBans === 2,
    },
    {
      // ② 把示范改成 Supplier 形态（与禁令一致）⇒ 绿
      name: 'ST2 示范改 Supplier（与禁令一致）⇒ 零冲突',
      r: judge([pair], F, mk({ [BAN_A]: banText, [DEMO_B]: demoSupplier })),
      want: (r) => r.conflicts.length === 0 && r.liveBans === 1,
    },
    {
      // ③「517+50 型」：实扫**高于**地板 ⇒ 仍绿（证地板是下界 `<` 而非等式）
      name: 'ST3 实扫高于地板（活禁令 5 > 地板 2）⇒ 仍绿（证地板是下界 < 而非等式）',
      r: judge([pair, pair, pair, pair, pair], { filesMin: 2, bansMin: 2 }, mk({ [BAN_A]: banText, [DEMO_B]: demoSupplier })),
      want: (r) => r.liveBans === 5 && r.floorTrips.length === 0 && r.conflicts.length === 0,
    },
    {
      // ④ 采集面塌成 0 ⇒ [FLOOR-COLLECTOR]
      name: 'ST4a 采集面文件全读不到 ⇒ [FLOOR-COLLECTOR]（扫文件 0）',
      r: judge([pair], F, mk({})),
      want: (r) => r.scanned === 0 && r.floorTrips.some((t) => t.kind === 'COLLECTOR'),
    },
    {
      name: 'ST4b 禁令行全部失配（hint 改瞎 / 静默删禁令）⇒ [FLOOR-COLLECTOR]（活禁令 0）',
      r: judge([pair], F, mk({ [BAN_A]: banText.replace('禁止裸 Properties', '本档属性写法'), [DEMO_B]: demoSupplier })),
      want: (r) => r.liveBans === 0 && r.floorTrips.some((t) => t.kind === 'COLLECTOR' && t.msg.includes('活禁令=0')),
    },
    {
      // ⑤ 删掉禁令行的「禁止」二字 ⇒ 它被当处方 ⇒ 判定必须改变（行级 NEG 真在工作）
      name: 'ST5 同一示范 + 禁令行删掉「禁止」二字 ⇒ 不再判红（NEG 行级判据在工作）',
      r: judge([pair], F, mk({ [BAN_A]: banText.replace('// 禁止裸 Properties', '// 也可裸 Properties（那是 1.21.1 重载）'), [DEMO_B]: demoBare })),
      want: (r) => r.conflicts.length === 0 && r.liveBans === 0 && r.lifted.length === 1,
    },
    {
      name: 'ST5b 示范腿 NEG 过滤改瞎 ⇒ 同一条「禁止写 …」教学行必须从绿变红（反证行级 NEG 不是装饰）',
      r: (function () {
        const saved = HOOKS.demo;
        HOOKS.demo = () => false;
        const out = judge([pair], F, mk({ [BAN_A]: banText, [DEMO_B]: demoTeach }));
        HOOKS.demo = saved;
        return out;
      })(),
      want: (r) => r.conflicts.length === 1 && r.liveBans === 1,
    },
    {
      // 附加：围栏外散文不算示范；围栏内带 NEG 的「禁止写 X」教学行也不算示范（= ST5b 的对照组）
      name: 'ST6 裸形态只出现在围栏外散文 / 带「禁止」的教学行 ⇒ 零冲突',
      r: judge([pair], F, mk({ [BAN_A]: banText, [DEMO_B]: demoTeach })),
      want: (r) => r.conflicts.length === 0 && r.liveBans === 1,
    },
  ];

  let passed = 0;
  for (const c of cases) {
    const ok = c.want(c.r);
    if (ok) passed++;
    else {
      console.error(`  ✗ ${c.name}`);
      console.error(`    冲突=${c.r.conflicts.length} 活禁令=${c.r.liveBans} 解除=${c.r.lifted.length} 扫文件=${c.r.scanned} 地板=${c.r.floorTrips.map((t) => t.kind).join(',') || '无'}`);
      for (const f of c.r.floorTrips) console.error(`    ${f.msg}`);
    }
  }
  console.log(`assert-rule-ban-vs-example(selftest): ${passed}/${cases.length}${passed === cases.length ? ` OK（${cases.filter((c) => c.r.conflicts.length > 0).length} 记投毒红 + 其余对照绿）` : ' 有例不符'}`);
  process.exitCode = passed === cases.length ? 0 : 1;
}

/** ST5b 用：钩子可被 selftest 临时改瞎（真跑不改）。 */
function isNeg(line) {
  return HOOKS.ban(line);
}

if (process.argv.includes('--selftest')) {
  selftest();
} else if (process.argv.includes('--discover')) {
  discover();
} else {
  const failures = [];
  const read = (rel) => {
    const p = path.join(ROOT, rel);
    try {
      return fs.readFileSync(p, 'utf8');
    } catch {
      return null;
    }
  };
  // judge 内部用模块级 NEG；这里直接跑（selftest 的 override 仅作用于 selftest 进程）
  const r = judge(PAIRS, FLOORS, read);
  const packs = new Set(PAIRS.map((p) => p.pack)).size;

  if (INFO) {
    for (const p of PAIRS) {
      const t = read(p.ban.file);
      const b = t == null ? null : findBan(t, p.ban);
      console.log(`  info ${p.id}: 禁令=${b ? `${p.ban.file}:${b.no}` : 'lifted'} 对面文件=${p.examples.length}`);
    }
    for (const c of r.conflicts) console.log(`  info 冲突 ${c.id}: ${c.ban} ↔ ${c.demo}`);
  }

  for (const f of r.floorTrips) failures.push(f.msg);
  for (const c of r.conflicts) {
    failures.push(`${c.demo} [${c.id}] 示范了同档禁令形态：${c.demoText}  —— 禁令在 ${c.ban}：${c.banText}  —— ${c.pack} 的 ${PAIRS.find((p) => p.id === c.id)?.why ?? ''}`);
  }
  if (r.missing) failures.push(`登记表内 ${r.missing} 个文件读不到（路径写错 / 档被搬走 ⇒ 必须显式重签登记表，不许静默少扫）`);

  // 汇总行：无条件打印五数（扫文件 / 判行 / 拒 / 采集面 / 地板）+ 覆盖面诚实标注
  const summary =
    `汇总 扫文件=${r.scanned} 判行=${r.judged} 拒=${r.conflicts.length} ` +
    `采集面=活禁令 ${r.liveBans}/登记对 ${r.pairs} 地板=文件≥${FLOORS.filesMin} 且 活禁令≥${FLOORS.bansMin}`;
  const coverage =
    `覆盖面：表内 ${PAIRS.length} 对 / 判 ${packs} 档 / 被扫文件 ${r.scanned}（登记表去重实际读到的件数）` +
    ` —— 这是**回归守卫**（钉住已登记的对 + 人工新增登记），**不是万能检测器**：表外的档、表外的对不判红。`;
  console.log(`  ${coverage}`);
  console.log(`  ${summary}（口径与 as-of 见 FLOORS 注释）`);

  if (failures.length) {
    console.error(`assert-rule-ban-vs-example: ${failures.length} 项不通过（根=${relOf(ROOT) || '.'}）`);
    for (const f of failures.slice(0, 20)) console.error(`  ✗ ${f}`);
    if (failures.length > 20) console.error(`  …另有 ${failures.length - 20} 项`);
    console.error(`  ${summary}`);
    process.exit(1);
  }
  console.log(
    `assert-rule-ban-vs-example: ok（表内 ${PAIRS.length} 对全绿：无「同档禁令 ↔ 活围栏示范」互斥；解除登记 ${r.lifted.length} 条）`,
  );
  for (const l of r.lifted) console.log(`  · lifted ${l.id}: ${l.reason}`);
}
