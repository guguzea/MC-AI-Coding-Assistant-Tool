#!/usr/bin/env node
/**
 * assert-forge-blockshape-family — `BlockBehaviour.Properties` **形态族 × 版本区间**门（sweep81 C-6）。
 *
 * 为什么存在（sweep80 §I 根因）：`Properties.of(Material)` 这一族的镜像面此前无人补门 ——
 * `assert-forge-1204-material.mjs` 只扫 **1.20.4**（「禁用 Material」方向），
 * `assert-forge-1182-registry-consts.mjs` 只扫 **1.18.2**（另一族：注册表常量下划线）。
 * 于是同一缺陷族的**反向**（1.18.2 / 1.19.4 用了本档不存在的**无参** `of()`）跨 70+ sweep 存活。
 * 本门把「族 × 区间、正反两面」一次性钉住：
 *
 *   A. `with-material` 区间（forge/1.18.2 · forge/1.19.4）
 *      本档 `of` 只有 4 个 `(Material…)` 重载、**无**无参 `()`；颜色方法叫 `.color(MaterialColor…)`。
 *      禁用：无参 `Properties.of()`、`.mapColor(`。
 *      正解计数（假绿兜底）：`of(Material.`、`.color(MaterialColor.`。
 *   B. `no-material` 区间（forge/1.20.1 · forge/1.20.4）
 *      本档 `Material` 类已被移除 ⇒ `of` 只有无参重载；颜色方法叫 `.mapColor(MapColor…)`。
 *      禁用：`Material.` 常量引用、`of/create(Material…)` 传参。
 *      正解计数（假绿兜底）：`Properties.of()`、`mapColor(`。
 *
 * 一手证据（复核命令，均在仓库根跑）：
 *   1. `query_api --className='BlockBehaviour$Properties'`：1.18.2 / 1.19.4 的 `of` = 4 个全 `(Material…)`、
 *      `mapColor` = 0；1.20.1 / 1.20.4 的 `of` = 1 个无参、`mapColor` = 3（分界在 1.20.1）。
 *   2. `data/forge_1.20.4/mappings/client.txt` 里 `block.material` = 0、`MapColor` 段存在。
 *   3. 同仓自述：`forge/1.20.1/knowledge/version-changes/1.20.x.md:36`「1.20+ 已移除 `Material`」。
 *
 * ── 两类**有意豁免**（都会打印计数，不静默跳过）──────────────────────────────
 *   ① **迁移指南目录**（`knowledge/version-changes/**`、`knowledge/porting/**`，包内相对路径判定）：
 *      它们讲的就是「怎么迁到目标版本」，出现目标版本形态（无参 `of()` / `.mapColor` / `Material.`）
 *      属**正当**。这正是 sweep80 R3「逐站裁定」口径的门面化。
 *   ② **具名合法提及台账**（`KNOWN_LEGIT`）：迁移对照表 / 「本档正解注释」这类**故意并列两个版本写法**
 *      的行，逐条登记 `rel + line + ruleId + 理由`；台账条目**失效即红**（防「豁免静默扩张 / 过期」）。
 *
 * 用法：
 *   node scripts/assert-forge-blockshape-family.mjs                        # 判红/绿
 *   node scripts/assert-forge-blockshape-family.mjs --selftest             # 纯内存投毒（不落盘）
 *   MC_SKILL_BLOCKS_RELEDGER=1 node scripts/assert-forge-blockshape-family.mjs   # 重算台账并打印
 *   MC_SKILL_BLOCKS_GATE_INFO=1 node scripts/assert-forge-blockshape-family.mjs  # 打印命中清单
 *   MC_SKILL_BLOCKS_TEST_ROOT=<假根> node scripts/assert-forge-blockshape-family.mjs  # 换根（投毒用）
 *
 * 注：只读知识库源稿，不依赖 dist，不需要 npm run build。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, '..');
const REPO_ROOT = path.resolve(SERVER_ROOT, '..');
const TEST_ROOT = process.env.MC_SKILL_BLOCKS_TEST_ROOT;
const ROOT = TEST_ROOT ? path.resolve(TEST_ROOT) : REPO_ROOT;
const RELEDGER = process.env.MC_SKILL_BLOCKS_RELEDGER === '1';
const INFO = process.env.MC_SKILL_BLOCKS_GATE_INFO === '1';

/** 7 份 IDE 投影 + `.cursor/agent`（同为投影）：只查源稿，一致性由 assert-skill-mirrors 保证。 */
const PROJECTION_DIRS = ['.agents', '.claude', '.continue', '.opencode', '.pi', '.trae', '.zcode'];
const SCAN_EXT = /\.(md|mdc|java|gradle)$/;
/** 豁免 ①：迁移指南 / 跨版本对照目录（**包内**相对路径前缀，不含 `<平台>/<版本>/` 段）。 */
const MIGRATION_DIRS = ['knowledge/version-changes', 'knowledge/porting'];

/**
 * 豁免 ②：具名合法提及台账（迁移对照表 / 本档正解注释 —— 故意并列两版写法）。
 * 每条断言「该处仍应命中该规则」；不再命中即红（过期/挪位必须显式重签）。
 */
const KNOWN_LEGIT = [
  {
    rel: 'forge/1.19.4/code-patterns/01-block-patterns.md',
    line: 15,
    id: 'mapcolor-call',
    why: '本档**正解注释**：说明 `.mapColor(MapColor…)` 是 1.20.x 才有的名字（教读者别用）',
  },
  {
    rel: 'forge/1.19.4/code-patterns/README.md',
    line: 37,
    id: 'mapcolor-call',
    why: 'block-patterns 索引的**跨版本对照表**：1.20 列写 `.mapColor(MapColor.STONE)`（表格本身就该并列两版）',
  },
  // ── C-1 阶段二三族的合法提及（2026-09-18 首跑门时逐处裁定）──
  {
    rel: 'forge/1.12.2/.cursor/rules/09-anti-patterns.mdc',
    line: 37,
    id: 'block-noarg',
    why: '反模式**标题**：教的是「未注册」缺陷，不是无参构造；正文示例是 `new Block(...)`',
  },
  {
    rel: 'forge/1.16.5/AGENTS.md',
    line: 25,
    id: 'archives-name-dsl',
    why: '钉值矛盾档案行：逐字记录 2026-09-11 的修复（`base { archivesName }` → 顶层 `archivesBaseName`）',
  },
  {
    rel: 'forge/1.16.5/knowledge/antipatterns/gradle.md',
    line: 97,
    id: 'archives-name-dsl',
    why: '取证边界段：故意并列 Gradle-7-only 构造，解释钉值自相矛盾（根因文档）',
  },
  {
    rel: 'forge/1.16.5/knowledge/antipatterns/gradle.md',
    line: 199,
    id: 'archives-name-dsl',
    why: '根因段：`base { archivesName }` 需要 Gradle 7+ 正是本档报错根因（根因文档）',
  },
  {
    rel: 'forge/1.16.5/knowledge/antipatterns/gradle.md',
    line: 204,
    id: 'archives-name-dsl',
    why: '❌ 形态示例块：展示「本包 2026-09-11 前的形态」供对照（根因文档）',
  },
  {
    rel: 'forge/1.16.5/scaffold/build.gradle',
    line: 11,
    id: 'archives-name-dsl',
    why: 'scaffold 注释：逐字解释为什么改用顶层 archivesBaseName（修复留痕本身）',
  },
];

const PACKS = [
  { pack: 'forge/1.18.2', kind: 'with-material' },
  { pack: 'forge/1.19.4', kind: 'with-material' },
  { pack: 'forge/1.20.1', kind: 'no-material' },
  { pack: 'forge/1.20.4', kind: 'no-material' },
  // ── C-1 阶段二（sweep81 收尾）：三族进同一「族 × 区间」框架 ──
  { pack: 'fabric/1.18.2', kind: 'no-fabrictooltags' },
  { pack: 'fabric/1.20.1', kind: 'no-fabrictooltags' },
  { pack: 'fabric/1.21.3', kind: 'no-fabrictooltags' },
  { pack: 'forge/1.12.2', kind: 'block-noarg-112' },
  { pack: 'fabric/1.14.4', kind: 'gradle6-no-archivesname' },
  { pack: 'forge/1.16.5', kind: 'gradle6-no-archivesname' },
];

/** 族判据：按 kind 取；`re` 逐行布尔判定（不带 g，避免 lastIndex 残留）。 */
const RULES = {
  'with-material': {
    banned: [
      {
        id: 'props-of-noarg',
        re: /Properties\s*\.\s*of\(\s*\)/,
        why: '1.18.2 / 1.19.4 的 `of` 只有 `(Material…)` 重载，无参 `of()` 不存在（分界在 1.20.1）',
      },
      {
        id: 'mapcolor-call',
        re: /\.\s*mapColor\s*\(/,
        why: '本档颜色方法叫 `.color(MaterialColor…)`；`.mapColor(MapColor…)` 是 1.20+ 的名字',
      },
    ],
    positive: [
      { id: 'ofWithMaterial', re: /Properties\s*\.\s*of\(\s*Material\b/g },
      { id: 'colorMaterialColor', re: /\.\s*color\s*\(\s*MaterialColor\b/g },
    ],
  },
  'no-material': {
    banned: [
      {
        id: 'material-constant',
        re: /(?<![A-Za-z0-9_$])Material\s*[.]\s*[A-Za-z_$]/,
        why: '方块 `Material` 常量在 1.20+ 已被移除；写 `Properties.of().mapColor(MapColor.X)`',
      },
      {
        id: 'material-factory-arg',
        re: /\b(?:of|create)\s*\(\s*Material\b/,
        why: '1.20+ 的 `of/create` 只接受无参形态；材质位改 `.mapColor(MapColor…)`',
      },
    ],
    positive: [
      { id: 'ofNoArg', re: /Properties\s*\.\s*of\(\s*\)/g },
      { id: 'mapColorCalls', re: /\.\s*mapColor\s*\(/g },
    ],
  },
  // C-1 阶段二族 1：`FabricToolTags`（fabric 1.18.2+ 幻影类）。
  // oracle（2026-09-18，两机制）：① 仓内 loader-api-summaries —— ≤1.17.1 fabric-api 在（1.14.4=7 /
  // 1.16.5=14 / 1.17.1=14），1.18.2 / 1.20.1 / 1.21.3 全 0；② 上游 —— maven.fabricmc.net javadoc
  // 0.45.0+1.18 起 `net.fabricmc.fabric.api.tools.FabricToolTags` 标 @Deprecated，
  // docs.fabricmc.net「工具和武器」口径 = 工具类别归原版物品标签（ItemTags.SWORDS/AXES 例）。
  'no-fabrictooltags': {
    banned: [
      {
        id: 'fabric-tooltags-removed',
        re: /FabricToolTags\s*\./,
        why: '`FabricToolTags` 已从 fabric-api 移除（≤1.17.1 在、1.18.2+ 摘要 0 命中；旧包 0.45+1.18 起 @Deprecated）；工具类别走原版物品标签（官方文档口径）',
      },
    ],
    positive: [
      { id: 'toolMaterialRef', re: /\bToolMaterial\b/g },
    ],
  },
  // C-1 阶段二族 2：`new Block()` 无参（forge/1.12.2 不存在该重载）。
  // oracle：本档正解 `new Block(Material.ROCK)`（.cursor/rules/01-registry.mdc:116/:162）+
  // knowledge/antipatterns/{registry,block}.md 全部带 Material；全仓 `new Block()` 无参 = 0 命中。
  'block-noarg-112': {
    banned: [
      {
        id: 'block-noarg',
        re: /(?<![\w$])new\s+Block\s*\(\s*\)/,
        why: '1.12.2 的 `Block` 构造没有无参重载（本档正解 `new Block(Material.ROCK)`，见 rules/01-registry.mdc）',
      },
    ],
    positive: [
      { id: 'blockWithMaterial', re: /new\s+Block\s*\(\s*Material\b/g },
    ],
  },
  // C-1 阶段二族 3：`base { archivesName }`（Gradle 7+ DSL）在 Gradle 6.x 档不可用。
  // oracle：fabric/1.14.4 wrapper 钉 6.9.4（gradle-wrapper.properties:3）且 pack.meta.json:19 记
  // 2026-09-16 真机 BUILD SUCCESSFUL（改用 archivesBaseName 后）；forge/1.16.5/scaffold/build.gradle:11-13
  // 注释逐字「FG4 硬拒 Gradle ≥7，而 base.archivesName 是 Gradle 7+ DSL（6.9.4 实测无此属性）」。
  // 注意：forge/1.15.2 wrapper = Gradle 7.3.3，其 scaffold 用 archivesName 属合法 ⇒ 族按**档**枚举，
  // 不能按 MC 版本推断（与 with-material/no-material 的分界逻辑同源）。
  'gradle6-no-archivesname': {
    banned: [
      {
        id: 'archives-name-dsl',
        re: /(?<![A-Za-z0-9_$])archivesName\b/,
        why: 'Gradle 6.x（本档 wrapper 钉 6.9.4）没有 `base.archivesName`（Gradle 7+ DSL，6.9.4 实测 Could not find method base()）；用顶层 `archivesBaseName`',
      },
    ],
    positive: [
      { id: 'archivesBaseName', re: /\barchivesBaseName\b/g },
    ],
  },
};
/** `no-material` 的合法同名成员（`ArmorMaterial.IRON` …），不得被上条误伤。 */
const NO_MATERIAL_EXEMPT = /[A-Za-z0-9_$]Material\s*[.]\s*[A-Za-z_$]/g;

function collect(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    // `readdirSync(withFileTypes)` 对 junction/symlink 目录回报 isSymbolicLink() ⇒ TEST_ROOT 投毒
    // 基建（junction 假根）会被整棵跳过。真实仓库无 symlink，此处 statSync 只影响假根。
    const isDir = e.isDirectory() || (e.isSymbolicLink() && statIsDir(p));
    if (isDir) {
      if (PROJECTION_DIRS.includes(e.name)) continue;
      if (p.endsWith(path.join('.cursor', 'agent'))) continue;
      collect(p, out);
    } else if (SCAN_EXT.test(e.name)) {
      out.push(p);
    }
  }
}

function statIsDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

const failures = [];
const fail = (msg) => failures.push(msg);

/** 纯函数：一组 (rel, text) + kind ⇒ { bannedHits, hits[{rel,line,id}], positives, armorExempt }。 */
export function scanTexts(entries, kind) {
  const rules = RULES[kind];
  const out = { bannedHits: 0, hits: [], positives: {}, armorExempt: 0 };
  for (const pos of rules.positive) out.positives[pos.id] = 0;
  for (const { rel, text } of entries) {
    if (kind === 'no-material') out.armorExempt += (text.match(NO_MATERIAL_EXEMPT) || []).length;
    for (const pos of rules.positive) {
      out.positives[pos.id] += (text.match(new RegExp(pos.re.source, 'g')) || []).length;
    }
    const lines = text.split(String.fromCharCode(10));
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\r$/, '');
      for (const b of rules.banned) {
        if (!b.re.test(line)) continue;
        out.bannedHits++;
        out.hits.push({ rel, line: i + 1, id: b.id, text: line.trim().slice(0, 120) });
      }
    }
  }
  return out;
}

function relOf(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}
function relPackOf(packDir, p) {
  return path.relative(packDir, p).split(path.sep).join('/');
}

/** --selftest：纯内存投毒。每条 banned 规则喂应红样本 + 应绿对照。 */
function selftest() {
  const cases = [
    ['with-material', 'bad', '() -> new Block(BlockBehaviour.Properties.of())\n', 'props-of-noarg'],
    ['with-material', 'bad', '    .mapColor(MapColor.WOOD)\n', 'mapcolor-call'],
    ['with-material', 'good', 'Properties.of(Material.STONE).color(MaterialColor.STONE)\n', null],
    ['no-material', 'bad', 'BlockBehaviour.Properties.of(Material.STONE)\n', 'material-factory-arg'],
    ['no-material', 'bad', 'BlockBehaviour.Properties.of()\n    .mapColor(Material.STONE)\n', 'material-constant'],
    ['no-material', 'good', 'BlockBehaviour.Properties.of()\n    .mapColor(MapColor.STONE)\n', null],
    ['no-material', 'good', 'new Item(new Item.Properties(), ArmorMaterial.IRON)\n', null],
    ['no-fabrictooltags', 'bad', 'FabricToolTags.PICKAXES.contains(stack.getItem())\n', 'fabric-tooltags-removed'],
    ['no-fabrictooltags', 'good', 'COPPER(2, 250, 6.0f, 2.0f, 15, () -> Items.COPPER_INGOT);\n', null],
    ['block-noarg-112', 'bad', 'public static final Block B = new Block();\n', 'block-noarg'],
    ['block-noarg-112', 'good', 'EXAMPLE_BLOCK = new Block(Material.ROCK)\n', null],
    ['gradle6-no-archivesname', 'bad', 'base { archivesName = mod_id }\n', 'archives-name-dsl'],
    ['gradle6-no-archivesname', 'good', 'archivesBaseName = mod_id\n', null],
    // `archivesBaseName` 不得被 archivesName 规则误伤（子串不同名）
    ['gradle6-no-archivesname', 'good', 'archivesBaseName = project.archivesBaseName\n', null],
  ];
  let missed = 0;
  for (const [kind, want, text, id] of cases) {
    const r = scanTexts([{ rel: 'poison.md', text }], kind);
    const firedIds = r.hits.map((h) => h.id);
    const ok = want === 'bad' ? id !== null && firedIds.includes(id) : r.bannedHits === 0;
    if (!ok) {
      missed++;
      console.error(`  ✗ selftest ${kind} 期望${want === 'bad' ? `检出 ${id}` : '不误伤'}，实得 [${firedIds.join(',') || '无'}]：${JSON.stringify(text)}`);
    }
  }
  console.log(
    `\nassert-forge-blockshape-family(selftest): ${missed === 0 ? `OK（${cases.filter((c) => c[1] === 'bad').length} 例应红全检出 + ${cases.filter((c) => c[1] === 'good').length} 例应绿零误伤）` : missed + ' 例不符'}`,
  );
  process.exitCode = missed === 0 ? 0 : 1;
}

if (process.argv.includes('--selftest')) {
  selftest();
} else {
  const census = [];
  const allHits = [];
  for (const { pack, kind } of PACKS) {
    const packDir = path.join(ROOT, pack);
    if (!fs.existsSync(packDir)) {
      fail(`${pack}: 档目录不存在（根=${relOf(ROOT) || '.'}）`);
      continue;
    }
    const files = [];
    collect(packDir, files);
    files.sort();
    const entries = [];
    let migrationExempt = 0;
    for (const f of files) {
      const relInPack = relPackOf(packDir, f);
      if (MIGRATION_DIRS.some((d) => relInPack.startsWith(`${d}/`))) {
        migrationExempt++;
        continue;
      }
      entries.push({ rel: relOf(f), text: fs.readFileSync(f, 'utf8') });
    }
    const r = scanTexts(entries, kind);
    census.push({ pack, kind, scanned: entries.length, migrationExempt, ...r });
    if (entries.length === 0) fail(`${pack}: 被扫文件数 0（换错根 / 档被搬走不等于零缺陷）`);
    for (const [id, n] of Object.entries(r.positives)) {
      if (n === 0) fail(`${pack}: 正解形态 ${id} 计数为 0（示例被删空 / 正则改瞎 ⇒ 本门已瞎）`);
    }
    allHits.push(...r.hits);
    if (INFO || RELEDGER) {
      console.log(
        `  info ${pack} [${kind}] 扫=${entries.length}（豁免迁移指南 ${migrationExempt}）禁用命中=${r.bannedHits} ` +
          `正解=${Object.entries(r.positives).map(([k, v]) => `${k}:${v}`).join('/')}${kind === 'no-material' ? ` Armor 同名豁免=${r.armorExempt}` : ''}`,
      );
    }
  }

  // 台账 ② 双向对账：未登记的命中 = 红；登记了但不再命中 = 红（过期）
  const key = (h) => `${h.rel}:${h.line}:${h.id}`;
  const legitKeys = new Set(KNOWN_LEGIT.map((e) => `${e.rel}:${e.line}:${e.id}`));
  const hitKeys = new Set(allHits.map(key));
  let legitUsed = 0;
  for (const h of allHits) {
    if (legitKeys.has(key(h))) {
      legitUsed++;
      continue;
    }
    const rule = RULES[census.find((c) => h.rel.startsWith(c.pack.replace(/\\/g, '/')))?.kind ?? 'with-material'];
    const why = Object.values(RULES).flatMap((r) => r.banned).find((b) => b.id === h.id)?.why ?? rule;
    fail(`${h.rel}:${h.line}: [${h.id}] ${h.text}  —— ${why}`);
  }
  for (const e of KNOWN_LEGIT) {
    if (!hitKeys.has(`${e.rel}:${e.line}:${e.id}`)) {
      fail(`KNOWN_LEGIT 台账过期：${e.rel}:${e.line} 不再命中 [${e.id}]（挪位/删行/规则改瞎都要显式重签）`);
    }
  }

  if (RELEDGER) {
    console.log('\n[RELEDGER] 逐档实算（只打印，不改写台账）：');
    for (const c of census) {
      console.log(
        `  ${c.pack}: scanned=${c.scanned} migrationExempt=${c.migrationExempt} bannedHits=${c.bannedHits} positives=${JSON.stringify(c.positives)}`,
      );
    }
    console.log(
      `  合计：档 ${census.length} / 被扫 ${census.reduce((s, c) => s + c.scanned, 0)} / 豁免迁移指南 ${census.reduce((s, c) => s + c.migrationExempt, 0)} / ` +
        `禁用命中 ${census.reduce((s, c) => s + c.bannedHits, 0)}（其中 KNOWN_LEGIT 具名合法 ${legitUsed}）`,
    );
  }

  if (failures.length > 0) {
    console.error(
      `assert-forge-blockshape-family: ${failures.length} 项不通过（族=${Object.keys(RULES).length} 区间 / 档=${census.length} / ` +
        `被扫文件=${census.reduce((s, c) => s + c.scanned, 0)} / 台账 ${TEST_ROOT ? 'skipped(test-root)' : RELEDGER ? 'recomputed' : 'checked'}）`,
    );
    for (const f of failures.slice(0, 30)) console.error(`  ✗ ${f}`);
    if (failures.length > 30) console.error(`  …另有 ${failures.length - 30} 项`);
    process.exit(1);
  }
  console.log(
    `assert-forge-blockshape-family: ok（${census.length} 档 / 被扫文件 ${census.reduce((s, c) => s + c.scanned, 0)} · ` +
      `豁免迁移指南 ${census.reduce((s, c) => s + c.migrationExempt, 0)} 篇 + 具名合法提及 ${legitUsed} 处 · 禁用形态 0 · ` +
      `台账 ${TEST_ROOT ? 'skipped(test-root)' : RELEDGER ? 'recomputed' : 'checked'}）`,
  );
}
