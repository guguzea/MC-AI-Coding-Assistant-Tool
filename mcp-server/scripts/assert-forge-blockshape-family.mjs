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
  // kind 支持数组（同档多族，各族独立扫描记账）。W3（2026-09-19）新增两族：
  // networking-decoder-noctor（Request-Reply 示例，1.17.1–1.20.4）与
  // gui-clientsetup-needs-modbus（ClientSetup 注解，1.15.2–1.20.4 七档；
  // 1.13.2 不入 —— 其 08-client-server:120 KeyInputEvent 是游戏总线事件，无 bus 属合法）。
  { pack: 'forge/1.18.2', kind: ['with-material', 'gui-clientsetup-needs-modbus'] },
  { pack: 'forge/1.19.4', kind: ['with-material', 'networking-decoder-noctor', 'gui-clientsetup-needs-modbus'] },
  { pack: 'forge/1.20.1', kind: ['no-material', 'networking-decoder-noctor', 'gui-clientsetup-needs-modbus'] },
  { pack: 'forge/1.20.4', kind: ['no-material', 'networking-decoder-noctor', 'gui-clientsetup-needs-modbus'] },
  // ── C-1 阶段二（sweep81 收尾）：三族进同一「族 × 区间」框架 ──
  { pack: 'fabric/1.18.2', kind: 'no-fabrictooltags' },
  { pack: 'fabric/1.20.1', kind: 'no-fabrictooltags' },
  { pack: 'fabric/1.21.3', kind: 'no-fabrictooltags' },
  { pack: 'forge/1.12.2', kind: 'block-noarg-112' },
  { pack: 'fabric/1.14.4', kind: 'gradle6-no-archivesname' },
  { pack: 'forge/1.16.5', kind: ['gradle6-no-archivesname', 'gui-clientsetup-needs-modbus', 'props-receiver-1165'] },
  { pack: 'forge/1.17.1', kind: ['networking-decoder-noctor', 'gui-clientsetup-needs-modbus'] },
  { pack: 'forge/1.15.2', kind: 'gui-clientsetup-needs-modbus' },
  // S3（2026-09-23）：1.13.2 只挂映射通道族 —— 该档方块属性是 `Properties.create(Material)`，
  // 既非 with-material（1.18.2 区间的 of(Material)）也非 no-material（1.20+ 无参 of()）⇒ 不套那两族。
  { pack: 'forge/1.13.2', kind: 'mapping-channel-1132' },
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
  // W3-1（2026-09-19）：1.17.1–1.20.4「双向 Request-Reply」示例此前编译不过 ——
  // MyRequest 只有 (int)/() 构造器，decoder 位 `MyRequest::new` 解析不到 (FriendlyByteBuf)；
  // 且 handleRequest 是类外裸静态方法，注册却写 `MyRequest::handleRequest`（方法引用解析不到；
  // 正确对照 = 同文件 MyOpenGuiHandler::handle 独立 handler 类）。修复形态对齐 1.13.2 :103 正例：
  // 类内补 `MyRequest(FriendlyByteBuf)` 构造器 + handler 包进 `public static class MyRequestHandler`，
  // 注册行 `MyRequestHandler::handleRequest`。局限：逐行正则看不见跨行类型不匹配，
  // 钉的是撤回后的**回归形态**（类体缺 buf 构造器 + 裸 `MyRequest::handleRequest` 复活）。
  // 注意 banned 正则不误伤修复后的 `MyRequestHandler::handleRequest`（`Handler` 前缀中断匹配）。
  'networking-decoder-noctor': {
    banned: [
      {
        id: 'networking-handler-ref',
        re: /MyRequest\s*::\s*handleRequest/,
        why: '`handleRequest` 不在 MyRequest 类内（裸静态方法），`MyRequest::handleRequest` 方法引用解析不到；包进 handler 类写 `MyRequestHandler::handleRequest`，decoder 需类内 `MyRequest(FriendlyByteBuf)` 构造器（1.13.2 :103 正例）',
      },
    ],
    positive: [
      { id: 'requestBufCtor', re: /MyRequest\s*\(\s*FriendlyByteBuf\b/g },
    ],
  },
  // W3-2（2026-09-19）：七档 10-gui / mc-gui / 1.15.2 mc-entity·mc-particle·code-patterns 的
  // ClientSetup 订阅 FMLClientSetupEvent / RegistryEvent.Register（Mod 总线生命周期·注册事件），
  // 注解却缺 `bus = …Bus.MOD` ⇒ 默认 FORGE 总线，事件永远收不到。修复形态对齐 1.14.4:100 全称。
  // 1.13.2 不入本 kind：其 08-client-server:120 KeyInputEvent 是游戏总线事件（无 bus 属合法）。
  'gui-clientsetup-needs-modbus': {
    banned: [
      {
        id: 'clientsetup-no-modbus',
        re: /@Mod\.EventBusSubscriber\(modid = MOD_ID, value = Dist\.CLIENT\)/,
        why: 'FMLClientSetupEvent / RegistryEvent.Register 等生命周期·注册事件走 Mod 总线：注解缺 `bus = …Bus.MOD` ⇒ 默认 FORGE 总线收不到；对齐 1.14.4:100 形态 `bus = Mod.EventBusSubscriber.Bus.MOD`',
      },
    ],
    positive: [
      { id: 'busMod', re: /bus = (?:Mod\.)?EventBusSubscriber\.Bus\.MOD/g },
    ],
  },
  // ── S2（2026-09-23，story S2 task 3 的落点）：1.16.5 方块属性接收类 ─────────────────
  // R6：`assert-no-invalid-api-shapes.mjs:40-41` 明文拒绝版本区间判据并把这类改判转指本门。
  // 判据：本档 `of` 的宿主类**只有** `AbstractBlock.Properties`。
  // oracle（三机制互核，as-of 2026-09-23）：
  //   ① data/forge_1.16.5/extracted/class-names.json（3922 类全表）：
  //      `net/minecraft/block/AbstractBlock$Properties` = 在，`net/minecraft/block/Block$Properties` = 不在；
  //      同法反证 1.13.2 的 class-names.json **有** `Block$Properties` ⇒ 本族只挂 1.16.5，禁止推广。
  //   ② data/forge_1.16.5/forge-docs/1.16.5/raw/concepts_registries.md:30 逐字
  //      `new Block(AbstractBlock.Properties.of(Material.STONE))`（processed/:26 同句）；
  //      整个 data/forge_1.16.5 里裸 `Block.Properties` = 0 命中。
  //   ③ search_docs platform=forge version=1.16.5 query="AbstractBlock.Properties" ⇒
  //      verbatim_summary {judged:13, hits:5}，命中页 blocks_blocks / concepts_registries / items_items 均 verbatim=true。
  // 采集面地板（R47）口径 = 本包「非投影 + 非 knowledge/{version-changes,porting}」被扫文件内
  // `AbstractBlock.Properties.of(` 的匹配数；2026-09-23 修完 17 处后实扫 = 17 ⇒ 地板 17（**下界** `<`，
  // 新增合法样例只会抬高计数、不会假红）。
  'props-receiver-1165': {
    banned: [
      {
        id: 'block-props-receiver-1165',
        re: /(?<![\w$.])Block\.Properties\s*\.\s*of\s*\(/,
        why: '1.16.5 无 `Block.Properties` 类（class-names.json 实测 `Block$Properties` 不在 / `AbstractBlock$Properties` 在）；接收类写 `AbstractBlock.Properties.of(Material.X)`，语料逐字见 raw/concepts_registries.md:30',
      },
    ],
    positive: [
      { id: 'abstractPropsOf', re: /AbstractBlock\.Properties\s*\.\s*of\s*\(/g },
    ],
    floors: [
      { id: 'abstractPropsOf', min: 17, asof: '2026-09-23', what: 'forge/1.16.5 非投影非迁移目录被扫文件内 AbstractBlock.Properties.of( 匹配数（本轮修完 17 处后实扫）' },
    ],
  },
  // ── S3（2026-09-23）：forge/1.13.2 的 gradle.properties 形态不许把 `mcp` 当通道值 ──────
  // oracle：本包一手裁决 = scaffold/gradle.properties:13-15（:13 注明「Official MDK minecraft
  //   { mappings channel: 'snapshot', version: '20180921-1.13' }」，:14-15 即真值）
  //   + scaffold/build.gradle:26（该两属性正是喂 `mappings channel:` 的）
  //   + pack.meta.json:12（2026-09-11 真机 BUILD SUCCESSFUL 用的就是 snapshot / 20180921-1.13）
  //   + knowledge/porting/03-real-world-examples.md:23（官方 1.13.2-25.0.223 MDK 同值）。
  // 边界：`data/forge_1.13.2/forge-docs/**` 对 `mapping_channel` 零命中（本轮实测）⇒ 语料侧不裁决，
  //   本判据只钉「与本包实证工件一致」，**不断言** `mcp` 字符串在 FG 历史上不存在；
  //   MCP SRG 作为映射**家族名**的散文（如 00-project-setup.mdc:58）不受本判据约束。
  // 采集面地板（R47）：同上口径，2026-09-23 实扫 = 3（00-project-setup.mdc:47 + 同文件 :152 的 `mappings channel: 'snapshot'` DSL 行
  //   + scaffold/README_AI.md:40；`scaffold/gradle.properties:14` 也写 snapshot，但 SCAN_EXT 只收 md/mdc/java/gradle ⇒ 不在采集面）。
  'mapping-channel-1132': {
    banned: [
      {
        id: 'mapping-channel-mcp-1132',
        re: /mapping_channel\s*=\s*mcp\b|channel\s*:\s*['"]mcp['"]/,
        why: '本档 `mapping_channel` 真值 = `snapshot` / `mapping_version=20180921-1.13`（scaffold/gradle.properties:14-15 + build.gradle:26 + pack.meta.json:12 真机构建记录）；`mcp` 是 MCP SRG 映射家族名，不是 ForgeGradle 通道值',
      },
    ],
    positive: [
      { id: 'channelSnapshot', re: /mapping_channel\s*=\s*snapshot|channel\s*:\s*'snapshot'/g },
    ],
    floors: [
      { id: 'channelSnapshot', min: 2, asof: '2026-09-23', what: 'forge/1.13.2 非投影非迁移目录被扫文件内 snapshot 通道写法匹配数（rules 00 的 properties 围栏 + scaffold/README_AI）' },
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
  const out = { bannedHits: 0, hits: [], positives: {}, armorExempt: 0, judged: 0 };
  for (const pos of rules.positive) out.positives[pos.id] = 0;
  for (const { rel, text } of entries) {
    if (kind === 'no-material') out.armorExempt += (text.match(NO_MATERIAL_EXEMPT) || []).length;
    for (const pos of rules.positive) {
      out.positives[pos.id] += (text.match(new RegExp(pos.re.source, 'g')) || []).length;
    }
    const lines = text.split(String.fromCharCode(10));
    out.judged += lines.length;
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
    // W3-1：裸 `MyRequest::handleRequest`（handle 归属缺陷）必须咬住；修复形态不误伤
    ['networking-decoder-noctor', 'bad', '    MyRequest::handleRequest\n', 'networking-handler-ref'],
    ['networking-decoder-noctor', 'good', 'public MyRequest(FriendlyByteBuf buf) { this.data = buf.readInt(); }\n    MyRequestHandler::handleRequest\n', null],
    // 1.13.2 合法对照：显式 (PacketBuffer) 构造器 + `MyMessage::new` decoder 不入 banned
    ['networking-decoder-noctor', 'good', 'INSTANCE.registerMessage(id++, MyMessage.class, MyMessage::encode, MyMessage::new, (msg, ctx) -> msg.handle(ctx));\n', null],
    // W3-2：缺 bus 的 ClientSetup 注解必须咬住（含缩进变体）；1.14.4 全称形态不误伤
    ['gui-clientsetup-needs-modbus', 'bad', '@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT)\npublic class ClientSetup {\n', 'clientsetup-no-modbus'],
    ['gui-clientsetup-needs-modbus', 'bad', '    @Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT)\n', 'clientsetup-no-modbus'],
    ['gui-clientsetup-needs-modbus', 'good', '@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)\n', null],
    // S2（2026-09-23）：1.16.5 裸 Block.Properties.of( 必红（处方位）；AbstractBlock 侧不误伤。
    // 第 4 例钉「标题里的裸类名不判红」——本族只看 .of( 调用位，禁止把判据扩到类名字符串。
    ['props-receiver-1165', 'bad', 'BLOCKS.register("rock", () -> new Block(Block.Properties.of(Material.STONE)));\n', 'block-props-receiver-1165'],
    ['props-receiver-1165', 'bad', '        super(Block.Properties.of(Material.WOOD).noOcclusion());\n', 'block-props-receiver-1165'],
    ['props-receiver-1165', 'bad', 'Block.Properties.of()\n', 'block-props-receiver-1165'],
    ['props-receiver-1165', 'good', 'BLOCKS.register("rock", () -> new Block(AbstractBlock.Properties.of(Material.STONE)));\n', null],
    ['props-receiver-1165', 'good', '### AbstractBlock.Properties 常用配置\n', null],
    ['props-receiver-1165', 'good', '- 本节讲 Block.Properties 这个名字（无 .of( 调用位）\n', null],
    // S3：mcp 通道值必红（properties 与 FG DSL 两种写法）；snapshot + 「MCP SRG 家族名」散文不误伤
    ['mapping-channel-1132', 'bad', 'mapping_channel=mcp\nmapping_version=1.13.2\n', 'mapping-channel-mcp-1132'],
    ['mapping-channel-1132', 'bad', "    mappings channel: 'mcp', version: '1.13.2'\n", 'mapping-channel-mcp-1132'],
    ['mapping-channel-1132', 'good', "mapping_channel=snapshot\nmapping_version=20180921-1.13\n    mappings channel: 'snapshot', version: '20180921-1.13'\n- Forge 1.13.2 使用 **MCP SRG** 格式\n", null],
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
  for (const { pack, kind: kindsSpec } of PACKS) {
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
    if (entries.length === 0) fail(`${pack}: 被扫文件数 0（换错根 / 档被搬走不等于零缺陷）`);
    // 同档可挂多族（数组 kind）：每族独立扫描、独立记账（census 每族一条；总览按档去重）。
    for (const kind of Array.isArray(kindsSpec) ? kindsSpec : [kindsSpec]) {
      const r = scanTexts(entries, kind);
      census.push({ pack, kind, scanned: entries.length, migrationExempt, ...r });
      for (const [id, n] of Object.entries(r.positives)) {
        if (n === 0) fail(`${pack}: 正解形态 ${id} 计数为 0（示例被删空 / 正则改瞎 ⇒ 本门已瞎）`);
      }
      // R47（2026-09-23）：带地板的判据必须自证采集面 —— 采集 0 = 采集器失效（档被搬走 / 正则改瞎 /
      // 过滤器收窄），**不是**代码干净；低于地板 = 扫描面缩水。地板是下界（`<`）⇒ 正常新增不假红。
      const fls = RULES[kind].floors || [];
      for (const fl of fls) {
        const n = r.positives[fl.id] ?? 0;
        if (n === 0) {
          fail(`[FLOOR-COLLECTOR] ${pack} [${kind}]: 采集面 ${fl.id} = 0 —— 这是**采集器失效**，不是代码干净（地板 ${fl.min}；口径 ${fl.what}；as-of ${fl.asof}）`);
        } else if (n < fl.min) {
          fail(`[FLOOR-LOW] ${pack} [${kind}]: 采集面 ${fl.id} = ${n} < 地板 ${fl.min}（口径 ${fl.what}；as-of ${fl.asof}）`);
        }
      }
      if (fls.length) {
        console.log(
          `  R47 ${pack} [${kind}] 扫文件=${entries.length} 判行=${r.judged} 拒=${r.bannedHits} 采集面=` +
            fls.map((fl) => `${fl.id}:${r.positives[fl.id]}/地板${fl.min}`).join(' ') +
            `（口径与 as-of 见族注释）`,
        );
      }
      allHits.push(...r.hits);
      if (INFO || RELEDGER) {
        console.log(
          `  info ${pack} [${kind}] 扫=${entries.length}（豁免迁移指南 ${migrationExempt}）禁用命中=${r.bannedHits} ` +
            `正解=${Object.entries(r.positives).map(([k, v]) => `${k}:${v}`).join('/')}${kind === 'no-material' ? ` Armor 同名豁免=${r.armorExempt}` : ''}`,
        );
      }
    }
  }

  // 同档多族时每族各记一次 scanned；总览按档去重（一档文件只算一次）。
  const scannedOnce = new Map();
  for (const c of census) if (!scannedOnce.has(c.pack)) scannedOnce.set(c.pack, c.scanned);
  const scannedTotal = [...scannedOnce.values()].reduce((s, n) => s + n, 0);
  const migrationTotal = [...scannedOnce.entries()].reduce((s, [p]) => {
    const c = census.find((x) => x.pack === p);
    return s + (c ? c.migrationExempt : 0);
  }, 0);

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
      `  合计：档 ${scannedOnce.size} / 被扫 ${scannedTotal} / 豁免迁移指南 ${migrationTotal} / ` +
        `禁用命中 ${census.reduce((s, c) => s + c.bannedHits, 0)}（其中 KNOWN_LEGIT 具名合法 ${legitUsed}）`,
    );
  }

  if (failures.length > 0) {
    console.error(
      `assert-forge-blockshape-family: ${failures.length} 项不通过（族=${Object.keys(RULES).length} 区间 / 档=${scannedOnce.size} / ` +
        `被扫文件=${scannedTotal} / 台账 ${TEST_ROOT ? 'skipped(test-root)' : RELEDGER ? 'recomputed' : 'checked'}）`,
    );
    for (const f of failures.slice(0, 30)) console.error(`  ✗ ${f}`);
    if (failures.length > 30) console.error(`  …另有 ${failures.length - 30} 项`);
    process.exit(1);
  }
  console.log(
    `assert-forge-blockshape-family: ok（${scannedOnce.size} 档 / 被扫文件 ${scannedTotal} · ` +
      `豁免迁移指南 ${migrationTotal} 篇 + 具名合法提及 ${legitUsed} 处 · 禁用形态 0 · ` +
      `台账 ${TEST_ROOT ? 'skipped(test-root)' : RELEDGER ? 'recomputed' : 'checked'}）`,
  );
}
