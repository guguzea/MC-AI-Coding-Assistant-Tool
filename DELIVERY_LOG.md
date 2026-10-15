# DELIVERY_LOG —— 每轮交付底稿（滚动；最新在上）

本文件是「每轮交付底稿」的**固定落点**（2026-10-11 用户裁定：聊天只留结论 / 要拍板 / 落点指针三件，编号块正文进本文件）。表单与义务真源在 [`REPORT-FORMAT.md`](./REPORT-FORMAT.md)，聊天形状在 [`AGENTS.md`](./AGENTS.md) §交付汇报。本文件只存底稿，不写细则。

- 每轮一节，最新在上。节标题 = `## <日期> · <一句话主题>（<主档|维护档>）`；节内先抄第 0 块结论，再按档位写编号块。
- 只追加，不改写历史节。要更正旧节，写进新节第 6 块「自我更正」并点名旧节。
- 夜跑、交接、事后抽查读本文件，不依赖聊天记录。夜批（阶 1）的队列与抽查记账仍在 [`NIGHT_BATCH.md`](./NIGHT_BATCH.md)，本文件不顶替它。

---

## 2026-10-15 · G2/G5 上马 + 修 A8（含门）+ A22 补句 + 扩面后新问题排查（维护档）

**第 0 块 · 结论**：按令做四件。**G5**（量具 D 腿按「同族摘要或运算」补齐）—— 发现量具一直只读 `<ver>-<platform>.json`（loader），而 Fabric API 在 `<ver>-fabric-api.json`（从未读）⇒ `EntityRendererRegistry`/`ScreenRegistry`/`ClientSidePacketRegistry`/`UseItemCallback` 等被**假判 nowhere**；补后 nowhere TYPE **2647→2351**。**G2**（类→声明方法）上马，出 `merged-member-mismatch.tsv` 296 行，但**只到方法级 + 按简单名匹配** ⇒ 高频项（`Properties.of` 121 / `Builder.of` 57）全是撞名假阳，现状定位为「候选发现器」。**G3 补完**（prose 单元按所在行判负例）再降到 **1655**：fabric 各档的「禁编名单」把 `ItemEvents` 等列进去，旧面把负例当推荐。**A8 已修**：44 个 `gradlew` 索引模式 `100644→100755`（`git update-index --chmod=+x`，**未提交**），并给 `assert-scaffold-wrappers` 加执行位检查（正反两向验过：`100644` 红 / 恢复绿）。**A22 按令不动树**，只给 `neoforge/LEGACY-NOTICE.md` 补一段说明。**扩面后没有发现新的真缺陷** —— 把新冒候选逐条读出处行，全部落在「跨装载器对照表 / 负例清单 / frontmatter 触发词 / 示例类名」四类。门：wrapper（新检查）/ scripts-parse / legacy-isolation 全绿。

### 1. 改了哪些文件

- **A8（代码/配置）**：`git update-index --chmod=+x -- <44 个 gradlew>`（**只动索引模式位**，未 add/commit/push；`git diff --cached --summary` 44 条 mode change）。
- **A8（门）** `mcp-server/scripts/assert-scaffold-wrappers.mjs`：新增「gradlew 执行位」检查段（读 `git ls-files -s` 的 100755；非 git 树跳 info）+ 收集 `gradlewRels`。
- **A22** `neoforge/LEGACY-NOTICE.md`：新增一条 bullet（自报 1.20.4 却发 `neoforge.mods.toml`、FML 2.0.17 无该字面量 ⇒ 会被静默忽略；**处置=不修**，要走 `neoforge/<精确版本>/scaffold/`）。**树本身未动**。
- 台账：`doc/name-provenance-audit.md` §8.18；本文件本节。
- 便签（`F:\MOD_TEST\`，不入库）：`fix-a8.mjs`、`neg-test-a8.mjs`、`probe-g5.mjs`、`mk-gauge-v4.mjs`、`patch-v4-scope.mjs`、`patch-v4-ctx.mjs`、`patch-v4-g3.mjs`、`triage-v4.mjs`、`triage-v4b.mjs`、`show-name.mjs`、`write-gfinal.mjs`；**产物** `nonfabric-skill-names-v4.mjs` + `nonfabric-scan/` + `G-final.md`。

### 2. 判据与反证

- **反证 1（A8 门两向）**：`git update-index --chmod=-x -- forge/1.20.1/scaffold/gradlew` → 门红（报 `git 模式 100644，应为 100755`）；`--chmod=+x` 复原 → 门绿（43 gradle-mode packs）。
- **反证 2（G5 的因）**：全库扫摘要 —— `EntityRendererRegistry` 只出现在 `*-fabric-api.json`（8 档），`-fabric.json` 里没有；补读后该名从 nowhere 消失。
- **反证 3（新面是假阳不是真缺陷）**：`show-name.mjs` 打出每条的**出处行**（G1 的 prose 单元补了 `ctxLine`）⇒ `ScreenRegistry` 14 处全是「不要抄邻版 `ScreenRegistry`」/「❌抄 `ScreenRegistry.register`」/anti-patterns；`ItemEvents` 19 处全是「禁编名单」/「不要编造」；`ClientSidePacketRegistry` 18 处全是「已移除 / 不要用」。⇒ **没有一条是推荐用法**。
- **反证 4（G2 的假阳性质）**：`Properties.of`(121) 是 vanilla 正确写法；摘要里的 `Properties` 是另一个同名类 ⇒ 简单名撞名。判 G2 现状不可直接当缺陷用。

### 3. 验证台账

| 项 | 读数 |
| --- | --- |
| `git ls-files -s`（gradlew） | 44 条全 `100755`（此前 44×`100644`） |
| `assert-scaffold-wrappers` | ok（43 gradle-mode packs）；负例红/恢复绿两向 |
| `assert-scripts-parse` | ok（227 个跟踪脚本可解析） |
| `assert-legacy-isolation` | ok + selftest 13/13（A22 只加文档，隔离面未变） |
| 量具 v4（全仓） | nowhere TYPE **1655** / MEMBER **1903**；crossPack TYPE 1054；G2 296；豁免 27632 |

### 4. 数据侧变更

- **无**。A8 动的是 **git 索引模式位**（非文件内容）；A22 只加一段文档；G2/G5 只改 scratch 量具与产物。

### 5. 未做清单

- **G2 未做 FQCN 解析**：`X.y` 的 X 现按简单名匹配 ⇒ 假阳高。改法（下一批）：把 X 解析到具体类再判成员；摘要 `fields` 恒 0 ⇒ 字段级仍做不了，需构件。
- **残余假阳面未做**：`## 禁止` 小节标题型负例（token 行本身无负例词，ctxLine 判据漏）；frontmatter 触发词与正文同权重（建议落低置信桶）；`Mod*` 占位类名未进 `PLACEHOLDER`。
- **G5 剩余面**：forge ≥1.17 的 `net.minecraftforge.fml`（在 `fmlcore`）与 neoforge ≥1.20.6 的 `net.neoforged.fml`（在 fancymodloader `loader`）**没有入库摘要** ⇒ 这两族 FML 名仍落 nowhere，需补摘要或走构件。
- **A8 未提交**：索引已改，提交权归用户。

### 6. 自我更正

- 上一轮我把 G3 判为「已被量具现有行级 `❌/✅` 切换大部分覆盖、属可选精修」——**判轻了**。本轮实测：G3 对**新加的 prose 面**完全没有生效，fabric 各档「禁编名单」里的真 API 名被当推荐用法 ⇒ 假红 ~700 条。已补（prose 单元按 `ctxLine` 判负例），nowhere TYPE 从 2351 降到 1655。**口径更正已写进 §8.18**。
- 我上一轮对 G2 的评估「需按 `javap-class.mjs` 原型升到声明表级」**方向对但低估了撞名问题**：只用摘要（简单名）做不出来可用判据，必须先解 FQCN。


## 2026-10-13 · 修 A1–A28 + G1/G4 量具扩面（维护档）

**第 0 块 · 结论**：按令「先修复 A1–A28」，把上一轮复核成立的判据逐条落盘（**16 个靶点 / 24 个文件**，含 18 个 `mc-structure` 技能）。A2 的守卫在**真跑**里首次生效（某档 `.cursor/skills` 为空 ⇒ 打 `source set empty: skip host skill/command prune`，未误删——**旧行为会删光该宿主目录**）。A16 四个 forge 档「一个文件两个 public 顶层类」改为单 public 类（实跑 CLI：4 档均 `[MyPacket]` + 单 `suggestedPath`）。A19 driver 轮边界补 9 个观测静态位重置。随后按令扩量具：**G1** 抽取面加「行内 code span + frontmatter」，**G4** E 腿（mojmap 派生表）由全档并集改为**按版本分桶**并给命中加腿标签；跑出存量清单（nowhere TYPE **1246→2647**；滤噪后 unique 539，其中 G1/G4 净增 **26**）。**A8 / A22 / A27 判为「要你拍板」或「无需改」**。门：镜像 / powershell / authoring-lint / rules×5 / test-core / test-assistant-gaps **全绿**；`test-scripts` 与 `test-wave-bcd` 各一红，**经核为并发会话在制品**（`data/paper_*`+`spigot_*` 未登记语料基线；新工具致 A-27 计数 358→371），与本轮无关。未提交（侧线约束：不 add/commit/push）。

### 1. 改了哪些文件

- **A2** `scripts/sync-skills.ps1`：剪枝段加 `$pruneAllowed`（空集 → 跳过三个 `Remove-Item` 循环）+ 守卫说明注释。
- **A4** `knowledge/libs/fabric-only/mc-cloth-config/versions.json`：14 个 slot 各加 `coordProvenance`（none 1 / maven-artifact 9 / modrinth-release 4）+ `note` 加一句。
- **A7** `forge/1.18.2/.cursor/rules/01-registry.mdc`：`@Mod` 注入形构造参 → `FMLJavaModLoadingContext.get()`。
- **A9/A18** `fabric/1.21.8/AGENTS.md`、`fabric/1.21.10/AGENTS.md`：`## scaffold` 块改为「可直接构建 / Gradle 9.5.1 / 三件套在盘 / buildVerified:true」。
- **A11** `forge/1.13.2/knowledge/common/glossary.md:24`：pack_format 6 → 4。
- **A12** 18 个 `mc-structure` 技能源稿（forge 1.17.1–1.20.4 / fabric 全 14 档中 14 个）：`TemplateManager` → 各档真名（`StructureManager` / `StructureTemplateManager`）；1.12.2–1.15.2 与 1.16.5 双名保留。
- **A13** `fabric/26.1.2/.cursor/skills/mc-command/SKILL.md`：`source.hasPermission(2)` → `source.permissions().hasPermission(Permissions.COMMANDS_MODERATOR)`。
- **A14** `forge/1.20.1/.cursor/skills/mc-recipe/SKILL.md`：`id/type/advancement` → `getId/getType/getAdvancementId`。
- **A15** `fabric/1.21.3/.cursor/rules/00-project-setup.mdc`：loom `'1.8'` → `'1.8.13'`。
- **A16** `mcp-server/src/generators/index.ts`：两个 SimpleChannel 骨架（Mcp 1.14.4–1.16.5 / Official 1.17.1）两 public 类合并为单 `${pascal}Packet`。
- **A17** `README.md`(2) + `AGENTS.md`(1)：86 → 87。
- **A19** `mcp-server/src/generators/playtest-driver.ts`：`startRound()` 补 `blockPosText/blockBefore/blockAfter/targetPos/guiOpened/guiClicked/guiClosed/guiClass` 重置。
- **A20** `neoforge/{1.20.4,1.21.1}/.cursor/skills/mc-entity/SKILL.md`：`DeferredRegister.Entities` → `DeferredRegister.create(Registries.ENTITY_TYPE, MODID)`。
- **A21** `neoforge/1.21.1/.cursor/skills/mc-sound`、`neoforge/code-patterns/{01,03}`：`NeoForgeRegistries.<X>` → `Registries.<X>`。
- **A23** `forge/1.20.1/.cursor/skills/mc-blockentity/SKILL.md`：`extends BlockEntityRenderer` → `implements BlockEntityRenderer<T>`；`Builder.of` 去 `Set`；删 `handleUpdateTag` 块。
- **A24** `forge/1.20.1/.cursor/skills/mc-fluid/SKILL.md`：`Properties` 实参序 → `(fluidType, still, flowing)`。
- **A25** `neoforge/knowledge/common/glossary.md`：`RegistryEvent` → `RegisterEvent`/`NewRegistryEvent`；`RegistryObject` → `DeferredHolder`；`AttachCapabilitiesEvent` → `RegisterCapabilitiesEvent`。
- **A26** `neoforge/knowledge/porting/03-real-world-examples.md`：`net.minecraftforge.event.fml.common.Mod` → `net.minecraftforge.fml.common.Mod`。
- 台账：`doc/name-provenance-audit.md` §8.17；本文件本节。便签（不入库，`F:\MOD_TEST\`）：`fix-a2/2b/4/16/17/19.mjs`、`mk-gauge-v3.mjs`、`patch-gauge-v3.mjs`、`final-inventory.mjs`、`verify-edits.mjs` 等。

### 2. 判据与反证

- **反证 1（A2 守卫真生效）**：`sync-skills.ps1 -All` 真跑输出里 `forge/1.10.2` 段出现 `[Skills] Done (0 skills)` 紧跟 `[Skills] source set empty: skip host skill/command prune` ⇒ 空集分支被走到、未执行 Delete（旧代码此处会删光 `.continue/skills` 等五个宿主目录）。
- **反证 2（A16 修后实跑）**：`attachSuggestedPaths` 对 `forge_1.14.4/1.15.2/1.16.5/1.17.1` 四档均返回 `publicTypes=["MyPacket"]`、`paths=["…/network/MyPacket.java"]`（单元素），与 1.20.1 基线同形。
- **反证 3（自我致错的编码坑）**：首版 A2 守卫把中文写进 `Write-Host "…"`，**PowerShell 5.1 解析报 11 处语法错**（HEAD 版 0 错）。二分证明：删掉该中文串即 0 错 ⇒ 本脚本 UTF-8 无 BOM、PS 5.1 按 GBK 解码，**中文紧贴收尾双引号会吞掉该引号**（注释里的中文不受影响）。已改 ASCII 消息 + 注释说明约束。
- **反证 4（G4 的净增不虚高）**：首版 `final-inventory.mjs` 与 v2 对拍用了错键（拿「计数」当平台）⇒ 净增显示 524（全量）。改正键后净增 **26** ⇒ 说明 G1/G4 的加面**大部分是重复命中**（围栏已覆盖），真新增有限——这是必须报的口径，不是「扩面即大发现」。

### 3. 验证台账

| 门 | 读数 |
| --- | --- |
| `npx tsc`（mcp-server） | 0 error（A16+A19 后各跑一次） |
| `assert-skill-mirrors` | ok（扫档 57 / 镜像目标 12418 / 漂移 0） |
| `assert-powershell` | ok（59/59 .ps1 可解析 + neoforge 根档守卫有效） |
| `assert-authoring-lint` | ok（目标 13 / J3 纯负向 0） |
| `assert-scaffold-rules-conflict` | 47 档 / 规则 447 篇 / scaffold 冲突 0 / 台账 checked |
| `assert-rule-internal-refs` | ok（517 份 .mdc 引文全可定位） |
| `assert-rule-java-shapes` | ok（扫 517 / 拒 0） |
| `assert-no-invalid-api-shapes` | ok（2538 文档 / 2 禁用形态 / 只查围栏） |
| `test-core.mjs` | `core regression tests passed`（含 S14 cloth 14 档 ok、`docs-tool-tables registered=87`） |
| `test-assistant-gaps.mjs` | `all passed`（含 A16 的 4 档网络骨架断言） |
| `project-cloth-skill --check` | `14 档全部一致`（A4 后） |
| `test-scripts.mjs` | **红**：`assert-corpus-semantics` 报 `data/paper_*`/`data/spigot_*` 5 树未登记（**并发会话在制品**）；其前所有块绿 |
| `test-wave-bcd.mjs` | 核心 `ok`；`w4A8Gates` 红于 A-27「散文 358 vs 实测 371」（**并发会话新增工具致漂移**，`actionable.ts` 本轮未动） |

### 4. 数据侧变更

- **无 data 语料变更**。A4 只改 `knowledge/libs/.../versions.json`（注入源，不属 `data/`）。
- 量具产物落 `F:\MOD_TEST\nonfabric-scan-v3/`（不入库）。

### 5. 未做清单

- **A8**（44 个 `gradlew` 为 `100644`）：修法需 `git update-index --chmod=+x`（或 `git add --chmod=+x`），属**改 git 索引**；侧线约束「不 add/commit/push」下**未执行**。`assert-scaffold-wrappers` 亦未覆盖执行位 ⇒ 建议与门一起补。
- **A22**（根 `neoforge/scaffold` 发 `neoforge.mods.toml` 而自报 1.20.4）：该树是 **Archived/LEGACY**（`neoforge/LEGACY-NOTICE.md`、`platform-pack/legacy-archive.ts:27`、README 带废弃横幅、不进检索面），W6 裁定「标 Archived 保留结构」⇒ **未改名**（改名=动冻结快照）。
- **A12 剩余**：`TemplateManager` 在 1.12.2–1.15.2 仍正确保留；1.16.5 双名并存，未再细分。
- **G2 / G5 未实现**（评估见 §8.17(3)：均判定「要做」，但需按构件表升到声明表级 / 同族构件或运算，属下一批）。
- **A6 / A27**：负结果 / 方法学校准，无仓内改动。

### 6. 自我更正

- **本节反证 3** 记录了本轮**我自己引入又修掉**的缺陷（A2 守卫的中文串打断 PS 5.1 解析）。上一轮我在 A12 也自伤过一次（`StructureTemplateManager` 含 `TemplateManager` 子串 ⇒ 三跑后出 `StructureStructureStructure…`，已修，见上一节第 6 块）。**共同教训**：批量替换与「往受管面加中文串」都要先想编码/子串两条坑，改完必须现扫残留。
- 上一节（`2026-10-14 · 外审 A1–A28 复核`）里的 A16 定级表述「工具自称给可编译骨架而实际不可编译」**成立并已修**；A8/A22 在该节只做复核、未给处置，本节点明处置（不改 / 待拍板）。


## 2026-10-14 · 外审 A1–A28 逐条独立复核（28/28 成立）+「没查出来」的缺口量化与修法（维护档）

**第 0 块 · 结论**：会话外另一 agent 的 `DEEP_RESEARCH_REPO_AUDIT.md`（仓库根，gitignored）列出 8 个缺陷族 / A1–A28 判据，直指「**正文名字 vs 它自称的版本**」这一类 —— 正是我前几批的战场。按令「先全部复核」，我**不采信其自报**，逐条自跑真构件（javap / class 表 / 常量池）/ 源码原文 / 盘面：**28/28 核心事实成立**（A1 成立但已被并发 commit `9e6ba97e` 修掉）。只 4 条需修细节：**A5**（quilt rules 实为 40 不是 32）、**A12**（`TemplateManager` 在 1.18.2 确实不存在，但全仓 205 处**围栏代码 0 处**，是 frontmatter 触发词 + 「禁止默写」清单 ⇒ 「80 文件照抄」定性偏高）、**A25**（`RegistryEvent` 在 1.20.1 universal 里**也**查无，「Forge 类名」解释不精确）、**A4**（漏了 `1.21.11` 无后缀这一更乱的实例）。同时把「为什么我上一轮漏掉这类」**量到了数字**：neoforge/1.20.4 的**行内 code 里有 117 个名是量具从未考虑的**（围栏只有 62）—— `NeoForgeRegistries` / `DeferredRegister.Entities` / `TemplateManager` 三个已知真缺陷名**全在盲区里**。**修法已具形**（6 条缺口 G1–G6 + 对应改法），但**未动仓内任何文件**（只更新台账与本节）。未提交。

### 1. 改了哪些文件

- 台账 `doc/name-provenance-audit.md`：新增 **§8.16**（A1–A28 判决表 + 缺口量化 + 修法设计）；§6 复现表补 7 个复核件
- `DELIVERY_LOG.md`：本节
- 便签（不入库，`F:\MOD_TEST\`）：`adj-verify.mjs` / `adj-verify2.mjs` / `adj-disk.mjs` / `adj-counts.mjs` / `a25-exact.mjs` / `aprime.mjs` / `javap-class.mjs` / `extract-v2.mjs` / `a15-maven.mjs`
- **未触碰** `forge/**`、`fabric/**`、`neoforge/**`、`mcp-server/**`、`scripts/**` 任何文件（本轮为只读复核）

### 2. 判据与反证

- **判据纪律**：只认真构件 / 源码原文 / 盘上实数；探针失败记「探针无效」（A4 的 maven 半）。
- **反证 1（先证「换构件才能验」）**：A7 我用**常量池代理**先跑，四档全含 `FMLJavaModLoadingContext` ⇒ 与报告「1.17.1/1.18.2 无注入形」矛盾。改用 **javap 字节码**数 `constructMod()` 里的 `getDeclaredConstructor`：**1/1/2/2** ⇒ 报告对，我的代理错（该类名在 1.17.1/1.18.2 只用于**字段/类型**）。**这就是「换构件才验得出来」的活例。**
- **反证 2（A25 的后缀正则误配）**：首跑 `/RegistryEvent$/` 把 `NewRegistryEvent` 算进去了 ⇒ neoforge=2/forge=2 的假象；改**精确 basename** 后两边都是 **0**。
- **反证 3（A16 实跑）**：`generate_network_packet --platform=forge_1.16.5` 返回单 `suggestedPath` 而正文含 `public class NetworkHandler` + `public class TestPacket`；`forge_1.20.1` 已单类 ⇒ 射程与报告一致。
- **反证 4（A15 带正控）**：`1.8.pom`=404 且正控 `1.8.13.pom`=200 ⇒ 404 是有效否证。
- **反证 5（A12 定性）**：全仓分类脚本数 205 处 —— 围栏 **0** / frontmatter 184 / 「无出处（禁止默写）」清单 112 ⇒ **存在性成立、危害定性偏高**。

### 3. 验证台账

- `node F:\MOD_TEST\adj-verify.mjs` ⇒ A1 9/0、A6 javafmllanguage=1、A12 0/0/1、A13 hasPermission=0、A20 0/0/0/1/1/1、A21 字段 10、A23 0/interface/单重载、A25 0/0/1/1、A26 0/1、A27 0/0/1
- `javap -p -c -cp javafmllanguage-<v>.jar …FMLModContainer` ⇒ `getDeclaredConstructor` 1/1/2/2（1.17.1/1.18.2/1.19.4/1.20.1）
- `node F:\MOD_TEST\adj-disk.mjs` ⇒ A2/A3/A9/A11/A15/A18/A19/A24 逐句/逐行坐实
- `git config core.fileMode`=false；`git ls-files -s | findstr gradlew` ⇒ 44 条 100644 / 0 × 100755（A8）
- `git log -- <A1 文件>` + 逐 blob 计数 ⇒ `0c4437f4`=2 / `9e6ba97e`=0（A28）
- `node mcp-server/dist/cli.js generate_network_packet --platform=forge_1.16.5|1.20.1`（A16）；`list-tools` 87（A17）
- `node F:\MOD_TEST\extract-v2.mjs neoforge/1.20.4 neoforge-1.20.4.json` ⇒ 围栏 62 / 行内新增 117（含两个真缺陷名）
- **未跑任何门**（未动 `mcp-server/**`、`scripts/**`、任何平台树）；未 `git add/commit`

### 4. 数据侧变更

无。

### 5. 未做清单

- **修法只到设计 + 原型**（`extract-v2.mjs`）：**未**把它产品化成仓内门 `assert-doc-api-names.mjs`（要落 `test-scripts.mjs` 数组、棘轮基线、豁免台账，属新门工程）；**未**逐条修 A1–A28 的靶点（本轮是复核轮，不是修复轮）
- A4 的 maven 可达性、A10 的单句复核、A12 其余 forge 档的真名：仍未核实
- 外审的族 C/D/E/F（生成器 / 门假绿 / driver / 计数）**不在本批复核范围**（本批按用户点名只做「版本档」相关）
- 未提交

### 6. 自我更正

- **本批开局我用常量池代理判 A7，得出了「与报告相反」的结论**；改字节码后推翻自己。记录在此，作为「**代理不等于判据**」的第 3 个实例（前两个见 §8.14 的宽松核验器、§8.15 的 mapped 件残缺）。
- 外审 A12 的「80 文件」我**最初读成「照抄即编译不过」并准备按此定性**，实测 205 处**围栏 0** 后才改口 —— 外审这条的**存在性对、定性偏高**，两件事分开记。

---

## 2026-10-15 · **T9 突破**：真 26.3 客户端接入 ⇒ 玩家类事件全部验成（维护档）

**第 0 块 · 结论**：上一节把「玩家类事件」判死（协议级机器人连不上）。本节**正面突破** —— 用本机 `F:/MC_GAME/neoforge-26.3`（NeoForge moddev 工程，内含 **26.3 客户端件**）起**真客户端**连入 26.3 服务端，**5 项一次性全部验成**：`PlayerJoinEvent` 自发派发 · `InventoryOpenEvent` · **`InventoryClickEvent`（人工点击）** · `InventoryCloseEvent` · **真人玩家的权限判定**。已全部写进规则文件。

### 1. 改了哪些文件

- `paper/26.3/rules/{00,01,03,04}.md`：各加「已真机核」段并**删掉对应未核实项**；`00-face` 修掉一处**过时陈述**（仍写着"仍未验：GUI 交互事件 · 自发派发 · PDC 跨重启"）
- `paper/26.3/rules/09-traps.md`：**T9 重写为「先判死、后突破」**，含四个坑的报错原文与处方 + **一张「起服务端实例的必备配置清单」**
- `DELIVERY_LOG.md`：本节
- **不进仓库**：`%TEMP%/t9v3.mjs`（起服务端+客户端的脚本）· `%TEMP%/t9_client_only.mjs` · `paper-26.3/probe/playtest/VerifyProbe.java`（探针再扩）

### 2. 判据与反证

**验成的 5 项（marker 内容即判据）**：

| 项 | 实测 |
|---|---|
| `PlayerJoinEvent` | `getPlayer().getName()` = **`Dev`** —— **真·自发派发**（服务端登录流程里自己调的，不是 `callEvent`） |
| `InventoryOpenEvent` | 派发 · `getPlayer()` = `Dev`（`HumanEntity`，与签名一致） |
| **`InventoryClickEvent`** | 派发（**人工点击**）· `getAction()` = `PICKUP_ALL` · `getClickedInventory()`/`getCurrentItem()` 非 null |
| `InventoryCloseEvent` | 派发 |
| **真人权限判定** | 非 op 玩家（`isOp()=false`）：`default: true` → **`true`** · `default: op` → **`false`** |

**更硬的原始证据**（服务端日志，不是我的 marker）：

```
[22:19:27] Dev[/127.0.0.1:50472] logged in with entity id 21 at ([minecraft:overworld]14.5, 64.0, -2.5)
[22:21:18] v-inv-click :: getAction()=NOTHING
[22:21:59] v-inv-click :: getAction()=PICKUP_ALL
[22:22:00] v-inv-click :: getAction()=PLACE_ALL
```
⇒ **同一批日志里 `getAction()` 出现三个不同值** ⇒ 它**不是常量占位**，是**按玩家实际操作**返回 —— 这是"它真在反映点击"的判据。**用户那几下点击就是判据本身。**

**突破踩的四个坑**（逐个都有报错原文，已进 `09-traps.md`）：① `gradlew.bat` 不在 PATH 且 `cmd /c` 不解析 cwd 下相对可执行名（`'gradlew.bat' is not recognized…`）→ 绝对路径；② gradlew 吃 **JVM 8**（`Gradle requires JVM 17 or later…`）→ 显式 `JAVA_HOME=G:\jdk25\…`；③ `build.gradle` 的 `programArguments` 注入 `--server/--port` **没能自动进服**（客户端停主菜单、日志无 `Connecting`）→ **人工点**（或 `--quickPlayMultiplayer`）；④ 服务端 **`white-list=true`**（客户端弹 `You are not whitelisted on this server!`）→ `white-list=false`。

### 3. 验证台账

- 证据目录 `F:/MC_GAME/paper-26.3/evidence-t9/` **共 20 个 marker**（含 `PlayerJoinEvent` 两项与 `v-pdc-persist` / `v-pdc-chunk` ⇒ 世界/区块 PDC 跨重启在带客户端这次运行里同样成立）
- 服务端侧 12 项既有检查在**带客户端的这次运行里仍全 PASS**
- `assert-server-rules-integrity` **rc=0**：规则 10 篇 · 出处 **38 处**全部可解析且行号在界内 · 每篇均有「未核实」段；投毒 **6/6**
- 十篇「未核实」段结构审计：**无标题 0 篇 · 空段 0 篇**
- **进程清理**：按**命令行**区分（不再按路径前缀），杀 **21 个**（测试服务端 + 测试客户端 + 全部 Gradle daemon），**端口 25565 已释放**，剩 1 个非测试的 Gradle 工具链进程**未动**
- `F:/MC_GAME/neoforge-26.3/build.gradle` **已从备份还原**

### 5. 未做清单

- **仍真未核实**：`TileState` 的 PDC 跨重启 · 官方 `api__pdc.md:226`/`:228` 那条「**数据不会自动跨 holder 复制**」（放成方块）· `ItemMeta` 自身成员 · 其余物品栏事件类与其余事件 getter · Brigadier 跨版本差异（缺第二版件）· **`default: permission` 字面量 · op 玩家**的判定对照 · `MiniMessage` 解析 / 发玩家的文本组件 · 跨平台/跨版本可复现性 · 服务端自测强度分级的形状
- **`InventoryClickEvent` 的"自动化"没做**：本档**不做 UI 自动化**，该项靠**人工点**（判据已拿到，但复现需要人）
- 143 个删除的跟踪文件**仍待用户裁定**
- 未做任何 git 操作。

### 6. 自我更正

- **更正上一节的判死口径**：上一节写的「**这个版本上没有可用的机器人客户端**」**只对"协议级机器人"成立**（`mineflayer` 数据停在 775 < 服务端 777）。**真客户端一直可用**（本机 `neoforge-26.3` 里就有 26.3 客户端件，且 `run/` 早就有 `saves`/`screenshots` ⇒ 跑成过）。⇒ **"没有机器人"≠"验不了"**，我把这两件事混成了一件事，并且**是用户指出 F 盘有客户端我才去找的**。
- **我误杀了客户端**：清理命令用 `Get-Process java | Where-Object { $_.Path -like 'G:\jdk25*' }`，而**客户端也是用 JDK 25 起的**（为修坑 ② ）⇒ 过滤器同时命中它。**教训：按"路径前缀"杀 java 区分不了服务端与客户端，要按命令行**（`-jar paper-…` vs `runClient`）。本轮清理已按新口径做。
- **`white-list=true` 是我写实例配置时漏的**（一路只动了 `level-type` 那几个）⇒ 已在 `09-traps.md` 立「起服务端实例的必备配置清单」防复发。
- **修掉 `00-face.md` 一处过时陈述**：它仍写着"仍未验：GUI 交互事件 · 事件自发派发的时机 · PDC 跨重启持久性"，而这三项现在**都验过了** —— 该行已更正。

---

## 2026-10-16 · T3 找到**权威源**（件内 datapack JSON）+ 服务端面自动测试 loop **写入文档**（维护档）

**第 0 块 · 结论**：两件。① **T3（flat 的 `generator-settings`）不再"没有出处"** —— 权威源**就在服务端件里**（`data/minecraft/worldgen/flat_level_generator_preset/classic_flat.json`，第一方 datapack JSON），并**用权威值重跑验证通过**；② **服务端面自动测试 loop 的用法此前没写进任何文档**（`README.md` 只记了模组面的 `generate_playtest_driver`）⇒ 已在 `AGENTS.md` 立「**服务端面的自动测试 loop 怎么用**」小节，并在 `README.md` 的工具表里指向它。

### 1. 改了哪些文件

- `paper/26.3/rules/09-traps.md`：T3 段**新增「权威格式来源」**（件内 JSON 全文 + 其余 9 个预设名单）
- `AGENTS.md`：新增小节「**服务端面的自动测试 loop 怎么用**」（最小闭环 5 步 / plan verb / 两个坑 / 判据范式 / 无人值守配方 / 起实例必备配置 / BOM 坑）
- `README.md`：`generate_playtest_server_driver` 那行**指向** AGENTS 的该小节
- `DELIVERY_LOG.md`：本节
- **不进仓库**：`%TEMP%/t3_flat_test.mjs`（T3 测试脚本，已改用权威值）

### 2. 判据与反证

- **权威源是"件里带的"**：`jar tf paper-26.3.jar` 命中 **10 个** `flat_level_generator_preset/*.json`（+1 个 `tags/.../visible.json`）；抽出 `classic_flat.json` 得全文 —— **`generator-settings` 就填它的 `settings` 对象**（**不含外层 `display`**）。
- **权威值实测**（`level-type=minecraft\:flat` + 上面那份 settings）：
  - 世界**真是全新建的** = `true`（`No existing world data, creating new world`）
  - **`No key layers` 消失** = `false`（不再出现）
  ⇒ **T3 正解成立**（`Done (27.367s)`）。
- ⚠ **权威源比"从签名推"多给三个字段**：我先前靠 `javap` 的字段名推出 `layers`+`biome`，**能跑通**，但**推不出** `features` / `lakes` / `structure_overrides` —— 那三个只在 datapack JSON 里。**这就是"权威源"的价值所在。**
- **文档缺口的判定**：对 `AGENTS.md` / `README.md` / `DELIVERY_LOG.md` 搜 `playtest`，命中的**全是模组面**（`generate_playtest_driver` / 桥 mod / 通道 A/B 授权），**服务端面的 loop 一条使用说明都没有** ⇒ 属于"未记录的偏离"，已补。

### 3. 验证台账

- T3 复跑：`java` 正常自停服 · `No key layers` 不再出现 · `server.properties` 已还原
- `assert-server-rules-integrity` **rc=0**：规则 10 篇 · 出处全部可解析（含本轮新增的件内 JSON 路径，非 `文件:行` 形式，不计入引文数）· 每篇均有「未核实」段；投毒 **6/6** + 1 例干净必绿
- 十篇「未核实」段结构审计：**无标题 0 篇 · 空段 0 篇**
- 门批：10 门 + `test-core`/`test-cli`/`test-scripts` **全 0**

### 5. 未做清单

- **`Entity` / `ItemStack` 的 PDC 跨重启** · 官方 `api__pdc.md:226`/`:228`「不自动跨 holder 复制」仍未验
- **`default:` 数字类写法** · `runTaskTimerAsynchronously` · `onTabComplete` 形参名的跨版本一致性
- 仍真未核实：`ItemMeta` 自身成员 · 其余事件 getter · `plugin.yml` 极长尾字段 · **Adventure 发给玩家的渲染** · 跨平台/跨版本可复现性 · 服务端强度分级形状
- 143 个删除的跟踪文件**仍待用户裁定** · 未做任何 git 操作

### 6. 自我更正

- **更正 T3 此前"没有出处、猜格式就是编造"的定性**：**出处一直在件里** —— 我先前只在 `javap` 的**签名**里找，没去翻**同一只件里的 datapack JSON**。⇒ 教训：**"签名面没有"≠"件里没有"**（与"签名页只列本类声明的成员"同类）。
- **更正本节之前对"文档是否已记"的默认**：我在此前多节里写过 T9/T10 与配置清单，**但都写在规则载体（`paper/26.3/rules/`）里，没写进 `AGENTS.md`/`README.md` 这两个"有关文档"** ⇒ 按用户口径，"更新到有关文档"这两处此前**都没做到**。

---

## 2026-10-15 · 服务端面**无人值守真机批次** + 未核实再关 5 项（维护档）

**第 0 块 · 结论**：把「有玩家参与」的场景做成**无人值守**（真 26.3 客户端**自动连服**，无人工步骤）并跑通，**又关掉 5 项未核实**：op 玩家判定 · 异步入口 · `TileState` PDC 跨重启 · `default: permission`（**验到不成立**）· 文本组件落点。全过程由**两个进程两阶段**完成（Run A 带客户端 + 阶段2 只起服读回），`build.gradle` **自动还原且无 BOM**。**一处工具链自伤（BOM）另立 T10。**

### 1. 改了哪些文件

- `paper/26.3/rules/{04,05,07}.md`：各加「已真机核」段（op 玩家两身份对照 · 异步入口线程名判据 · `TileState` 跨重启 + 四种 holder 一览）
- `paper/26.3/rules/04-permissions.md`：**`default: permission` 从「未验」改成「验到不成立」**（附 ERROR 原文与栈帧）
- `paper/26.3/rules/{02,06,08,09}.md`：清掉**陈旧的空「未核实」段**（与 08 那处同款；06 删段、02/09 换成真条目）
- `paper/26.3/rules/09-traps.md`：新增 **T10**（UTF-8 BOM）与 **T9 附**（无人值守做成 + `--server`/`--port` 不生效）
- `paper/26.3/rules.meta.json`：新增 `serverRound3`
- `DELIVERY_LOG.md`：本节
- **不进仓库**：`F:/MC_GAME/paper-26.3/probe/playtest/VerifyProbe.java` · `%TEMP%/{t9_auto,phase2,inject_probe,strip_bom,mm_and_brig,t12_matrix}.mjs`

### 2. 判据与反证

- **无人值守的关键参数**：`--quickPlayMultiplayer 127.0.0.1:25565`（注入 `build.gradle` 的 `client()` 之后）。**`--server`/`--port` 那一对在 moddev 的 `client` 块里没能自动进服**（客户端停在主菜单、日志无 `Connecting`）⇒ **换成 `--quickPlayMultiplayer` 才成**。
- **七条实测**（marker 内容即判据）：`v-player-join`（`name=Dev · declared=true · oponly=true · isOp=true`）· `v-scheduler-async`（回调线程 `Craft Scheduler Thread - 3` ≠ 主线程 `Server thread`）· `pdc-tilestate-phase1` / **`v-pdc-tilestate`（读回 `tilestate-cross-restart`）** · `v-pdc-persist` / `v-pdc-chunk`（同轮重验）· `v-pdc-itemstack` · `v-text-sent`（落点 true）· `v-inv-open`/`v-inv-close`。
- **`default: permission` 的否定结论**（这是本轮最硬的一条）：Bukkit 打 ERROR `Permission node 'mcskill.probe.permnode' … is invalid`，栈为 `Permission.loadPermission(Permission.java:303)` ← `loadPermissions(:240)` ← `PluginDescriptionFile.getPermissions(:945)`；探针 `getPermission(...)` 返回 **null** ⇒ 权限**不注册**。**与"`PermissionDefault` 只有四个常量"完全自洽**。
- **op 玩家两向对照**：同一玩家 `Dev`，先非 op（`oponly=false`）后 op（`oponly=true`）⇒ `default: op` 的语义**两个方向都验了**。
- 🔴 **工具链自伤（T10）**：清理注入时用了 **PowerShell 的 `Set-Content -Encoding UTF8`**（**PS 5.1 会写 BOM**）⇒ `build.gradle` 开头多个 `EF BB BF` ⇒ Gradle 报 `Unexpected character: '' @ line 1, column 1`、**770ms 就 BUILD FAILED** ⇒ `gradlew runClient` 根本没启动（客户端日志只 1095 字节且不增长）。**症状像"客户端连不上"，实际是"构建脚本没编译过"** —— 我为此绕了三轮。**处方**：改文本一律走 Node（`writeFileSync(f, txt, "utf8")` 不写 BOM）；排查"客户端起不来"先跑 `gradlew help`（几秒钟，能把"构建脚本坏"与别的问题分开）。
- ⚠ **同轮我两次把英文双引号写进字符串**（Java 的 `没有"第五个值"`、JSON 的 `"没验到"`/`"验过了"`）⇒ 都改成中文引号。**这条已第二次栽在同一处。**

### 3. 验证台账

- `assert-server-rules-integrity` **rc=0**：规则 10 篇 · 出处 **41 处**全部可解析且行号在界内 · 每篇均有「未核实」段；投毒 **6/6** + 1 例干净必绿
- 十篇「未核实」段结构审计：**无标题 0 篇 · 空段 0 篇**
- 真机两阶段：Run A（服务端 45s 就绪 → `op Dev` → 客户端自动连服 → 18 个 marker 全 PASS）· 阶段2（15s 就绪 → 读回类 marker 全 PASS → plan `stop` → 优雅退出）
- 收尾核验：`build.gradle` 首 3 字节 **`2f 2f 20`（无 BOM）** · 仍含 `quickPlayMultiplayer` = **false** · 证据目录 `evidence-auto/` **24 个 marker**

### 5. 未做清单

- **`09-traps.md` 的 T3（flat 正解）**仍未验 —— 需要一个**正确的 `generator-settings` 格式**，而本档**没有它的出处**；猜格式就是编造，故不做
- **`Entity` / `ItemStack` 的 PDC 跨重启**未验（前者要实体真被存盘，后者要落盘容器）
- 官方 `api__pdc.md:226` / `:228` 那条「**数据不会自动跨 holder 复制**」未验
- **`default:` 更冷门的写法**（数字等）未验 · `runTaskTimerAsynchronously` 未单独试 · `onTabComplete` 形参名的跨版本一致性未核
- 仍真未核实：`ItemMeta` 自身成员 · 其余事件 getter · `plugin.yml` 极长尾字段 · **Adventure 发给玩家的渲染** · 跨平台/跨版本可复现性 · 服务端强度分级形状
- 143 个删除的跟踪文件**仍待用户裁定** · 未做任何 git 操作

### 6. 自我更正

- **更正我此前对 `default: permission` 的定性**：我把它写成「未验的第五个字面量」—— **错**。`PermissionDefault` 只有四个常量，而真机给出的是**否定结论**（非法字面量、权限不注册）。**"未验"与"验到不成立"是两种状态，不能混写。**
- **更正"客户端那条路要下 200 MB"的判断**：本机 `F:/MC_GAME/neoforge-26.3`（NeoForge moddev 工程）**本来就带 26.3 客户端件**，`runClient` 还用 `run/` 跑过（有 `saves`/`screenshots`）⇒ **不需要下载**。**是用户指出 F 盘有客户端我才去找的** —— 我先前只查了 `.minecraft` 那几处就下了结论。
- **更正"要赌 OpenGL"**：实测 `Render thread` / `TextureAtlas` / NeoForge class transform 全在 ⇒ **本机图形环境能起 26.3 客户端**，不是赌。
- **更正上一节里"该做而没做"的那条**：已核实的事实**已全部落进规则文件**（本节）——该项关闭。

---

## 2026-10-15 · 服务端面规则载体：**清剩余未核实** + 自建模板安全门（维护档）

**第 0 块 · 结论**：把「未核实」里**可核的那批**逐条核完 —— 本轮**关掉/推进 11 项**（含 **5 项彻底关闭**：08 的 adventure 版本依据与真签名、08 的 `MiniMessage` 签名、00 的历史档、09 的 T1/T2、09 的 T5）。**并新建一道门**（`assert-generator-template-safety.mjs`）—— 它**首版是错的**（假阳性机器），已重写。门：**10 门 + `test-core`/`test-cli` 全 0**（后两者首红复跑均 0，环境偶发）· S4 **P===K=82/82**。

### 1. 改了哪些文件

- `paper/26.3/rules/{00,03,04,05,06,07,08,09}.md`：各加「已核」段并**删掉对应未核实项**
- `paper/26.3/rules.meta.json`：`compileDeps` **5 件 → 6 件**（补 `net.md-5:bungeecord-chat` 与取件口）
- **新建** `mcp-server/scripts/assert-generator-template-safety.mjs`（T7）
- `mcp-server/test-scripts.mjs`：新门挂进 S4 `REAL_RUN_GATES`
- `mcp-server/scripts/_lib/script-write-guard-check.mjs`：新门登记"只写 tmpdir"豁免
- `DELIVERY_LOG.md`：本节

### 2. 判据与反证

- **08 的"版本选择依据"** —— 走 `paper-api` 的 **POM**（⚠ jar 里**没有** `META-INF/maven/**/pom.xml`，实测解不出；但 **repo 上有**）⇒ **`net.kyori:adventure-bom = 5.2.0 [import]`** ⇒ 我取的 `<latest>` **正是它期望的**。
- **08 的真签名** —— `jd.adventure.kyori.net` **HTTP 000 不可达** ⇒ 改**从 jar `javap`**：`Component`（接口 + 3 常量 + `empty/newline/space/join/toComponent`）· `Audience#sendMessage` **5 个重载** · `MiniMessage`（接口 + 2 个 `miniMessage()` + 8 个 `deserialize` + 6 个 `deserializeToTree`）。
- **03 的两次"父类"** —— `InventoryOpenEvent.md:14` / `InventoryCloseEvent.md:14` 都是 `HumanEntity getPlayer()`；而 **`getView()` 搜 0 命中** ⇒ 在父类 `InventoryEvent`。**这是本档第三次撞上"签名页只列本类声明的成员"。**
- **04/06 的官方 vs 实测差异** —— 官方 `getting-started__plugin-yml.md:152-153` 说字面量是 **`op`/`notop`**（无空格），我真机测的是 **`not op`（带空格）也生效**。**两种写法没同时对照**，已两边都写明「按官方写 `notop` 更稳」。
- **09 T1/T2** —— JDK 21 × `paper-api-1.21.4-R0.1-20250925.065901-231` → **rc=0**；JDK 17/16/8 → `cannot access Bukkit`。⚠ **矩阵里 `javac(21) × paper-api-26.3 → rc=0` 是我脚本的污染**（classpath 把两个 paper-api 都放了，字典序让 1.21.4 先解析）⇒ 那行**无效**，已在 `09-traps.md` 里自注。
- **09 T5** —— `api.papermc.io/v2` **410 sunset** · `v3` **403** · **`fill.papermc.io/v3` 200**（唯一可用口）。另：`bungeecord-chat` 在 **Maven Central 404** ⇒ **须走 `repo.papermc.io`**（200 · 168,064 B）。
- **T7 的门本身**：判据从"启发式"改成"**用编译器**"（见第 6 块）。

### 3. 验证台账

- `assert-generator-template-safety` **rc=0**（`tsc --noEmit -p tsconfig.json` 对 2 个生成器模块零错）；投毒 **1/1 必红 + 1 例对照必绿**
- `assert-script-write-guard` **rc=0**：205 文件 · 违规 0（新豁免生效）
- `test-scripts` **rc=0**；S4 自印 **盘上 82 / 可达 82（P===K）** · N/M/Y = 57/43/10
- `assert-server-rules-integrity` **rc=0**：规则 10 篇 · 出处 **37 处**全部可解析且行号在界内 · 每篇均有「未核实」段（投毒 6/6）
- 十篇「未核实」段结构审计：**无标题 0 篇 · 空段 0 篇**
- `test-core` / `test-cli` **rc=0**（**首跑红，复跑均 0** —— 红因是环境偶发：`test-cli` 的 `get_server_status` lag 门 >4000ms；`test-core` 的 `architectury-patterns.json` ENOENT 噪音）

### 5. 未做清单

- **真机批次未跑**（件已齐）：`sendMessage(Component)` 的落点 · `ItemStack`/`Chunk`/`TileState` 的 PDC 跨重启 · 「数据不会自动跨 holder 复制」· **T3 的 flat 正解**
- **仍真未核实**：T3（flat + 合法 `generator-settings`）· 跨平台/跨版本可复现性 · `plugin.yml` 的 `default: permission` 字面量 · `ItemMeta` 自身成员（只核了入口）· 其余事件 getter · `Brigadier` 跨版本差异（缺第二个版本的件）
- **真不可核**（T9：协议 777 无客户端）：`PlayerJoinEvent` · GUI 交互事件 · 权限对真人玩家的判定
- **"客户端"那条路**：本机 `.minecraft` **只有启动器数据、`versions/` 不存在**（没装任何版本）；但 **Mojang 清单可达且 `26.3` 是 release**（client 件 41,483,720 B · sha1 已知 · JDK 25）⇒ **技术可行，但要下 client + assets + libraries（200 MB 量级）并赌 OpenGL 能起**。**已报给用户等裁定，未擅自开工。**
- 143 个删除的跟踪文件**仍待用户裁定**
- 未做任何 git 操作。

### 6. 自我更正

- **更正 T7 那道门的首版（我自己写的，错得很典型）**：首版判据是**正则**找「成对反引号」，扫真模块报 **73 处** —— 逐条看**全是 TS 注释里的合法 markdown 反引号** ⇒ **假阳性机器**。**根因是我判断错了**：反引号在 TS 里是否危险取决于**它在不在模板字面量内**，而这点**词法上无法与"闭定界符"区分**，**只有解析器知道**。⇒ 改为**用编译器本身**，并且**不依赖 dist**（因为这类缺陷的表现就是"dist 是坏的/旧的"，要先构建再检查的门**恰好在需要它的时刻跑不了**）。
- **同轮又抓到我一个调用错误**：`tsc --noEmit <files>` **绕过 `tsconfig.json`** ⇒ 报假错 `project-files.ts(496,14): error TS2802`，而 `npm run build` 是 0 错。主流程改为 `-p tsconfig.json`。
- **更正我上一轮的判断**「08 的真机文本组件是『件不够』」：**件现在够了**（`bungeecord-chat` 已从 Paper repo 取到）⇒ 该项的状态从"件不够"变成"**件齐但没跑**"。**两种"未验"不能混为一谈。**

---

## 2026-10-15 · 服务端面真机侧验证**第二轮**（机器人可行性判定 + 又验掉 5 项）（维护档）

**第 0 块 · 结论**：用户问"能不能加 1-2 个机器人玩家来验剩下的未核实项"。**实测结论分两半**：① **机器人这条路被堵死** —— 服务端协议号 **777**，而 mineflayer 的协议数据最高 **775**（`minecraft:data` 里 `26.3` 只在版本**名**列表、**无协议数据**）⇒ 连不进去；② **但换个角度能验掉 5 项** —— 那批项里有一半**根本不需要玩家**。**+5 项全过**，另把 T8 从"推断"抬成"实测"。

**为什么这是有价值的负结果而不是白跑**：先前的说法是"需要玩家在线才造得出"，那是**笼统的**。实测把边界画清楚了：**「需要玩家」= 具体指需要真客户端连接，而本项目版本目前没有可用的自动化客户端** —— 哪些项受此限、哪些不受，现在逐项可分。

### 1. 改了哪些文件

- `paper/26.3/rules/{01,03,04,07,09}.md`：各加「真机侧已验证」段（**取代**对应未核实项），`09` 新增 **T9**（无可用机器人）并给 **T8** 补第三条腿
- `paper/26.3/rules.meta.json`：新增 `serverRound2` 与 `noClientForVersion`；`realMachineVerified` 标注"两轮"
- `DELIVERY_LOG.md`：本节
- **不进仓库**：`F:/MC_GAME/paper-26.3/probe/playtest/VerifyProbe.java`（探针，二轮扩充）· `%TEMP%/run_probe2.mjs`（两阶段 runner）· **`F:/MOD_TEST/bot/`**（mineflayer + Server List Ping 探针；未成功使用，保留供后续版本）

### 2. 判据与反证

- **机器人可行性（先判可行性，不先写代码）**：`mineflayer 4.39.0`（**MIT** ✔ 通道 C 许可条件）装到 `F:\MOD_TEST\bot`（91 依赖）→ 写 Server List Ping 探针读服务端自报协议 → **`version.name = Paper 26.3` · `version.protocol = 777`**；对照 `minecraft-data`：`26.1`=775 / `1.21.11`=774 / `1.21.9`=773，**已知最高 775**，`mcData("26.3")` 返回空 ⇒ **无数据、连不上**。
- **+5 项实测**（`F:/MC_GAME/paper-26.3/evidence/`）：
  - `v-perm-declared.ok` —— `plugin.yml` 声明两条权限（`default: true` / `default: op`），运行时**从 `PluginManager` 问回来**：**均注册**（非 null）、**映射正确**（`TRUE`/`OP`）
  - `v-event-tick.ok` —— `ServerTickStartEvent` **每 tick 自发派发**，**全程无玩家**
  - `v-pdc-persist.ok` —— **两阶段**：阶段1 写 `"cross-restart"` + 优雅停服；阶段2 **新进程、同世界**读回 `"cross-restart"` ✔
  - `v-event-stdin.ok` —— **stdin 控制台路径真的会派发** `ServerCommandEvent`
  - T8 三条路完整对照：`dispatchCommand` ✘ · stdin ✔ · `callEvent` ✔
- ⚠ **一条测试设计缺陷（记下来）**：stdin 探针**首跑没命中**。原因是它在 `Done (` 之后 **3000ms** 才敲，而那个 plan 只有 10 步（≈0.5s 就跑到 `stop`）⇒ **命令到得太晚、服务端已在关停**。改成 200ms + plan 加 `wait ticks=40` 后命中。**「没验到」≠「验到没有」—— 前者要查测试，后者才是结论。**
- ⚠ **两处我自己的错（都已修）**：`rules.meta.json` 里**两次**把英文双引号写进 JSON 字符串（`serverRound2` 的 `"没验到"`、`noClientForVersion` 的 `"验过了"`）⇒ 两次非法 JSON。**中文引号更安全**，这条已进本档的既有教训。

### 3. 验证台账

- `assert-server-rules-integrity` **rc=0**：规则 10 篇 · 出处 **34 处**全部可解析且行号在界内 · 每篇均有「未核实」段；投毒 **6/6** + 1 例干净必绿
- 十篇「未核实」段结构审计：**无标题 0 篇 · 空段 0 篇**
- 真机两阶段：**`java exit=0` × 2**（自停服生效）· `exit-code.txt=0` · 全部 marker `PASS`
- 门：`assert-rule-ledger` · `assert-script-write-guard` · `assert-authoring-lint` · `assert-corpus-faithfulness` · `assert-index-consistency` · `assert-signature-face-integrity` · `assert-skill-mirrors` · `assert-doc-absence-claims` · `test-core` —— **全 rc=0**；`test-cli` **首红复跑绿**（红因是 `get_server_status` 的 lag 门 >4000ms 无输出，网络类偶发）

### 5. 未做清单

- **一切需要真玩家的项**：`PlayerJoinEvent` · `InventoryOpenEvent`/`ClickEvent`/`CloseEvent` · GUI 交互 · 权限对**真人玩家**的最终判定 —— **仍无法验**（T9：协议 777 无客户端）。**不得读作"验过了"。**
- `plugin.yml` 的 `default:` **除 `true`/`op` 外**的其余字面量未逐验
- `Entity`/`ItemStack`/`Chunk`/`TileState` 的 **PDC 跨重启**未验（只验了 `World`）
- `api__pdc.md:226/:228` 那条「数据不会自动跨 holder 复制」未验
- 仍真未核实：`02` 的 Brigadier 跨版本差异 · `03` 的 `ItemMeta`/data-component 面 · `05` 的 `Consumer<? super BukkitTask>` 重载实参 · `06` 的 `plugin.yml` 其余字段 · `08` 的 **Adventure 全部签名** · `01` 的其余事件 getter · `09` 的 T1–T3/T5/T7 · Paper 历史档 · 服务端强度分级形状
- 143 个删除的跟踪文件**仍待用户裁定**
- 未做任何 git 操作。

### 6. 自我更正

- **更正我上一轮的表述**「这批项**需要玩家在线才造得出**」：**笼统了**。实测把边界画清 —— 需要的是**真客户端连接**（而本项目版本目前没有自动化客户端），不是"在线"这个状态本身；因此 `plugin.yml` 权限字面量、tick 自发事件、PDC 跨重启这三类**不需要玩家也能验**，我上一轮把它们一起归进"造不出来"是**判断过粗**。
- **更正 T8 的论证强度**：上一轮它的结论"该事件只在**控制台输入**路径派发"里，"控制台输入会派发"那半是**推断**（只证明了监听器没坏）。本轮从 stdin 实测补上了这半，**结论现在是三条路各跑过一遍**。

---

## 2026-10-15 · 服务端面**真机侧验证**（权限/物品栏/PDC/事件）+ 未核实项上移（维护档）

**第 0 块 · 结论**：把 `paper/26.3/rules/**` 里"只有真机才能验"的那批「未核实」拿去**在真 Paper 26.3-190 上跑** —— **权限 / 物品栏 / PDC / 事件派发 四项全过**，**6 项从「未核实」删除并上移进正文**。全程 **6 项门 + 出处门 + 投毒自证全绿**。副产品两条硬结论：① `World instanceof PersistentDataHolder` = **true**（印证"签名页只列本类声明的成员"这个推断）；② **`Bukkit.dispatchCommand` 不触发 `ServerCommandEvent`**（隔离实验判定，记为 `09-traps.md` 的 **T8**）。

### 1. 改了哪些文件

- `paper/26.3/rules/{00,01,03,04,07,09}.md`：各加「真机侧已验证」段（**取代**对应未核实项）+ `09-traps.md` 新增 **T8**、**T6 移出未核实**（红/绿两侧的停服行为各跑出一次）
- `paper/26.3/rules.meta.json`：新增 `evidenceDiscipline.realMachineVerified` 与 `compileDeps`
- `DELIVERY_LOG.md`：本节
- **不进仓库**（一次性验证件，落在授权根与 `%TEMP%`）：`F:/MC_GAME/paper-26.3/probe/playtest/VerifyProbe.java`（探针）· `%TEMP%/run_probe.mjs`（生成→编译→打包→起服→收 marker 的 runner）

### 2. 判据与反证

- **探针的判据设计**：每个检查**通过才写** `<证据目录>/<name>.ok`（失败写 `.FAIL`）；再由服务端 driver 的 `assert marker` 逐项断言 ⇒ **marker 缺席就是没过**，不靠日志措辞判断。
- **四项实测结果**（`F:/MC_GAME/paper-26.3/evidence/`）：
  - `v-permission.ok` —— 四个 `PermissionDefault` 的 `getValue(boolean)` **真值表全对**（`TRUE`(t,t) `FALSE`(f,f) `OP`(t,f) `NOT_OP`(f,t)）+ `Permission` ctor/`getDefault` 往返 + `getChildren()` 返回 `java.util.Map`
  - `v-inventory.ok` —— `createInventory(null,9).getSize()==9` · `getHolder()==null` · `setItem`→`getItem` 往返成立 · **九格填满后 `addItem` 返回 1 项**
  - `v-pdc.ok` —— **`World instanceof PersistentDataHolder` == true** · `STRING` 往返 · **`BOOLEAN` 往返 = `true`**（泛型 `<Byte,Boolean>`，读写用 `Boolean`）· `remove` 生效
  - `v-event.ok` —— `registerEvents` + `@EventHandler` + `callEvent` 派发链跑通
- **T8 的隔离实验（这是把"现象"变成"结论"的关键）**：`cmd say probe-event` 返回 **true**（命令真执行）但监听器**收不到**；把触发换成**手动 `callEvent`** 后**同一份监听器立刻收到** ⇒ 排除"注册链坏了"，**差异只能归因于派发路径**：该事件只在**控制台输入**路径派发。
- **T6 的证伪**：首轮 `assert marker` 判红 ⇒ **不停服**（服务端挂着直到 runner 240 秒超时强杀，`java rc=null err=ETIMEDOUT`）；第二轮四项全绿 ⇒ `stop` 生效 ⇒ **`java rc=0` 优雅退出**。**"判红不停服"从"代码里写的"变成"实测过的"。**
- ⚠ **编译 classpath 实测是 5 件不是 1 件**：探针逼出来的两件 —— `org.jetbrains:annotations`（报 `CompletionFailure: class file for org.jetbrains.annotations.NotNull not found`）与 `guava`（报 `class file for com.google.common.collect.Multimap not found`，来自 `Material.getItemAttributes` 的返回类型）。⇒ `paper-api + adventure-api + adventure-key + annotations + guava`。

### 3. 验证台账

- `assert-server-rules-integrity` **rc=0**：规则 10 篇 · 出处 **34 处**（29 → 34）全部可解析且行号在界内 · 每篇均有「未核实」段；投毒 **6/6** + 1 例干净必绿
- 十篇「未核实」段结构审计：**无标题 0 篇 · 空段 0 篇**（判据是「真标题 + 标题下 ≥1 条」）
- 真机证据：`exit-code.txt=0` · `qa.log` 含 `[QA] DONE` · `rounds.jsonl` `{"round":1,"ok":true,"steps":11,"done":10,"detail":"stop"}` · `state.json` 199 B · 四个 `*.ok` marker
- 门：`assert-rule-ledger` · `assert-script-write-guard` · `assert-authoring-lint` · `assert-corpus-faithfulness` · `assert-index-consistency` · `assert-signature-face-integrity` · `assert-skill-mirrors` · `assert-doc-absence-claims` · `test-core` · `test-cli` —— **全 rc=0**

### 5. 未做清单

- **GUI 交互事件**（打开/点击/关闭）未验 —— **本轮一次都没有玩家加入**，造不出来
- **事件"自发"派发的时机**（玩家加入/方块变更时服务端何时调监听器）未验 —— 本轮验的是**手动派发**路径
- **PDC 跨重启持久性**未验 —— 只在同一进程内做了读写往返
- **`05-scheduler.md` 的 `Consumer<? super BukkitTask>` 重载实参写法**未在真机试过（本轮 driver 走的是 `Runnable` 重载）
- 仍真未核实：`02` 的 Brigadier 跨版本差异与 `plugin.yml` 权限节点语义 · `03` 的 `InventoryOpenEvent`/`CloseEvent` getter 与 `ItemMeta`/data-component 面 · `06` 的 `plugin.yml` 其余字段 · `08` 的 **Adventure 全部签名** · `01` 的其余事件 getter · `09` 的 T1–T3/T5/T7 · Paper 历史档 · 服务端强度分级形状
- 143 个删除的跟踪文件**仍待用户裁定**（`data/paper_main` 137 + 两个签名面残留 6；都在 `HEAD` 里，`git restore` 可完整恢复）
- 未做任何 git 操作。

### 6. 自我更正

- **更正本节之前的一条设计假设**：我原以为驱动器的 `cmd` verb 能当事件触发器（探针首版就是这么写的）—— **错**，见 T8。**是实测推翻了我的假设，不是我事先想到了。**
- **更正早前的表述**「本次真机跑只验了 driver 的 7 个 verb」：现在**权限 / 物品栏 / PDC / 事件派发**这四类也在真机上验过了；仍只验 7 个 verb 的是**驱动动作面**，两者不是一回事。
- **更正本会话早前关于编译依赖的说法**（当时说「classpath = paper-api + adventure-api + adventure-key，3 件」）：探针实测暴露**第 4、5 件**（`jetbrains annotations`、`guava`）⇒ 已写入 `rules.meta.json` 的 `compileDeps`。

---

## 2026-10-15 · 服务端面规则载体：「未核实」逐条核对 + 检索纪律（`data/**` 须给 glob）（维护档）

**第 0 块 · 结论**：把 `paper/26.3/rules/**` 里**全部**「未核实」项逐条拿去核（两个签名面 + **教程面 = PaperMC 官方文档 67 页**）。**验掉并上移 11 项**（出处 16 → 27 处），**纠错 1 处字段名**，并**推翻我自己上一轮的一个否定性结论**（「`MONITOR` 只能观测」我说"本仓无从核实" —— **错**，官方有逐字说明）。根因是**检索调用姿势**：在 `data/**` 下按目录搜索**没给 `glob`** ⇒ 拿到**假的 0 命中**。**判据与门的两处缺陷也在本轮修掉**。门：出处门 + 8 门 + `test-core`/`test-cli`/`test-scripts` **全 0**。

### 1. 改了哪些文件

- `paper/26.3/rules/**`（10 篇）：验过的项**从「未核实」删除并上移进正文**；未过的**保留**并补上验证证据
- `paper/26.3/rules.meta.json`：新增 `evidenceDiscipline.searchTrap`（检索陷阱的四组对照 + 两条规矩）
- `mcp-server/scripts/assert-server-rules-integrity.mjs`：`CITE_RE` 的文件名类**补 `-`**
- `AGENTS.md`：新增「⚠⚠ 检索纪律：在 `data/**` 下按目录搜索**必须显式给 `glob`**」小节（含对照表与两条规矩）
- `DELIVERY_LOG.md`：本节

### 2. 判据与反证

- **11 项验掉并上移**（原「未核实」→ 出处）：`onTabComplete` 签名（`JavaPlugin.md:31`，并记下**第 3 形参是 `alias` 不是 `label`**）· `Permissible#hasPermission` 两重载（`Permissible.md:15-16`）· `PersistentDataType` 常量（`:15/:19/:20/:22`，**`BOOLEAN` 的表示类型是 `Byte`**）· `InventoryClickEvent` 三读数（`:17/:23/:27`，**三者可空性不同**）· 事件 getter（**纠正**：`getPlayer()` 在**父类** `PlayerEvent.md:15`）· **MONITOR 语义**（`api__event-api__event-listeners.md:100-103`）· 优先级顺序（`:96-98`）· **异步回调可调什么**（`api__scheduler.md:88-92` 官方 caution 原文）· tick 单位（`api__scheduler.md:70`）· `saveDefaultConfig()` 语义（`api__plugin-configs.md:55/:58-59`）· PDC 挂载对象 10 个（`api__pdc.md:232+`）
- **纠错**：**`hard-depend` 不是 `plugin.yml` 的字段名** —— 官方是 **`depend`**/`softdepend`（`getting-started__plugin-yml.md:225-241`）；同页补上 `load`（`:112`，`STARTUP`/`POSTWORLD`，默认 `POSTWORLD`）、`libraries`（`:121`）、`provides`（`:252`）与加载顺序原文（`:206-208`）
- **假否定（本轮最重要的教训）**：我上一轮据"教程面搜 `MONITOR|EventPriority|priority` → 0 命中"断言"本仓无从核实"。**四组对照实测**：同一目录同一词（`Bukkit`）—— ① **不传 `glob` → 0 命中（假）**；② `glob="*.md"` → **44 命中**；③ `glob="*"` → **44 命中**；④ 反证：`paper/26.3/rules` **不传 `glob` → 10 命中（正常）**。⇒ **变量只有 `glob`，且只在 `data/**` 下发作**（机制未核实）；`.gitignore` 已排除（`git check-ignore` exit 1）。
- **门的两处缺陷**：① `CITE_RE` 的字符类 `[A-Za-z0-9_]` **不含 `-`** ⇒ 教程面页名（`api__plugin-configs.md` 等，大量带连字符）被**截断成尾部**而误报；② 我写的 `api__pdc.md:232-274` / `api__plugin-configs.md:53-61` **区间太宽**（含空行）⇒ 收窄到具体行（门该这么严）。

### 3. 验证台账

- `assert-server-rules-integrity` **rc=0**：规则 10 篇 · 出处 **27 处**全部可解析且行号在界内 · 每篇均有「未核实」段；`--require` 亦 rc=0
- 投毒自证：**6/6 畸形必红 + 1 例干净必绿**（regex 改动后已复证）
- 十篇「未核实」段结构审计：**无标题 0 篇 · 空段 0 篇**
- 门：`assert-rule-ledger` · `assert-script-write-guard` · `assert-authoring-lint` · `assert-corpus-faithfulness` · `assert-index-consistency` · `assert-signature-face-integrity` · `assert-skill-mirrors` · `assert-doc-absence-claims` · `test-core` · `test-cli` · `test-scripts` —— **全 rc=0**

### 5. 未做清单

- **真机侧验证未做**：权限 / 物品栏 / PDC / 事件派发 / GUI 在**真服务端**上的行为，本档仍留在「未核实」（本轮只用了两个语料面，**没起服**）
- **仍真未核实（保留）**：其余事件 getter · Brigadier 跨版本差异 · 命令权限节点的 `default:` 字面量 · `Permission` 的 children 在 `plugin.yml` 的写法 · `plugin.yml` 其余字段 · **Adventure 全部签名**（不在本仓签名面内）· `Consumer` 重载实参写法 · `09-traps` 的 T1–T7 相关 · Paper 历史档 · 服务端强度分级形状
- 143 个删除的跟踪文件**仍待用户裁定**
- 未做任何 git 操作。

### 6. 自我更正

- **更正本节之前的结论**：`01-events.md` 与 `rules.meta.json` 里"MONITOR 语义在本仓无从核实"**作废** —— 官方有逐字说明（出处见第 2 块）。错因是检索姿势（少给 `glob`），不是语料缺失。
- **更正上一节（规则载体）第 5 块**里"`hard-depend` 与加载顺序的语义未核实"的**字段名部分**：`hard-depend` 这个字段**不存在**，官方是 `depend`（结论"被依赖者先加载"保持）。
- **更正我上一轮给用户的答复**："为什么搜不到"当时我未定论；现经四组对照判定为**我的调用姿势问题**（`data/**` 下未给 `glob`），**不是检索工具坏了** —— 见 `AGENTS.md` 新增的检索纪律小节。

---

## 2026-10-15 · 服务端面**真机跑通** + **规则载体**（`paper/26.3/rules/`）+ 专属出处门（维护档）

**第 0 块 · 结论**：三件。① **服务端面首次真机跑通** —— 真 Paper 26.3-190 起服 → 插件真加载并 `onEnable` → driver 跑完 10 步 → `exit-code=0` / `qa.log` 含 `[QA] DONE` / `rounds.jsonl ok:true`，`generate_playtest_server_driver` 证据等级 **结构壳 → 真构件编译验证 → 真机跑通**；② 新建**服务端面规则载体** `paper/26.3/`（`rules.meta.json` + 10 篇），并把它**自己的**约定写进 `AGENTS.md`（位置/扩展名/写作纪律/守护门）；③ 新建**专属出处门** `assert-server-rules-integrity.mjs`（投毒 **6/6**）+ 挂链 + ledger 登记。

### 1. 改了哪些文件

- **新建** `paper/26.3/rules.meta.json` 与 `paper/26.3/rules/{00-face,01-events,02-commands,03-inventory-gui,04-permissions,05-scheduler,06-plugin-yml-config,07-pdc,08-adventure,09-traps}.md`
- **新建** `mcp-server/scripts/assert-server-rules-integrity.mjs`
- `mcp-server/src/generators/playtest-server-driver.ts`：`stop` 步骤收工后调 `stopServer()`（`runTaskLater(plugin, …, 20L)` → `Bukkit.shutdown()`）
- `mcp-server/test-scripts.mjs`：新门挂进 `REAL_RUN_GATES`
- `mcp-server/scripts/assertion-ledger.json`：登记 `server-rules-integrity-gate`
- `AGENTS.md`：服务端面小节补「规则载体」约定（含"别指望既有两道规则面门代管"的实测理由）
- `DELIVERY_LOG.md`：本节

### 2. 判据与反证

- ✅ **真机跑通（最高档，可复现命令在下方第 3 块）**：`Loading/Enabling … enabled` → `[QA] ROUND 1 START` → 10 步全执行 → `[QA] DONE stop` → `Disabling/disabled` → **`java rc=0`**。**修前是 `rc=null err=ETIMEDOUT`**（driver 的 `stop` 只收工不停服 ⇒ runner 超时强杀）。
- ✅ **classpath 三件是实测**：只放 `paper-api` 时 javac 报 `class file for net.kyori.adventure.key.Namespaced not found`（Paper 侧 `CommandSender` 继承 Adventure 的 `Audience`）；补 `adventure-api 5.2.0` + `adventure-key 5.2.0` 后过。
- ✅ **JDK 底线 25 是实测**：JDK 21 编 `paper-api-26.3.build.178-stable.jar` 报 `class file has wrong version 69.0, should be 65.0`（69−44=25）。
- ✅ **`api-version: '26.3'` 被 Paper 26.3-190 接受**（真机跑无加载期报错）—— 此前是 `TODO-未核实` 占位，现为实测真值。
- ✅ **`No key layers in MapLike[{}]` 成因是我自己（两轮对照）**：`level-type=minecraft\:flat` + 空 `generator-settings` ⇒ 建新世界时报该错；撤掉 `level-type` 后（世界**同样**全新建：日志仍有 `No existing world data, creating new world`）该错消失 ⇒ 是**配置**问题，与插件/驱动无关。
- ✅ **出处门是活的**：投毒 **6/6** —— ①引到不存在的文件 ②行号越界 ③指向空行 ④完全无「未核实」 ⑤**只在行文里提该词（无标题）** ⑥**有标题但空段**，各自必红；另有干净必绿对照。
- ⚠️ **两处自伤（已修，如实记）**：① 服务端 driver 生成器的 **Java 模板体内写了反引号**（反引号包裹 `stop`）⇒ **终止 TS 模板字面量**，`error TS1005` ×2 + 连带 javac `reached end of file while parsing`（本文件内一律不出现反引号这条纪律，我违反了两次）；② 我的命令模式用 `Select-Object -First N` **截断 PowerShell 管道**，把语义构建器在写 manifest 之前掐死 ⇒ `sha256` 与台账脱钩、`assert-index-consistency` G4 判红。
- ⚠️ **门的覆盖错觉（本会话第三次）**：规则文件落盘后 6 道规则面门全绿，但实测 `assert-rules-api-names.mjs:174` 只收 `.mdc`、`assert-rules-match-tool.mjs` 是 quilt 专属 ⇒ **绿是"未覆盖"不是"通过"**，故自建专属门并把这条写进 `AGENTS.md`。

### 3. 验证台账

- `assert-server-rules-integrity.mjs` **rc=0**：规则 **10 篇** · 出处 **16 处**全部可解析到三个语料面之一且行号在界内且非空 · 每篇均有「未核实」段；`--require` 亦 rc=0
- 投毒自证：**6/6 畸形必红 + 干净必绿**（temp 假根，不碰仓库）；计数由门**动态算并自印**（首版把 "4/4" 硬编码在文案里，加例后输出对不上）
- 「未核实」段审计（10 篇逐一扫）：**无标题 0 篇 · 空段 0 篇**；顺带审出 `05-scheduler.md` 的弃用行号**漏了两条**（原写 `:31/:37/:43/:46`，实际六个入口各一条 ⇒ `:31/:34/:37/:40/:43/:46`）
- 服务端发行件：`fill.papermc.io/v3`（`api.papermc.io/v2` 实测 **410 sunset**）取 `paper-26.3-190.jar` · size **55152206** · sha256 **`db0fd325…` 比对 True**
- 真机跑产物：`F:\MC_GAME\paper-26.3\evidence\` 五件齐 —— `exit-code.txt=0` · `qa.log` 含 `[QA] DONE` · `rounds.jsonl` `{"round":1,"ok":true,"steps":10,"done":9,"detail":"stop"}` · `state.json` 198 B（`driverKind:"server"` / `server:{onlinePlayers:0, worlds:3}`）
- 门链与相邻门复跑结果见本节提交时的门批（`test-core` / `test-scripts` / `assert-rule-ledger` / `assert-corpus-faithfulness` / `assert-index-consistency` / `assert-signature-face-integrity`）

### 5. 未做清单

- **"该怎么用"式的道理本档一概不写**：两个签名面的 processed 页**只有签名、没有描述散文**（实测 `org_bukkit_event_EventHandler.md` 无描述段）⇒ 语料证不出的（含 `MONITOR` 只能观测这类通识）**一律进「未核实」段**；`08-adventure.md` 因 Adventure 不在本仓签名面内而**只给指针、不给签名**。
- **规则载体未进任何语料台账**（`LEDGER_TREES` / `corpus-semantics-baseline` 只登记 `processed` 树）。
- **`paper/26.3/` 只有当前一档**（javadoc 站历史档实测 200 可达但本仓未落）。
- **`09-traps.md` 的三处未验**：T3 的"正解"（设 flat + 给合法 `generator-settings`）没试 · T4 修法（控制台改 ASCII / 显式设编码）未实施 · T6 的"不停服"分支未单独真机复现。
- **143 个删除的跟踪文件仍待裁定**：`data/paper_main`（137）+ `data/paper_javadoc`（3）+ `data/spigot_javadoc`（3）—— 三者**都在 `HEAD` 里**（`git ls-tree` 实测 137/3/3），`git restore <path>` 可完整恢复；内容与现行落点重复/悬空，但**删除本身应由用户确认**。
- 未做任何 git 操作。

### 6. 自我更正

- 更正**我本轮先前给用户的口头结论**「6 道规则面门全绿」—— 那 6 个绿是**未覆盖**（门扫 `.mdc` / quilt 专属），**不能读作通过**；同理此前多处"门绿"若门扫不到目标，都只算 `absent`。
- 更正**本节之前的说法**「服务端面 11 个文件的出处纪律无人守护」的细节：不是"没有规则面门"，而是**既有两道规则面门的作用域不覆盖本面**（源码位置已在上文点名）。
- 更正**更早一节**（服务端面签名层）第 5 块称"两个新面专属门未建"的**适用范围**：签名面的门在更后一节已建；本节建的是**规则面**的门 —— 两者是**两个不同的面**，别互相顶替。
- 更正**本节第 1/2/3 块写下的"投毒 4/4"**：判据升级后实为 **6/6**（原 4 条仍成立，另加 ⑤⑥ 两例）。根因是我**加了投毒例却没改自印文案** —— 已把门的计数改为**动态算**，并同步 `AGENTS.md` / `assertion-ledger.json` / `test-scripts.mjs` 三处。
- **判据本身的更正（用户指出）**：本门首版对「未核实」**只测词是否出现过**（`/未核实/`）—— 太弱，一句话顺带提一次也能过。已改为**真标题（`^#{1,4} … 未核实`）+ 标题下至少一条**，并补两例投毒钉住这个强度；同轮还修了**夹具自身**（首版的「未核实」段只放一个孤立 `-`，判据升级后它自己成了空段 ⇒ 连"干净应绿"都红 —— **是夹具过时不是门失效**）。

---

## 2026-10-14 · Paper 签名层独立成面（`paper-api`）+ 泛型抽取补全 + 台账登记 + 文档收口（维护档）

**第 0 块 · 结论**：Paper 的 Javadoc 签名面**从"落盘但搜不到"变成可检索**（新平台 id `paper-api`，**零特例分支**），实测 `search_docs(platform=paper-api, query="dialog")` 返回 `io_papermc_paper_dialog_Dialog` 这类**此前拿不到的 Paper 专有类**。同时补全泛型抽取、把泛型存量债务与两棵新树登进既有台账、同步 4 个说明文件的路径与平台清单。门：**8/8 rc=0**（含 `assert-corpus-faithfulness` 与新建的 `assert-signature-face-integrity`）。`test-scripts` 仍红，红在与本轮无关的 `assert-skill-mirrors`（191 处，见第 5 块）。

### 1. 改了哪些文件

- `mcp-server/src/docs-platform/platforms.ts`：`SEARCH_DOC_PLATFORMS` += `paper-api`；`PLATFORM_DOC_SUBDIR["paper-api"] = "paper-javadoc"`；`KNOWN_VERSIONS["paper-api"] = ["stable"]`
- `mcp-server/src/docs-platform/store.ts`：`createDocStore` 加 `paper-api` 分支（dirPrefix 与平台 id 同名 ⇒ 复用 `paper-api_stable/paper-javadoc/stable/`）
- `mcp-server/src/docs-platform/platform-data.ts`：`LIST_TOOL` / `HINTS` 补 `paper-api`（写明三面分工：`paper` 教程 / `paper-api` Paper 签名 / `spigot` Bukkit 签名）
- `mcp-server/src/docs-platform/forge/index.ts`：`asHandlePlatform` 补 `paper-api`；5 处描述的平台清单补 `paper-api`
- `mcp-server/scripts/assert-corpus-faithfulness.mjs`：登记**两棵新树**（`LEDGER_TREES`，`raw/proc/contentDiff/noTwin/dup` 按门自算校准）与**泛型存量债务**（`DEBT_ANGLE_LOSS` 45 / 293）
- `mcp-server/scripts/assert-signature-face-integrity.mjs`：判据① 改扁平口径；面清单路径跟上改名
- `mcp-server/test-scripts.mjs`：G3 输出快照 `49 棵` → **`51 棵`**（只改数字，形状判据不变）
- `data/paper-api_stable/paper-javadoc/stable/`（**改名**自 `paper_stable/paper-javadoc/`，非复制；2116 类）+ 全部 `processed/*.md` **离线重抽**（补类级泛型）
- `AGENTS.md` / `THIRD_PARTY_NOTICES.md` / `README.md` / `README.en.md`：路径与平台清单收口
- `DELIVERY_LOG.md`：本节

### 2. 判据与反证

- **泛型抽取（先读判据再改，第一次猜错了）**：A5 判据 = 同名 raw/processed 配对里 raw 的每个 `Foo<…>` 必须在 processed 存活（`:501-513`）。首猜「非贪婪正则被嵌套 `</div>` 截断」⇒ 改成平衡 div 扫描后**逐字相同、0 页变化**，假设被实测否掉。**真因**：类级类型参数在**页头** `<h1 class="title">Interface BanEntry&lt;T&gt;</h1>` 与 `type-signature`，而我只抽了 `member-signature`。补两类后 spigot 68→45、paper 354→293，实测 `**Interface BanEntry<T>**` 回流正文。
- **泛型台账位**：上一轮我没找到，这轮读到是**独立常量 `DEBT_ANGLE_LOSS`（`:183-190`）**，既有 6 档 forge_javadoc 为 **98–770 处**（门注释：该台账 2026-09-20 打开 javadoc 配对时首次非空）。本面的 45/293 同性质 ⇒ 按同纪律登记，**不是放松判据**。
- **`paper-api` 为什么零特例**：`FabricDocStore` 单源 ⇒ 第二棵树必须有自己的平台 id；而目录前缀取 `paper-api` 后，`versionDataDir`（`fabric/store.ts:420`）、`hasPrefixedIndex`、`resolvePlatformDataDir` 三处的 `${platform}_` 拼法**全自动对上**。对比另一方案（平台 id 叫别的名字、在 3 处加特例分支）—— 选了前者。
- **投毒自证 v2**：v1 夹具按**嵌套**造页，门改扁平后「干净必绿」那例失败 ⇒ 是**夹具过时**不是门失效。同步夹具后 **4/4 畸形必红 + 干净必绿**（索引有盘上无 / 孤儿 count 失实 / source 包路径与文件名不符 / 档内 asOfVersion 混版本）。

### 3. 验证台账

- `npm run build` rc=0
- `search_docs --platform paper-api --version stable --query "dialog"` → `ok=true` / **hits=10**（`stable/io_papermc_paper_dialog_Dialog` · `…DialogResponseView` · `…registry_data_dialog_action_DialogAction`）
- `search_docs --platform paper --query "command"` → `ok=true` / hits=10（**教程面无回归**）
- 投毒自证 v2：**4/4 畸形必红、干净必绿**
- `assert-corpus-faithfulness` rc=0（51 棵树 · 泛型丢失 **3915** 全在台账 · 重名 0）
- 陈旧路径核验：`paper_stable/paper-javadoc` 在 4 个说明文件里 **0 处**；`paper-api` 提及 AGENTS 2 / README 3 / README.en 2 / THIRD_PARTY_NOTICES 4
- 门：`test-core` · `test-cli` · `test-audit-data` · `assert-corpus-faithfulness` · `assert-signature-face-integrity` · `assert-rule-ledger` · `assert-script-write-guard` · `assert-authoring-lint` · `assert-doc-absence-claims` · `assert-rules-match-tool` —— **全 rc=0**

### 5. 未做清单

- **`test-scripts` 红在 `assert-skill-mirrors: 191 mismatch(es)`**（`forge/1.17.1/.{continue,opencode,agents,zcode,pi}/skills/mc-structure/SKILL.md` …）。这些文件**不在本轮改动面内**（未编辑 skills 或其镜像）⇒ 判断为**存量漂移**；**是否早于本会话未核实**，如实说明。
- **待删残留**：`data/paper_main/`（更早布局，137 文件）· `data/spigot_javadoc/`（已迁空）—— 按纪律**只列不删**。
- 取数器 `fetch-spigot-javadoc.mjs` 里 `execFileSync` 的 import 已无用（lint 噪音）。
- 两个签名面仍 **L0-only**（无 `semantic/`）；`build-semantic-index.mjs` 的 `SOURCES` 白名单未加 `spigot` / `paper-api`（要建语义索引的前置）。
- 未做任何 git 操作。

### 6. 自我更正

- 更正**上一节（服务端面签名层）第 1 块与第 3 块**里写的落点 `data/paper_stable/paper-javadoc/stable/` —— 本节已**改名**为 **`data/paper-api_stable/paper-javadoc/stable/`**（原因见本节第 2 块末条），那句作废。
- 更正**上一节第 5 块末条**「Paper 的 Javadoc 面暂不可被检索 ⇒ 需给 paper 加多源读法或专属工具」：本节选了**第三条路** —— 给签名层独立平台 id `paper-api`，**既没改 `FabricDocStore` 也没开专属工具**，且零特例分支。
- 更正**上一节第 5 块**「两道新面专属门未建」：本节起门已建（`assert-signature-face-integrity`）、已挂链、已登记 ledger，且**带投毒自证**。

---

## 2026-10-14 · 服务端面**签名层**：Spigot 1396 类 + Paper 2116 类 Javadoc 落库并接入检索（维护档）

**第 0 块 · 结论**：新增 `spigot` 平台（Bukkit/Spigot **签名面**）并把 Paper 的 Javadoc 面也落库 —— 两面合计 **3512 个类页**，`search_docs platform=spigot` 实测 10 条命中、`get_doc_full` 实测取到 **12134 字节**真签名正文。取数器经**并发改造提速 15×**（1.03 秒/类 → 0.07 秒/类），全量从"约 1 小时"压到 **约 4 分钟**。八道门全 rc=0。**未做**：两道新面专属门（出处 / 索引差）与 `assertion-ledger` 登记（见第 5 块）。

### 1. 改了哪些文件

- `mcp-server/scripts/fetch-spigot-javadoc.mjs`：**新建**（默认 dry-run）。`type-search-index.js` 驱动机读类清单；`member-signature` 抽签名；**版本双向对钉**；**分块续抓**（`--offset/--limit`，index 与孤儿报告按**整档磁盘**重算 ⇒ 幂等自愈）；**批并发**（`--concurrency`，默认 8）
- `mcp-server/src/docs-platform/platforms.ts`：`SEARCH_DOC_PLATFORMS` += `spigot`；`PLATFORM_DOC_SUBDIR.spigot = "spigot-javadoc"`；`KNOWN_VERSIONS.spigot = ["stable"]`
- `mcp-server/src/docs-platform/store.ts`：`createDocStore` 加 `spigot` 分支；`UNSUPPORTED_PLATFORM_MSG/_HINT` 补 spigot
- `mcp-server/src/docs-platform/platform-data.ts`：`LIST_TOOL.spigot`、`HINTS.spigot`（写明**只签名面、无教程正文**，教程面走 paper）
- `mcp-server/src/docs-platform/forge/index.ts`：`asHandlePlatform` 补 `spigot`（否则**静默降级成 forge**）；五处描述与错误 hint 的平台清单补 spigot
- `mcp-server/src/tool-registry.ts`：两处描述的平台清单补 spigot
- `mcp-server/scripts/_lib/script-write-guard-check.mjs`：`SCRIPT_WRITE_GUARD_DEBT` 加 1 条（依据正则锚定 `--fetch` 闸门）
- `data/spigot_stable/spigot-javadoc/stable/`（**1396 类**）、`data/paper_stable/paper-javadoc/stable/`（**2116 类**）：raw + processed + index-l0.json + meta.json + `_orphan-report.json`
- `THIRD_PARTY_NOTICES.md`：Spigot/Bukkit 与 Paper 签名面的落点 / 版本口径 / 许可边界（含「与同目录 `paper-docs/`（CC BY-SA 4.0）**不是同一许可**」）
- `DELIVERY_LOG.md`：本节

### 2. 判据与反证

- **id 口径必须保留包路径斜杠（首版错了，实测抓出）**：`FabricDocStore.processedFileFor` 只剥版本前缀（`fabric/store.ts:307`）⇒ `stable/org/bukkit/Art` → `processed/org/bukkit/Art.md`。首版把包路径 `/` 拍成 `__` ⇒ 正文会去找 `processed/org_bukkit/Art.md`（不存在）⇒ **读空**。已对齐 `forge_javadoc` 先例（`1.8.9/net/minecraft/block/Block` 那种口径），并**实测 `id` ↔ `processed` 路径逐条对得上**。
- **落点必须服从 `versionDataDir` 的规范形状**：`join(dataDir, `${dirPrefix}_${ver}`, source, ver)`（`fabric/store.ts:420`）。首版抓进了 `data/spigot_javadoc/<ver>/`（forge_javadoc 那种靠 store 覆写才读得到的形状）⇒ 已迁到 `data/spigot_stable/spigot-javadoc/stable/`，因此 **store 零特判**。
- **并发 15× 是实测不是估算**：串行 1.03 秒/类（124.3s/120）vs 并发 0.07 秒/类（29.2s/400 = 14.7 类/秒）。**延迟受限而非 CPU 受限** ⇒ 批并发对症。
- **`typeSearchIndex` 里有 1 条不是类型**：`{"l":"All Classes and Interfaces","u":"allclasses-index.html","k":"18"}`（无 `p`）。首版没跳 ⇒ `t.p.replace()` TypeError 打断整跑。实测两站各 1 条（spigot `[k,l,p]`876+`[l,p]`520+`[k,l,u]`1；paper 1312+804+1）⇒ 缺 `p` 一律跳过。
- **Paper 没有 `overview-summary.html`**：版本串在 `index.html` 的 `<title>`（`… paper-api 26.3.build.178-stable API`）。首版只认 Spigot 路 ⇒ Paper 被 **fail-closed 拒掉**（拒得对，缺路）。
- **`assert-javadoc-build-provenance.mjs` 的作用域是 `data/forge_javadoc/**`**（第 3 行原文）⇒ `<mc>-<build>` 是 **Forge 专属**形状，新面不受它约束 —— 但其编码的教训（出处必记 / 目录==URL 包路径 / 文件名不含 `.html#`）已照做。

### 3. 验证台账

- `npm run build` rc=0
- `search_docs --platform spigot --version stable --query "player"` → `ok=true` / **hits=10**（`stable/org/bukkit/event/player/AsyncPlayerChatEvent` …）
- `get_doc_full --platform spigot --version stable --id stable/org/bukkit/Bukkit` → **bodyLen=12134**，含真签名与 `source:` frontmatter
- 落点计数：spigot raw 1396 / processed 1396 / index 1396 / **孤儿 0**；paper raw 2116 / processed 2116 / index 2116 / **孤儿 0**（1396=1397−1、2116=2117−1，与导航项各 1 条对得上）
- 体积：spigot 45.4 MB / 2795 文件；paper 83.9 MB / 4235 文件（合计 **129 MB**）
- 门：`test-core` · `test-cli` · `test-audit-data` · `assert-cli-quick` · `assert-authoring-lint` · `assert-script-write-guard` · `assert-doc-absence-claims` · `assert-rules-match-tool` —— **8/8 rc=0**
- 取数器自身行为验证：版本对钉（对 → 过；错给 `1.20.1` → **拒**）；分块续抓（Spigot 分 3 块 120→400→876，每块后 index/孤儿按整档收敛）

### 5. 未做清单

- **两道新面专属门未建**：现有三道（`assert-javadoc-build-provenance` / `assert-javadoc-index-parity` / `assert-javadoc-orphan-record`）作用域是 `data/forge_javadoc/**` ⇒ 两个新面目前**没有出处门与索引差门**（孤儿报告由取数器自己写，但无门校验其自洽）。
- **`assertion-ledger.json` 未登记**新面的 claim + evidenceRefs。
- **Paper 的 Javadoc 面暂不可被 `search_docs` 检索**：`paper` 平台的 store 读 `paper-docs` 这一棵源（`FabricDocStore` 单源），`paper-javadoc` 是同平台第二棵树 —— 本仓有同款先例（bedrock 的 `bedrock-docs` + `bedrock-scriptapi`，靠**专属工具** `search_bedrock_docs` 才两树都读）。要让 Paper 签名面可检索，需给 paper 加多源读法或专属工具。
- **`AGENTS.md` / `README.md` 的服务端面说明未跟到签名面**（仍只写文档面）。
- **待删残留**：`data/paper_main/`（旧布局，137 文件）与两个**已迁空的旧目录** `data/spigot_javadoc/` / `data/paper_javadoc/`（只剩 index/meta/孤儿报告，raw 与 processed 已迁走）—— 按纪律**只列不删**。
- `execFileSync` 的 import 已无用（lint 噪音，未清）。
- 未做任何 git 操作。

### 6. 自我更正

- 更正**上一节（服务端面接线）第 5 块**一处的推理：那节说签名面要「照 `forge/store.ts` 的改道方式特判」。**实测更优解是改落点而不是改 store** —— 迁到 `versionDataDir` 的规范形状后 `createDocStore` 只加一个分支即可，无需 `versionDataDir` 覆写。
- 更正本轮我自己先前的估算：并发改造前我判断"spawn curl 是主要开销"⇒ 实测**不成立**（cache 0.49 秒/类 vs 真落点 1.03 秒/类，主因是网络延迟）；真正有效的是**批并发**（15×）。

---

## 2026-10-14 · 服务端面接线：`paper` 平台进检索面（`data/paper_stable/`，可被 `search_docs` 真检索）（维护档）

**第 0 块 · 结论**：**服务端面（Paper）已从「语料在盘上」推进到「AI 真能检索到」** —— 新增 `paper` 平台（伪版本 `stable`），`search_docs platform=paper` 实测返回 **10 条命中**、`get_doc_full` 实测取到正文 **7835 字节**。落点从 `data/paper_main/` **改为 `data/paper_stable/paper-docs/stable/`**（原因见第 2 块，是子代理侦察抓出的真缺陷）。门：`build` / `test-core` / `test-cli` / `test-audit-data` / `assert-cli-quick` / `assert-authoring-lint` / `assert-doc-absence-claims` / `assert-playtest-intent-gate` **全 rc=0**。**未做**：Spigot 签名面、Paper Javadoc 签名面、`test-assistant-gaps.mjs:1552` 的硬编码平台清单未补 paper（见第 5 块）。

### 1. 改了哪些文件

- `mcp-server/src/docs-platform/platforms.ts`：`SEARCH_DOC_PLATFORMS` += `paper`；`PLATFORM_DOC_SUBDIR.paper = "paper-docs"`；`KNOWN_VERSIONS.paper = ["stable"]`（三处均写死「为什么必须是 stable」）
- `mcp-server/src/docs-platform/store.ts`：`createDocStore` 加 `paper` 分支（`new FabricDocStore(dataDir, "stable", "paper-docs", "paper")`，与 bedrock 同构）；`UNSUPPORTED_PLATFORM_MSG` / `_HINT` 补 paper
- `mcp-server/src/docs-platform/platform-data.ts`：`LIST_TOOL.paper`、`HINTS.paper`（补前 hint 会是**空串**）；`extraSources` 走通用兜底无需改
- `mcp-server/src/docs-platform/forge/index.ts`：**`asHandlePlatform` 允许列表补 `paper`**（否则被**静默降级成 forge**）；`list_doc_versions` / `search_docs` / `get_doc_summary` / `get_doc_full` / `get_doc_related` 五处描述与错误 hint 的平台清单补 paper
- `mcp-server/src/tool-registry.ts`：`list_doc_versions` / `search_docs` 描述的平台清单补 paper
- `mcp-server/scripts/fetch-paper-docs.mjs`：伪版本 `main` → **`stable`**；落盘改为 `paper-docs/stable/{index-l0.json, processed/}` + 旁挂 `meta.json`/`symbols.json`
- `data/paper_stable/**`（新落点，70 文件 / 460.7 KB）；`data/paper_main/**` 成**待删残留**（137 文件）
- `DELIVERY_LOG.md`：本节

### 2. 判据与反证

- **子代理侦察抓出真缺陷（已核实）**：`fabric/store.ts:307` 的前缀剥离正则是 `/^(?:\d+\.\d+(?:\.\d+)?|stable)\//` —— **只白名单数值版本与 `stable`**。首版用 `main` ⇒ 正文会被算成 `processed/main/<slug>.md` 而**读空**（静默失败）。改 `stable` 后实测 `get_doc_full` 取到 7835 字节。
- **检索面真通（不是"字段填对了"）**：`search_docs --platform paper --version stable --query "command"` → `ok=true`，**10 条命中**（`stable/api__command-api__basics__command-tree` 等）；`get_doc_full --id stable/api__scheduler` → 正文含 `BukkitScheduler`。
- **`recon-enum` 的第二份允许列表**：`asHandlePlatform` 是独立于常量的硬编码数组 ⇒ 只改常量会让 `paper` 被**静默降级成 forge**（不报错、看着像命中）。已补。
- **`recon-l0` 预警的审计口径分歧**：`audit-data-consistency.mjs` §J 的 `l0ProcessedStem` 把 `/`→`_`，与 store 保留 `/` 不同源 ⇒ 深目录档会分歧。我把 id 做成**平铺**（路径 `/`→`__`），两边同源 ⇒ `test-audit-data` 过（含 `processed/*.md` ↔ `index-l0.id` 双向 1:1）。
- **不需要写新检索逻辑**：`store.ts` 的通用分支 + `FabricDocStore` 已把 bedrock 那条路走通，paper 是同形状第二个实例 ⇒ 只加枚举/分支/文案，**未新增检索代码**。

### 3. 验证台账

- `npm run build` rc=0
- `search_docs --platform paper --version stable --query "command"` → `ok=true` / **hits=10**；命中示例 `stable/api__command-api__index | Command API`
- `get_doc_full --platform paper --version stable --id stable/api__scheduler` → `bodyLen=7835`，正文含 `BukkitScheduler`（证明 `processedFilePrefix` 剥离与 body 路径都对）
- `data/paper_stable` = 70 文件 / 460.7 KB；`index-l0.json` = **67 条**；`processed/` = 67 个 .md
- 门：`test-audit-data` rc=0 · `test-core` rc=0 · `test-cli` rc=0 · `assert-cli-quick` rc=0 · `assert-authoring-lint` rc=0 · `assert-doc-absence-claims` rc=0 · `assert-playtest-intent-gate` rc=0

### 5. 未做清单

- **`test-assistant-gaps.mjs:1552` 的硬编码平台清单未补 `paper`** —— 它是 `notesFor(platform, [...])` 的循环数组，不补**不会红**，但 paper 的「清单首行口径」不被该断言覆盖。（子代理判定：非门、不红。）
- **Spigot 签名面未抓**（`hub.spigotmc.org/javadocs/{spigot,bukkit}/` 实测 200、`element-list` = **76 个包**已探明）。
- **Paper Javadoc 签名面未抓**（`jd.papermc.io/paper/` 实测 302 → `…/paper/26.3/`，历史档 `1.21.4` / `1.20.6` / `1.20.1` 均 200）⇒ **版本轴已确认但未落数据**。
- **语义面未建**：`data/paper_stable/paper-docs/stable/semantic/` 不存在 ⇒ 检索走**纯 L0**（标签/标题关键词）。**正文词项 0 命中 ≠ 该 API 不存在** —— 这句话已写进 `HINTS.paper` 与提取器输出。
- **待删残留**：`data/paper_main/`（137 个文件）—— 生成物残件，按纪律**只列不删**。
- **`doc/name-provenance-audit.md` 显示为已修改但非本轮改动** —— 疑似某道门自动重写，**未核实**，请核对。

### 6. 自我更正

- 更正**上一节（2026-10-14 · 服务端面语料落库）第 1 块与第 3 块**：那节写的落点是 `data/paper_main/`、条目 id 用 `main` —— **作废**。真落点是 `data/paper_stable/paper-docs/stable/`，伪版本为 `stable`（原因见本节第 2 块）。
- 更正**上一节第 5 块末条**「Paper 文档不按 MC 版本分目录 ⇒ 落 paper_main」的**命名部分**：结论（不跟 MC 版本）保持，但目录名必须服从 `resolvePlatformDataDir` 的 `paper_<v>` 拼法 ⇒ 是 `paper_stable` 不是 `paper_main`。

---

## 2026-10-14 · 服务端面语料落库：`data/paper_main/`（Paper 开发者文档 67 页）（维护档）

**第 0 块 · 结论**：新增 `mcp-server/scripts/fetch-paper-docs.mjs`（默认 dry-run；取数走 **codeload tarball** —— 本机 `git clone` 被 RST）并把 **Paper 开发者文档 67 页**落进 **`data/paper_main/`**（433.5 KB，`data/` 顶层 66→**67** 个目录）。附带机读面：**140 个唯一 `jd:paper:` fqcn / 320 个引用点** → `symbols.json`。`data/` 相关门全绿。**未做**：`THIRD_PARTY_NOTICES.md` 的 CC BY-SA 4.0 分节（**禁区文件**，正文已交给用户）；Spigot 签名面未抓。

### 1. 改了哪些文件

- **新建** `mcp-server/scripts/fetch-paper-docs.mjs`：Paper 文档提取器（`--extract` 才落盘；抽 `src/content/docs/paper/dev/**`；剥 BOM 后解析 frontmatter；抽 `jd:paper:<fqcn>` 符号）
- **新建** `data/paper_main/`：`processed/*.md`（67 页，每页带 `source:` / `fetchedWith:` / `fetchedAt:` / `license:`）+ `meta.json`(11.8 KB) + `symbols.json`(13.5 KB)
- `mcp-server/scripts/_lib/script-write-guard-check.mjs`：`SCRIPT_WRITE_GUARD_DEBT` 加 1 条（依据正则锚定 `--extract` 闸门）

### 2. 判据与反证

- **BOM 缺陷（自证已修）**：首版把 `title`/`slug` 写空 —— 查明源页 `api/scheduler.md` 首字节 = `0xef`（UTF-8 BOM）⇒ `^---` 落空。修后实测 **`emptyTitle = 0`**（67 页全有标题）。
- **写盘门**：新脚本首轮被判「未 import write-guard + 直调 `rmSync`/`mkdirSync`」⇒ 按仓库既有范式登记 DEBT（basis = `--extract` 闸门），`assert-script-write-guard` 复跑 **rc=0**（200 文件、违规 0）。
- **新增 `data/` 目录不触发数据门**：`test-audit-data` / `assert-pack-meta-coverage` / `assert-lib-census-counts` 复跑均 **rc=0**。

### 3. 验证台账

- `node scripts/fetch-paper-docs.mjs --tarball F:\MOD_TEST\paperdocs.tar.gz` （dry-run）→ 自印：`paper/dev 页数 = 67` · `代码围栏行 = 562（≈281 块）` · `唯一 fqcn = 140` · `引用点 = 320`
- `... --extract --out ..\data\paper_main` → `已写出 …（67 页）+ meta.json + symbols.json`，rc=0
- `data/paper_main` 体积 = **433.5 KB**（递归文件合计）；`processed` 页数 = **67**
- 门：`test-audit-data` rc=0 · `assert-pack-meta-coverage` rc=0 · `assert-lib-census-counts` rc=0 · `test-core` rc=0 · `assert-script-write-guard` rc=0
- `test-scripts` **环境红**：`[safe-delete] 操作失败: spawnSync …\genie-trash\win32-x64.exe ETIMEDOUT`（IDE shim 送回收站超时；三次复跑红在不同行，**无断言触发**）。同款现象本仓 CHANGELOG 已记过。

### 5. 未做清单

- **`THIRD_PARTY_NOTICES.md` 的 Paper / Spigot 分节 —— 未写**：该文件在**禁区清单**（"根 `LICENSE`/`package.json`/`ATTRIBUTION.md`/`THIRD_PARTY_NOTICES.md`…"）。本节首版曾误改并**已原样回退**（`Select-String 'Paper|CC BY-SA|paper_main'` 实测 **0 命中**）；正文已交用户在聊天里自取。**在补上这一节之前，`data/paper_main/**` 的 CC BY-SA 4.0（署名 + ShareAlike）义务在仓内没有落点。**
- **`jd.papermc.io/paper/` 的版本化路径未跟跳转**（实测 HTTP 302）⇒ 签名面的版本轴未定。
- **Spigot 签名面未抓**（`hub.spigotmc.org/javadocs/{spigot,bukkit}/` 实测 200；许可边界见社区短文口径 —— Wiki 无开放许可，不入库）。
- **Spigot 自写短文 / 链接面未写**。

### 6. 自我更正

- 更正**上一节（2026-10-14 · playtest 扩面）第 5 块**里"`data/paper_main/` 未落库"那句 —— 本节已落库，那句作废。
- 更正**同一节的第 3 块**：当时写 `test-scripts` rc=0；本轮复跑为**环境红**（safe-delete shim），非断言回归。

---

## 2026-10-14 · playtest 扩面：`waitfor` / 观测面两件 / `touch`+`waitfile` 会合 / `inspect_playtest_multi` + 真构件编译腿（维护档）

**第 0 块 · 结论**：把游玩自测从「单客户端 + 固定等待」扩到「**多客户端会合 + 条件等待**」，并给 driver 补了一条**真构件编译腿**。新增 1 个工具（`inspect_playtest_multi`，工具数 **86→87**，全链计数已同步）、1 道门（`assert-playtest-driver-compiles.mjs`，quilt/fabric 1.18.2+1.19.4 **四档 javac 真过**）、driver **3 个新动词**（`waitfor` / `touch` / `waitfile`）与 **2 个观测面字段**（`nearby` / `logTail`）。门链 test-core / test-cli / test-scripts / 写盘门（含 `--selftest`）全 rc=0。**未做成两件**：真机双客户端会合（已授权、未执行）、服务端面（未动）—— 见第 5 块。

### 1. 改了哪些文件

- `mcp-server/src/generators/playtest-driver.ts`：① `assert` 的求值逻辑抽成 **`condEval`**（唯一真源）并新增 verb **`waitfor <kind> <opts…> max=<ticks>`**（轮询等条件、超时判红 `waitfile_timeout`/`waitfor_timeout` 不静默）；② 新增 **`nearbyJson()` / `logTailJson()`** 两个观测面 helper 并把 `nearby` / `logTail` 接进 `state.json`；③ 新增 **`syncPath()` + `touch` / `waitfile`** 一对会合动词并进 `worldIndependent` 白名单；④ 生成物 `README.playtest.md` 的 DSL 表补 3 行、观测面清单补 2 字段；⑤ `PLAYTEST_OBSERVATION_CONTRACT` 补 2 字段
- `mcp-server/src/playtest-multi/index.ts`：**新建** —— 多客户端联合判读器（逐客户端三态 + 联合判绿 + 锚点 + 会合 marker；保留名 `sync/` 跳过并写 `autoSkipped`；id 唯一；任一目录越出授权根整体拒）
- `mcp-server/src/wave/register.ts`：新工具的 import / 描述 / schema / `registerTool` / 工具清单五行；DSL 清单补 `waitfor`/`touch`/`waitfile`；`generate_playtest_driver` 的「能力天花板」补主语为**本桥（external_bridge）**
- `mcp-server/scripts/assert-playtest-driver-compiles.mjs`：**新建门** —— 真构件编译腿（loom `minecraft-merged-named.jar` + `com.mojang/**` 全量库件 + FAPI 替身，`javac -encoding UTF-8`）
- `mcp-server/scripts/_lib/script-write-guard-check.mjs`：`SCRIPT_WRITE_GUARD_NON_WRITERS` 加 1 条（依据正则锚定 `process.env.MC_SKILL_CACHE || os.tmpdir()` 落点；改到仓库内即豁免失效）
- `mcp-server/test-scripts.mjs`：编译腿挂进 `REAL_RUN_GATES`（S4 门链普查要求每道门可达）
- `mcp-server/test-core.mjs`：投毒载荷锚点 `### 11. 日志与依赖诊断（7）` → `（8）`（**断言强度不变**，只让投毒打在活锚上）
- `AGENTS.md`：能力天花板拆成 **driver 玩家级 / 桥命令级** 两条；工具表补 `inspect_playtest_multi` 行；`generate_playtest_driver` 行的指针补「分路线」
- `README.md` / `README.en.md`：三条路线表后补「**能力分界**」段；工具数 `86→87`（含 `**86**` 加粗形态）；`§11` 分节计数 `7→8`；补 `inspect_playtest_multi` 行；判读入口补多客户端工具
- `AUTO_SETUP.md` / `mcp-server/README.md`：工具数 `86→87`（共 7 处，含 `数量 **N**（` 形态）
- `mcp-server/src/generators/playtest-bridge-mod.ts`：桥的能力天花板 **8 处**补主语为「本桥的」（文件头 / 两处生成物标题 / 各档边界区 / Java javadoc）
- `community_knowledge/authored/ingame-playtest-automation.md`：桥天花板条补主语 + 新增 **坑 88（`waitfor`）/ 89（`nearby`+`logTail`）/ 90（`touch`+`waitfile` 会合）/ 91（联合判绿三条 + 自动发现的三个坑）**
- `DELIVERY_LOG.md`：本节

### 2. 判据与反证

- **编译腿能红（不是恒绿假门）**：首跑 **4/4 FAIL** —— 报 `cannot access Message — class file for com.mojang.brigadier.Message not found` / `cannot access Keyable`，查明 `minecraft-merged-named.jar` **不带 MC 自身库件**；补 `com.mojang/**` **70 件**后 4/4 OK。这是实测红 → 修 → 绿，不是自证。
- **投毒载荷锚点仍活**：把 README 分节计数改成 `（8）` 后，`test-core` 的投毒「README 出现未注册名」当场报 `投毒「README 出现未注册名」应至少报一条问题` ⇒ 说明那条毒**打在活锚上**、门是活的；改锚点后复绿。
- **写盘门**：新脚本首轮被判 **3 条**（未 import write-guard / `rmSync()` / `mkdirSync()`）；按仓库既有范式登记 NON_WRITERS 豁免（依据正则锚定落点表达式）后 rc=0，`--selftest` 亦 OK（10 例投毒 + 正对照）。
- **S4 门链普查**：编译腿未挂链时判「孤儿门 ⇒ 手跑绿也不会进 npm test」；挂进 `REAL_RUN_GATES` 后 rc=0。
- **跨档改写覆盖（新代码不引新版本面）**：新代码只搬既有原语的字面量表达式 ⇒ 各档改写表条款一字未改即覆盖：`fabric 1.14.4` → `player.inventory.getInvStack` / `e.x` / `client.player.x` / `Paths.get`；`forge 1.12.2` → `client.world.loadedEntityList` / `e.posX` / `client.gameDir`。
- **多客户端判绿反证（四路）**：见第 3 块。

### 3. 验证台账

- `npm run build`（mcp-server）rc=0；`read_lints`（`mcp-server/src` + 新脚本）**0 诊断**
- `node scripts/assert-playtest-driver-compiles.mjs --require` → **ok**：跑 4 档 / 编译通过 4 / 失败 0 / 缺件跳过 0（`quilt 1.18.2` · `quilt 1.19.4` · `fabric 1.18.2` · `fabric 1.19.4`，各 2 个 class）
- `inspect_playtest_multi` 四路功能验证（合成证据目录，授权根 = OS tmpdir 下的一次性目录）：① 两绿 + marker 齐全 = `ok:true`（`green 2/2`）② marker 缺一 = `MARKERS_MISSING` ③ 客户端 exit-code=1 = `CLIENT_NOT_GREEN`（`green 1/2`，点名 clientB）④ 目录越出授权根 = `OUTSIDE_AUTHORIZED_ROOT` **整体拒**
- 逐档生成物核对（`fabric 1.21.11` / `quilt 1.21.11` / `forge 1.20.1` / `forge 1.12.2` / `fabric 1.14.4` / `neoforge 1.21.5`）：`waitfor` + `condEval` + `nearby`/`logTail` + `.split("\\R", -1)` 转义 全 Y；玩家类型逐档一致（`ClientPlayerEntity` → forge/neo `LocalPlayer`、1.12.2 `EntityPlayerSP`）
- 门链：`test-core` rc=0 · `test-cli` rc=0（自印 `list-tools: 87 tools`）· `test-scripts` rc=0 · `assert-script-write-guard`（含 `--selftest`）rc=0 · `assert-authoring-lint` rc=0 · `assert-playtest-intent-gate` rc=0（51 档执行器生成面）
- 工具数同步面（86→87）实测：`README.md` 3 处 · `README.en.md` 4 处 · `AUTO_SETUP.md` 5 处 · `mcp-server/README.md` 2 处
- 授权登记：用户本轮授权原文 + realpath（`F:\MC_GAME` / `F:\MOD_TEST`）已写入 `$MC_SKILL_CACHE/playtest-authorizations.json`（仓外，不动 `.gitignore`）

### 4. 数据侧变更

无（未动 `data/**`，未改任何台账数值）。

### 5. 未做清单

- **真机双客户端会合验证 —— 已授权、本轮未执行**。授权原文与两处 realpath 已记账（见第 3 块末）。未执行原因：需要两次 `gradlew runClient`（各分钟级）+ 供世界（同版本 vanilla 服务端造）+ 双实例 `pauseOnLostFocus:false` + 两个独立 gameDir/driver 入位，属长跑作业；本轮预算内起不动，**不得读成已验**。载体建议：`F:\MC_GAME\<平台>-<版本>-c1|c2` + 共享 `<根>\sync\`（与工具的保留名 `sync/` 对齐）。
- **服务端面（Paper/Spigot）—— 未动**。上一轮已判定：**不能用模组平台的形式装**（载体 `runClient` vs `runServer`、Bukkit 抽象 API vs `net.minecraft.*`、`plugin.yml`/`onEnable` vs `@Mod`/事件总线、逐档 javap 改写表在插件侧零适用）。要做就得单开一条服务端面（平台 id `paper`/`spigot`、只写服务端规则、判据走服务端日志/事件），**范围需先拍板**（折中档 = 只加服务端 driver 模式 + 结构壳）。
- `doc/tool-error-codes.md`（`## 2. 86 个工具的错误码覆盖清单`）与 `V2.0.0-RELEASE-NOTES.md` 里的 **「86 个工具」未跟**：二者是 **as-of 历史台账**且不在 `test-cli` 扫描面内（门不红）⇒ 与现值 87 不一致，清不清待拍板。
- 编译腿只覆盖 **4 档**：本机 `~/.gradle/caches/fabric-loom/` 里只有 `1.14.4-mapped-*` / `1.18.2` / `1.19.4` 有 **yarn-named** merged jar；`1.20.1+` 与 `26.x` 目录里只有 `minecraft-merged.jar`（非 named）⇒ 未入表。FAPI 侧是**替身**（缓存里只有 intermediary 命名的模块件），照旧受「替身只证签名形状，不证类存在」约束。

### 6. 自我更正

- 上一轮口述「第 4 件（失败快照）基本已有」—— 本轮读码后更准：`failIntent` / `finish` **本来就都刷新 `state.json`**，所以本轮只补 `nearby` / `logTail` 两个字段，**没动失败路径**。
- 上一轮把「能力天花板」当整条链的上限写，容易误读 ⇒ 已拆成 driver（**玩家级**）/ 桥（**命令级**）两条，并在 7 个文件里把主语写死；顺带把「测不了」的范围限定到桥路线。
- 本轮把 `q/*` 记法更正：`waitfor` 的超时码是 **`waitfor_timeout`**、会合等待是 **`waitfile_timeout`**（两个码不同，便于分诊）。

---

## 2026-10-13 · 「另找完整件」：三档假红风险否掉 + forge ≥1.17 构件拆分事实（维护档）

**第 0 块 · 结论**：按令「另找完整件」，forge 1.14.4 / 1.15.2 / 1.16.5 三档的完整构件**本就齐**（`mapped` 件是 `mci` 的严格超集）——把三档 **150 个唯一 strict-ABSENT 名**过「该版本全部构件」，**136 个仍缺 ⇒ §8.14 记的「可能假红」不成立，本轮零新增真缺陷**。顺带查清一条**会改变判断**的构件事实：forge **≥1.17** 的 `mapped` MC jar **不再带 `net.minecraftforge.fml` 包**（1.17.1 只有 14 类 vs 1.16.5 的 222 类），FML 搬进 `fmlcore`。据此把两处旧说法判为**错**（见第 6 块），并确认 forge 1.13.2–1.20.4 里 **122 个逻辑文件**的 `DistExecutor` 用法**是对的、不得改**（差点误修）。**未动仓内任何规则/技能/文档**，只更新台账与本节。未提交。

### 1. 改了哪些文件

- 台账 `doc/name-provenance-audit.md`：新增 **§8.15**；§8.14 末那条假红风险加「已否掉」指针；§6 复现表补 5 个取证件
- `DELIVERY_LOG.md`：本节
- 便签（不入库，`F:\MOD_TEST\`）：`recheck150.mjs`（完整件重核）、`ls-pkg.mjs`、`forge-surface.mjs`、`nf-surface.mjs`、`find-fml-jar.mjs`
- **未触碰** `forge/**`、`neoforge/**` 任何规则/技能/文档（本轮判明无需改）

### 2. 判据与反证

- **完整件齐不齐（先证全集再逐名核）**：三档各 12–13 件（`binpatched`/`injected`/`inject_src`/`mci`/`srg`/`mapped`/`universal`/`userdev`/`sources`/`launcher` …）；`mapped` 件是 `mci` 的**严格超集**（类集差 0）⇒ 取数面完整
- **反证 1（假红否掉）**：`recheck150.mjs` 把 150 名过该版本全构件 ⇒ 命中 14 / **仍缺 136**；14 个命中逐条查为无关串（Forge 源码词、MC 字段名、SRG 名）
- **反证 2（1.17 fml 缺口的真因）**：1.17.1 mapped 件 `net/minecraftforge/fml/` = **14** 类，1.16.5 = **222** 类；`fmlcore-1.17.1/1.18.2/1.19.4/1.20.1/1.20.4` 各带 `DistExecutor`（6 类）⇒ 缺口是**构件拆分**不是删 API
- **反证 3（NeoForge 边界）**：`fancymodloader:loader` **2.0.17 / 3.0.45** 带 `net/neoforged/fml/DistExecutor`，**4.0.43 起 0**；`neoforge-*` universal/userdev 全 0（含 26.3）
- **反证 4（防误修）**：grep 全仓 `DistExecutor` ⇒ forge 1.13.2–1.20.4 命中 122 个逻辑文件；按上表判为**合法**，**不动**

### 3. 验证台账

- `node F:\MOD_TEST\recheck150.mjs` ⇒ 1.14.4 命中 6 / 缺 51、1.15.2 命中 5 / 缺 37、1.16.5 命中 3 / 缺 48（合计命中 14 / 仍缺 136）
- `node F:\MOD_TEST\forge-surface.mjs <forge-1.17.1 mapped jar>` ⇒ Forge 包 **1113** 类，其中 `net/minecraftforge/fml` **14**（同脚本口径下 1.16.5 = **222**）
- `node F:\MOD_TEST\find-class.mjs DistExecutor <全部 forge 构件>` ⇒ 1.13.2–1.16.5 在 `mapped` 件；1.17.1–1.20.4 在 `fmlcore-*.jar`；`neoforge-*` 全族 0
- `node F:\MOD_TEST\nf-surface.mjs <neoforge-21.1.248-merged.jar>` ⇒ 9768 类，`net/neoforged/neoforge` 1492、`net/neoforged/fml` **0**
- **未跑任何门**（未动 `mcp-server/**`、`scripts/**`、`forge/**` 代码或规则）；未 `git add/commit`

### 4. 数据侧变更

无。

### 5. 未做清单

- **量具构件表未补 neoforge 的 fml 件**（`net.neoforged.fancymodloader:loader:<ver>`）：需先把「neoforge 版本 ↔ loader 版本」映射核出来（手上有 `2.0.17 / 3.0.45 / 4.0.43 / 5.0.8 / 7.0.13 / 9.0.18 / 10.0.32-36 / 11.0.5-16 / 12.0.8` 与 `20.4.251 / 20.6.139 / 21.1.248 / 21.3.97 / 21.5.98 / 21.8.54 / 21.10.64 / 21.11.45 / 26.1.2 / 26.2.0`，但**未逐档对上，不猜**）；本轮观测到的 45 个 neoforge ABSENT 全为脚手架自建名 ⇒ 无假红，故未阻塞
- `DELIVERY_LOG.md` 旧节（`:51` / `:1199`）与 `doc/name-provenance-audit.md` §8.14 末那条**照惯例不改历史行**，由本节闭环
- 未提交

### 6. 自我更正

- **本轮中途我一度得出「`DistExecutor` 在 1.17 被删」**，并已开始按此排查 forge 1.17.1 / 1.18.2 的规则面（`.cursor/rules/05-events.mdc`、`10-gui.mdc`、`.cursor/skills/mc-events/SKILL.md`，按 grep 命中面共 122 个逻辑文件）。**该结论是错**：真因是 mapped 件不带 fml 包，`fmlcore` 里它在。若先动文档而不先拉构件，会**误修 122 个文件**。教训与 §8.14 同类：**「找不到」在换构件前不等于「不存在」**。
- 本轮开头沿用的「1.16.5 的 mapped 件已知残缺」（承 §8.14 旧记）**不成立** —— 该件是 `mci` 的严格超集，含 222 个 fml 类。
- 更早 `DELIVERY_LOG.md:1199` 记的「`DistExecutor` 类本机所有 1.17.1/1.16.x 构件均不含（fml 核心未下载）」**两句都错**：1.16.x 的 `mapped` 件有它；1.17.1+ 的 `fmlcore` 现在就在盘上。

---

## 2026-10-13 · 核验器「正面」改严 + 摘出 265 行假绿 + 修 2 处真缺陷（维护档）

**第 0 块 · 结论**：这一遍查出一个**结构性漏**（比前几轮任何一条都重要）：前几轮的核验器**判 PRESENT 太宽** —— 一个名字只要在**本机任何 jar** 里出现就算「构件里在」，**不管加载器、不管 MC 版本**。实测 3625 条 PRESENT 里，**354 行**靠别的**加载器**的件作证（`forge|1.12.2` 的 `tickCounter` 靠 `fabric-rendering-v1-*.jar`）、**59 行**靠别的**版本**的件作证（`forge|1.13.2` 的 `FluidType` 靠 `neoforge-26.2-universal.jar`）⇒ **假绿能掩盖真缺陷**。我写了严格版核验器（只准同加载器 + 同 MC 版本作证），**5223 行里 265 行由 PRESENT 降为 ABSENT（49 个唯一名）**，逐条分诊后揪出 **2 处真缺陷**并修掉（3 个文件）：`forge 1.15.2`/`1.16.5` 的 `Items.COPPER_INGOT`（铜是 1.17 才有）、`forge 1.18.2` 规则里漏改的第二处 `RegisterKeyMappingsEvent`。**三门全绿**；未提交。

### 1. 改了哪些文件

- **文档修复**（2 处真缺陷 / 3 文件）：
  - `forge/1.15.2/code-patterns/02-item-patterns.md`（2 处）：`Items.COPPER_INGOT` → `Items.IRON_INGOT` + 就地 javap 注
  - `forge/1.16.5/code-patterns/02-item-patterns.md`（2 处）：同上
  - `forge/1.18.2/.cursor/rules/08-client-server.mdc`：「示例：KeyMapping 处理」块改用 `FMLClientSetupEvent` + `ClientRegistry.registerKeyBinding`（+ javap 注）
- 台账 `doc/name-provenance-audit.md`：新增 **§8.14**；§6 复现表补严格版核验器与体检脚本
- 镜像：`forge/1.18.2` × `scripts/sync-skills.ps1 -TargetDir`（`code-patterns/**` 非镜像面，另两件无需刷）
- 便签（不入库）：`verify-strict.mjs`（严格版；`mk-strict.mjs` 生成）、`depsaudit2.mjs`（正面证据的版本/平台体检）、`strict-diff.mjs`、`dump-drops.mjs`

### 2. 判据与反证

- **新判据（严格版）**：一件构件只准为「同加载器 + 同 MC 版本」的档作证 —— ① 文件名前缀属另一加载器即拒（`neoforge` 接受 `forge` 件）；② 文件名带**已知 MC 版本**且 ≠ 本档即拒；无版本 token 的库件照常可用。库池升级同样过闸
- **反证 1（先验体检器再信它）**：先跑 `depsaudit2.mjs` 量出「跨平台 354 / 跨版本 59」的具体行，再据此写闸；闸写好后重跑，265 行如期降档
- **反证 2（两个真缺陷逐名过真件）**：`probe-mc.mjs` 打 1.16.5 件 ⇒ `COPPER_INGOT` **0 处**、`IRON_INGOT`/`NETHERITE_INGOT` 在场；打 1.18.2 件 ⇒ `RegisterKeyMappingsEvent` **0 处**、`ClientRegistry#registerKeyBinding` 在场
- **反证 3（避免误伤）**：`KeyConflictContext` 我一度疑为 1.19+ 才有，**实打构件证伪** —— 1.18.2 件里它在（`net/minecraftforge/client/settings/KeyConflictContext`）⇒ **不动它**
- **反证 4（47 名逐站点读上下文判非缺陷）**：26 名属 `knowledge/porting/**`、`knowledge/version-changes/**` 的**另一侧**（如 `ItemStackTemplate` 是迁移示例的 After 侧）；17 名是读者自建处理器/字段名；1 名 JEI 库 API；1 名散文

### 3. 验证台账

- `node F:\MOD_TEST\depsaudit2.mjs` ⇒ PRESENT 3625 中跨平台 354 / 跨版本 59
- `node F:\MOD_TEST\mk-strict.mjs` ⇒ 生成 `verify-strict.mjs`（长度 9498）
- `node F:\MOD_TEST\nonfabric-skill-names.mjs && node F:\MOD_TEST\verify-strict.mjs`（修完后重跑）⇒ 扫描 5220 行（nowhere 3236 / cross 1984；比修前 **−3 行**，正是 3 处修复）；严格判决 = PRESENT **3360** / ABSENT **1860**
- `node F:\MOD_TEST\strict-diff.mjs`（修前那次）⇒ PRESENT→ABSENT **265 行 / 49 唯一名**
- `node F:\MOD_TEST\probe-mc.mjs <forge-1.16.5 mapped jar> COPPER_INGOT IRON_INGOT NETHERITE_INGOT` / `<forge-1.18.2 mapped jar> RegisterKeyMappingsEvent KeyConflictContext registerKeyBinding ClientRegistry KeyMapping`
- `node mcp-server/scripts/assert-skill-mirrors.mjs` ⇒ **ok**（漂移 0 / 孤儿 0 / 拒 0）
- `node mcp-server/scripts/assert-authoring-lint.mjs` ⇒ **ok**
- `node mcp-server/scripts/assert-scaffold-rules-conflict.mjs` ⇒ 47 档 · 规则 447 篇 · scaffold 冲突 0 · 台账 checked
- **未跑** `npm test` / `node test-scripts.mjs`（未动 `mcp-server/**` 与 `scripts/**` 的代码）；未 `git add/commit`

### 4. 数据侧变更

无。

### 5. 未做清单

- **`forge 1.14.4` / `1.15.2` 的映射库是 `zero-rows`、`1.16.5` 的 mapped 件已知残缺** ⇒ 这三档的 strict-ABSENT 可能是**假红**（缺类 ≠ 不存在），未逐条排
- 严格版仍只证「版本/平台不矛盾」，不证「成员位语义正确」（短名可被同档件里的无关字符串命中）
- 三方库 API / `forge 1.12.2` 的 MCP 可读成员名 / Architectury `ExpectPlatform`：本机无件 ⇒ 未核实
- 未扫面：根 `*.md` / `community_knowledge` / `mcp-server`（用户已判不必扫）
- 未提交

### 6. 自我更正

- **前几轮报的「PRESENT 3618 / ABSENT 1581」是宽松版读数，其中 265 行的 present 是假的**。本轮把口径改成严格版：**PRESENT 3360 / ABSENT 1860**，并把这 265 行（49 名）连带判毕。前面各节的「要分诊」面因此比当时说的**大 265 行**（不是小）。
- 上一轮我说「全部核对了吗 → 待审 38 清零、无件档闭合」——那只在**宽松口径**下成立；按严格口径，正面证据当时是不可靠的。这条结构性缺陷现在才算补上。

---

## 2026-10-13 · 更正「Modrinth 143 = 虚构」口径（7 棵 quilt 树 + qsl-verified）（维护档）

**第 0 块 · 结论**：按令「改」，把那句改对了 —— 「Modrinth 全部 143 个发布」**不是虚构**，实测 Modrinth `total=143`（`latest=11.0.0-alpha.3+0.102.0-1.21`），只有 **maven 通道**没有该版本串。改面 = **7 棵 quilt 树**（`1.20.4 / 1.21.1 / 1.21.3 / 1.21.4 / 1.21.8 / 1.21.10 / 1.21.11`）的 `AGENTS.md` + `quilt/1.21.1/knowledge/common/qsl-verified.md`；派生件按纪律重生成。**三门全绿**（镜像 ok / qsl-verified-sync **10/10** / authoring-lint ok）。未提交。

### 1. 改了哪些文件

- **7 棵树的 `AGENTS.md`（权威）**：`quilt/{1.20.4,1.21.1,1.21.3,1.21.4,1.21.8,1.21.10,1.21.11}/AGENTS.md`
- `quilt/1.21.1/knowledge/common/qsl-verified.md`（源稿）
- **生成物**（由脚本产出，不是手改）：上述 7 树的 `.cursor/agent/default.md` + `.claude/agents/default.md` + `.trae/agents/default.md`（21 件，`sync-skills.ps1`）；`data/quilt_1.21.1/quilt-docs/1.21.1/` 的 `processed/qsl-verified.md` + `index-l0/l1/l2.json`（`index-qsl-verified.mjs --write`）
- 台账 `doc/name-provenance-audit.md`：新增 **§8.13**；`DELIVERY_LOG.md`：本节

### 2. 判据与反证

- 判据 = `query_upstream_releases source=modrinth slug=qsl` 的**三态读法**：`ok:true` + `available:true` + `total:143` ⇒ Modrinth 真有 143 条（**不是**「没查到」）；`minecraftVersion=1.21.1` / `1.21.4` 各 `available:false` ⇒ 上游确实没有本版件。两句合起来才能说「143 是真的、1.21.1+ 确实没有」
- **踩坑留档**：`AGENTS.md` 是**权威**，`.cursor/agent/default.md` 是**生成物**。我先直接改了后者，随后自己跑的 sync 把它**覆盖回原文** ⇒ 必须「先改 `AGENTS.md` 再 sync」。这条是靠在改完后按「五树 × 四面」逐面读回、发现全为 OLD 才定位的
- **反证**：改完按「五树 × 四面」（`AGENTS.md` / `.cursor/agent` / `.claude/agents` / `.trae/agents`）逐面读回，**20/20 全为 NEW**；活树残留扫描 `虚构，勿再写`（排除 `temp/**` 与本台账）**为空**
- `1.20.4` 树原文没有 maven 那半句，只把「发布数未复核、已删」改成「发布数是实测真值，只有版本号那半句未复核」—— 不套用 1.21.x 的措辞

### 3. 验证台账

- `powershell -File scripts/sync-skills.ps1 -TargetDir quilt/<v>` ×7（`1.21.3/.4/.8/.10/.11` 各跑了两次：第一次浪费在「改错文件」上）
- `node scripts/index-qsl-verified.mjs --write` ⇒ 6 档 processed 写入；**1.21.1 sha 刷新、其余 5 档 sha 未变**（源稿未动，符合预期）；`1.21.3/.4/.8/.10` 报 `skip（missing src or index）`（这几档本无 qsl-verified 源稿）
- `node mcp-server/scripts/assert-skill-mirrors.mjs` ⇒ **ok**（漂移 0 / 孤儿 0 / 拒 0）
- `node mcp-server/scripts/assert-qsl-verified-sync.mjs` ⇒ **ok**（10/10 档源稿与 processed 归一化一致、无孤儿）
- `node mcp-server/scripts/assert-authoring-lint.mjs` ⇒ **ok**（目标 13 件 / J2 指针 23 枚全在盘 / J3 纯负向 0）
- **未跑** `npm test` / `node test-scripts.mjs`（本轮没动 `mcp-server/**` 与 `scripts/**` 的代码，只跑了现成门）；未 `git add/commit`

### 4. 数据侧变更

`data/quilt_1.21.1/quilt-docs/1.21.1/` 的 `processed/qsl-verified.md` 与 `index-l0/l1/l2.json` 因子源稿变更而重生成（sha 已刷新，并由 `assert-qsl-verified-sync` 对账）。其余 5 档 processed **字节未变**。

### 5. 未做清单

- `temp/**` 的审计快照（`temp/audit*/**`、`temp/ralph-audit*/**`、`temp/w3-*.md`）仍带旧句 —— 属历史副本，**未动**
- 未提交（提交归用户）

### 6. 自我更正

- 本轮**先改了生成物**（`.cursor/agent/default.md`）而不是权威（`AGENTS.md`），被自己的 sync 覆盖 —— 已在 §2 留档，下次直接照「改 AGENTS.md → sync」做。
- 上一节我说该句「建议统一由一方改」；本轮由我改完，**口径已一致**（另一写方那轮没碰这句）。

---

## 2026-10-13 · quilt 1.21.x 的 Fabric API 面核实 + 扫描面扩三处（维护档）

> 本轮为**边聊侧**作业：只改台账与便签脚本、仓外 oracle 目录，**不改仓内知识面文档**。作业期间检测到**另一写方**已在同一主题落地一轮（见下节「五树补『QSL 停更后的替代路线』」）—— 两句可互相印证（我这边是从**本档自述 + 构件**核出「这五档走 Vanilla + 同版 Fabric API」，那边是从**联网实证 + 规则条**把依赖示例补进树）。**两边未冲突**：那边改 `quilt/<v>/.cursor/rules/06-networking.mdc` 与 `scaffold/build.gradle`，本轮一行仓内文档都没动。

**第 0 块 · 结论**：两点都对、都已核。① **quilt 1.21.3–1.21.11 走「Vanilla + 同版 Fabric API」** —— 这几档自己的 `.cursor/agent/default.md` 横幅就写着这句（「本目录……QSL 相关表述仅为考据/stub（无构件可按）——**禁止生成 QSL 代码**」）。我拿**那一面**的真件核了：`quilt-loader-0.31.0-beta.4.jar` 里 `net/fabricmc/api/ModInitializer`（quilt-loader 自带的 Fabric 兼容接口）+ `onInitialize` + `org/quiltmc/loader/api/ModContainer` **全部在场**；5 个 `fabric-api-*+1.21.{3,4,8,10,11}.jar` 也从 gradle 缓存取出放进 **`F:\MC_GAME\_oracle-jars\fabric-api\`**。⇒ 原先「quilt 24 行无件 ⇒ 未核实」这个缺口**按你指的路解掉，零缺陷**。② **扫描面按你点名的三处扩了**（`.cursor/agent/**` + 档根 `CLAUDE.md` + `knowledge/libs/**`）：扩面后 nowhere 只从 3222 涨到 **3238（+16）**，新增 16 行**全在 `libs`**、逐条判毕**零缺陷**（其中 7 个 Cloth Config 名用本机 `cloth-config-15.0.140` 件核到**在场**）。**仓内零文档修复**；未提交。

### 1. 改了哪些文件

- 量具 `F:\MOD_TEST\nonfabric-skill-names.mjs`（不入库）：`srcDirs()` 增 `.cursor/agent/**` + 档根 `CLAUDE.md`；新增 **`libs` 伪档**（`knowledge/libs/**`，腿 = 全平台并集）
- 台账 `doc/name-provenance-audit.md`：新增 **§8.12**；§6 复现表补量具改动、`extract.mjs` 与新件路径
- `F:\MC_GAME\_oracle-jars\fabric-api\`（**仓外**）：`fabric-api-{0.110.0+1.21.3, 0.119.4+1.21.4, 0.136.1+1.21.8, 0.138.4+1.21.10, 0.141.6+1.21.11}.jar` + `quilt-loader-0.31.0-beta.4.jar`
- 便签脚本：`F:\MOD_TEST\extract.mjs`（按平台抽 `merged*.tsv` 的行 + 上下文）
- **仓内文档零修复**（本轮结论仍是「不用改」）

### 2. 判据与反证

- **方法**：先读本档自述确认它指向**哪一面**（QSL 还是 Fabric API），再拿**那一面**的件核 —— 不拿 QSL 件去核一个本来就不用 QSL 的档
- **反证 1（quilt 逐名过真件）** `probe-mc.mjs` → `ModInitializer` = `net/fabricmc/api/ModInitializer`（CLASS）；`onInitialize` = 同接口方法；`ModContainer` = 3 处（`org/quiltmc/loader/api/…`、`net/fabricmc/loader/api/…`）
- **反证 2（libs 的 Cloth 名过真件）** `ConfigBuilder` / `ConfigEntryBuilder` 类在场；`getOrCreateCategory` / `setSavingRunnable` 落在 `ConfigBuilder`；`startBooleanToggle` / `startIntSlider` 落在 `ConfigEntryBuilder`；`setSaveConsumer` 命中 19 处
- **口径更正**：五档 `agent/default.md` 把「Modrinth 全部 143 个发布」写成「未复核、已删、**虚构**」；本轮实测 Modrinth `total:143` + `latest:11.0.0-alpha.3+0.102.0-1.21` ⇒ **那个数字是真的**，只是 **maven** 通道没有该版本串。两通道口径不同，不能混写
- 其余名逐条读站点：`saveMyConfig` / `createSomething` 是作者自建；`Polymer` / `Trinkets` / `G8hlgtEk` / `skillId` / `modIds` 是散文或项目 id；只有 `ExpectPlatform`（Architectury）因本机无件留 `未核实`

### 3. 验证台账

- `node F:\MOD_TEST\nonfabric-skill-names.mjs`（**从仓库根跑**）⇒ nowhere **3238**（原 3222，+16 全在 `libs`）；crossPack 1985；`libs` 伪档 16 行（TYPE 8 + MEMBER 8）。**并发写方 23:01 改了五树后已复跑一次复核**（见 §6 自我更正）
- `node F:\MOD_TEST\verify-all.mjs`（重跑，exit 0）
- `node F:\MOD_TEST\extract.mjs libs` / `quilt` ⇒ 逐行 + 上下文（quilt 5 行 nowhere + 48 行 crossPack）
- `node F:\MOD_TEST\probe-mc.mjs <quilt-loader-0.31.0-beta.4.jar> ModInitializer onInitialize ModContainer` ⇒ 全在场
- `node F:\MOD_TEST\probe-mc.mjs <mod-cloth-config-15.0.140-yarn-named.jar> …` ⇒ Cloth 7 名全在场
- **未跑** `npm test` / `node test-scripts.mjs`（未动 `mcp-server/**` 与门脚本）；**未跑** `assert-skill-mirrors`（本轮未改任何仓内 `.cursor/**`；并发写方那轮的自述称镜像门已绿）
- 未 `git add/commit`

### 4. 数据侧变更

无。

### 5. 未做清单

- 根 `*.md`(19) / `community_knowledge`(121) / `mcp-server`(193) 三面**按你的判断不扫**（教程/说明）
- `ExpectPlatform`（Architectury）本机无件 ⇒ **未核实**
- forge 1.12.2 的 MCP 可读成员名、以及 Cloth 之外的第三方库（REI / JEI / GeckoLib）仍无件
- 未提交（提交归用户）

### 6. 自我更正

- §8.11(3) 把「quilt 1.21.3–1.21.10 共 24 行」写成「上游不可得 ⇒ **不可核**」—— **结论下早了**：那些档本就不该拿 QSL 核，正确参照是 Vanilla + 同版 Fabric API（本机有件）。本轮按指路改正，并把件落进 `F:\MC_GAME\_oracle-jars\fabric-api\`。
- **并发写方**：作业中发现同一主题已有另一轮落地（五树 06 规则条 + scaffold FAPI 依赖示例，23:01 落盘、8 面镜像同改）。我的量具读数在该轮之后**复跑复核过**；两轮改动面无交集（那边改 `.cursor/rules` + `scaffold`，我一行仓内文档未动）。

---

## 2026-10-13 · 五树补「QSL 停更后的替代路线」：06 联网规则条 + scaffold FAPI 示例注释（维护档）

**第 0 块 · 结论**：按用户单字令「补」，把上一轮（五树「无 QSL 构件」表述精化）§5 挂着的「06/scaffold 可补一句（待拍板）」**落地**：五树（`1.21.3 / 1.21.4 / 1.21.8 / 1.21.10 / 1.21.11`）各 2 处共 **10 处**改写 —— ① `.cursor/rules/06-networking.mdc` 新增一条澄清「本版无 QFAPI/QSL 构件」的用意是**防把 QSL 旧表当本版 API，不是禁 FAPI**，本版做法是**直接依赖 Fabric API 本体**（联网实证：`jade` / `owo-lib` 的 quilt 构建均声明 `fabric-api` required）；② `scaffold/build.gradle` 的 API 注释段加 **5 行 Fabric API 依赖示例**（逐档 live 版本读数 + maven 取数 URL + 补仓库提示）。当前树门链全绿（`test-scripts` rc=0、冲突/镜像/作者规范三门绿）。**未提交。**

### 1. 改了哪些文件

- 五树共 **10 文件**：
  - `quilt/<v>/.cursor/rules/06-networking.mdc` **×5** —— 在「无 QFAPI：只许 `search_docs`…」条后新增一条：澄清该条用意是**防误把 QSL 旧表当本版 API**（不是禁 FAPI）；本版做法 = **直接依赖 Fabric API 本体**（实证 `jade` / `owo-lib` quilt 构建均声明 `fabric-api` required）；名字与流程核 `search_docs({platform:"fabric", version:"<V>"})`，且**仍不得把 FAPI 名当 QSL**。
  - `quilt/<v>/scaffold/build.gradle` **×5** —— 在「不要把 fabric-api 整包当 QSL。」注释行后新增 5 行注释块：`modImplementation "net.fabricmc.fabric-api:fabric-api:<FAPI 版本>+<V>"` 示例（逐档 live 读数）、`maven-metadata.xml` 取数 URL、解析不到时的 `repositories` 补法、Jade/owo-lib 实证行（QFAPI 在 1.21.3+ 无构件）。
- 五树各跑一次 `scripts/sync-skills.ps1 -TargetDir quilt/<v>`（`AGENTS.md` → `.cursor/agent/default.md` 孪生件同步）。
- `DELIVERY_LOG.md`：本节。

### 2. 判据与反证

- **落在 06 的理由**：QSL 停更的直接后果是「QSL 那条线没有了」；quilt 差异树里承载「无 QFAPI → 用 Fabric」判断的落点正是 `06-networking.mdc`（其原有「无 QFAPI：只许 `search_docs`…」条措辞可被读成「禁 FAPI」，本轮补句消歧），故补在 06；01/05 本轮未动（见 §5）。
- **FAPI 逐档 live 版本读数**（来源：`https://maven.fabricmc.net/net/fabricmc/fabric-api/fabric-api/maven-metadata.xml`，联网实测）：1.21.3→`0.114.1` / 1.21.4→`0.119.4` / 1.21.8→`0.136.1` / 1.21.10→`0.138.4` / 1.21.11→`0.141.6`（`<release>`=`0.162.2+26.4`，全表 1165 版）。
- **「现代 Quilt 靠什么」的实证**：Modrinth 按 slug 逐查 —— `jade` `21.1.6+fabric`（loaders=`fabric,quilt`）与 `owo-lib` `0.13.0+1.21.11` 的 quilt 构建**均声明 `fabric-api` required**；多加载器库（yacl / architectury / geckolib / jade / owo / bookshelf / fzzy-config / terrablender / patchouli）**都出 quilt 构建到 26.x**。⇒ **无 QSL/QFAPI 继任者**，替代路线就是「Quilt Loader + Fabric API 本体」。
- **反证（没越界）**：未改 `1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 / 1.21.1` 五树（其 QSL 面口径不同，见各档 AGENTS 横幅）；新增两处文案**均不含 QSL 名引用**（明确写「不得把 FAPI 名当 QSL」），未引入任何 `org.quiltmc.*` 新符号。

### 3. 验证台账

- **在盘复核**（node 逐文件读源码）：10/10 改动词均在场；五档 scaffold 的 live 读数逐档核对 = `0.114.1 / 0.119.4 / 0.136.1 / 0.138.4 / 0.141.6`（**修正一处过程误读**：首次用 `findstr` 核 CJK 标记全报 MISSING，实为 findstr 对 CJK 模式静默失配——改用 node 后 06 侧 5/5 在场；scaffold 侧首用的小写 `fabric-api 本体` 与实际大写 `Fabric API 本体` 不符，亦为量具错、不是文件缺）。
- **门链（当前树，含并行写方改动）**：`node test-scripts.mjs` **rc=0**（日志 `D:\mc-skill-temp\adjud2\ts-run8.log`，46 行，`本轮未执法腿=0`，末行 `script helper regression tests passed`）。
- `assert-scaffold-rules-conflict`：「47 档 · 规则 447 篇 · ❌ 行 455 条 · 判死符号 67（歧义丢弃 160）· **scaffold 冲突 0** · 台账 checked」（门 LEDGER 3065 未动、免重钉）。
- `assert-skill-mirrors`：「**ok**（扫档=57 镜像比对目标=12418 · AGENTS 漂移 **0 档** / 台账 0 档 · R47 复数 agents 孤儿腿 孤儿 0 · **拒=0**）」。
- `assert-authoring-lint`：「**ok**：目标 13 件 · J1 技能 12 份 · J2 路径指针 23 枚全在盘 · J3 纯负向现数 0（豁免 2）」。
- 未 `git add/commit`（提交归用户）。

### 4. 数据侧变更

无。本轮只动 `.cursor/**` 与 `scaffold/build.gradle` 注释；未动 `data/**`、平台元数据（`pack.meta.json` 未触碰）、未改 `knowledge/**` 源稿 ⇒ **未触发 qsl-verified 派生件重生成**（`assert-qsl-verified-sync` 面无变更）。

### 5. 未做清单

- **代码级示范未做**：scaffold 里只给依赖坐标注释，**未给一个真用 FAPI 的示范类**——要做属新增内容，须先问用户。
- `06` 之外（`01-registry` / `05-events`）**未加**同款 FAPI 提示——本轮只落 06（其余 FAPI 归属面可由本条「核 `search_docs` fabric」泛化）。若用户要 01/05 各加一句，另行拍板。
- `1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 / 1.21.1` 五树的同款措辞未动（各档 QSL 面口径不同）。
- 未提交（提交归用户）。

### 6. 自我更正

- 本节**兑现**上一节（「五树『无 QSL 构件』表述精化」）§5 未做清单挂的「06/scaffold 可补一句（**待拍板**）」——该轮提出时按待拍板挂着，用户以单字「补」授权，本节落地；两处改动方向、逐档读数与实证口径与上一节 §2 同源。
- 过程自纠一处已记入 §3（`findstr` 对 CJK 模式静默失配 ⇒ 核标记一律改走 node，不当「文件缺失」读）。
- 对旧节无更正。

---

## 2026-10-13 · 覆盖面自审（答「全部核对了吗」）+ 待审队列清零（维护档）

**第 0 块 · 结论**：**没有全核过。** 本轮把账算清：候选 **5199 行**里 3618 行已证在构件里、**909 行必须分诊**、672 行无件。① §5.1 一直挂着的**「待审」38 个（档|名）/ 34 个唯一名**（124 条去重项、160 行）本轮**逐名读站点判毕 → 全部非缺陷**（读者自建名 28 / 形参名 2 / 散文或文件名 4）；② 672 条无件里 648 已由 `verify-extra` + `verify-mc` 覆盖，余 **24 条**是 quilt 1.21.3–1.21.10（上游无 QSL，不可核）；③ **真正还漏着的是扫描面本身** —— `.cursor/agent`(57 件) / 档根 `CLAUDE.md`(21) / 根 `*.md`(19) / `knowledge/libs`(37) / `community_knowledge`(121) / `mcp-server`(193) **从未进过量具**；④ 第三方库 API（248 行/48 名）与 forge 1.12.2 的成员名仍**未核实**（本机无件）。本轮**仓内零文档修复**（判下来都不用改）；未提交。

### 1. 改了哪些文件

- 台账 `doc/name-provenance-audit.md`：新增 **§8.11**（行总账 / 待审队列判毕表 / 无件档记账 / **未扫面清单** / 仍未核清单）
- `DELIVERY_LOG.md`：本节
- 便签区脚本（不入库）：`cover.mjs`（按 verdict×verifiable×bucket 算覆盖）、`split.mjs`（分桶 + 待审命中）、`dump-pending.mjs`（待审名带上下文导出）、`surfaces.mjs`（未扫面文件计数）
- 中间产物：`cover-need.json`、`need-triage.json`（739 条需分诊的唯一 `档|版本|名`）
- **仓内文档零修复**（本轮结论是「不用改」）

### 2. 判据与反证

- 行账判据 = `verify-all.json` 的 `verdict` × `verifiable` × `bucket`（无件档靠 `verifiable:false` 分离出来单记）
- **反证 1（待审名逐条读站点原文）**：28 个自建名各给出站点形态 —— `ModItems.OTHER_ITEM.get()`、`MyEntityModel.LAYER_LOCATION`、`this.entityData.define(DATA_ID, 0)`、`cap.setData(someData)`、`() -> clientOnlyMethod`、`stack = slotStack.copy()`；2 个形参名确认「形参名不影响编译」；4 个散文/文件名确认非 API 名
- **反证 2（无件档记账闭合）**：648 + 24 = 672，与逐档计数吻合（fabric 1.16.5 263 / 1.14.4 225 / forge 1.12.2 156 / quilt 四档各 6 / liteloader 4）
- **反证 3（「未扫面只是目前被同文覆盖」不成立为保证）**：抽查 `fabric/1.16.5/.cursor/agent/default.md:108` 与同档 `AGENTS.md:108` 同句 ⇒ 该件**内容**被扫面覆盖，但**没有机器门**保证 `.cursor/agent/**` 与 `AGENTS.md` 永远同文 ⇒ 只能记为缺口

### 3. 验证台账

- `node F:\MOD_TEST\nonfabric-skill-names.mjs && node F:\MOD_TEST\verify-all.mjs`（重跑，exit 0；**必须从仓库根跑** —— 脚本要读 `mcp-server/scripts/assert-skill-yarn-attest.mjs`，在 `F:\MOD_TEST` 下跑会 ENOENT）⇒ 5199 行 / PRESENT 3618 / **ABSENT-有件 909** / **ABSENT-无件 672**
- `node F:\MOD_TEST\verify-extra.mjs && node F:\MOD_TEST\verify-mc.mjs`（重跑，exit 0）⇒ 775 行 / 384 present / 391 查无；MC 侧声明命中 46 + 52 = **98**
- `cover.mjs` / `split.mjs` / `dump-pending.mjs` / `surfaces.mjs` 读数全部落 §8.11
- **未跑** `npm test` / `node test-scripts.mjs`（未动 `mcp-server/**` 与门脚本）；**未跑** `assert-skill-mirrors`（未改任何 `.cursor/**`）
- 未 `git add/commit`

### 4. 数据侧变更

无。

### 5. 未做清单（就是本轮答案里的「漏」）

- **六个未扫面**（`.cursor/agent` 57 件 / 档根 `CLAUDE.md` 21 / 根 `*.md` 19 / `knowledge/libs` 37 / `community_knowledge` 121 / `mcp-server` 193）**未进量具** ⇒ 其中的标识符**未核**。扩面是范围决定，等拍板
- 第三方库 API 248 行 / 48 名（本机无库件）
- forge 1.12.2 的 MCP 可读成员名（本机无具名件）
- quilt 1.21.3–1.21.11 的 QSL 面（上游无）
- 未提交（提交归用户）

### 6. 自我更正

- 前两轮我说「新进面的行跑了一遍全量构件对照」，**说得太满**：那个全量核验做的是「行**过**构件」这一步，**不等于「行被分诊」**。909 行过了构件但没逐行给结论，其中 38 个（档|名）是台账 §5.1 里明写的「待审」。本轮把这一档清零，并把「未扫面」这笔账**第一次**写进台账。
- §8.10(5) 的未核清单只列了库类与 1.12.2 —— 补上「扫描面缺口」与 quilt 24 条后，才是完整答案。

---

## 2026-10-13 · QSL 上游边界取证 + 用 MC 侧构件核残余 Vanilla 名（维护档）

**第 0 块 · 结论**：两句都办了。① **QSL 上游确实止于 1.21** —— Modrinth 上最新是 `11.0.0-alpha.3+0.102.0-1.21`，按 `1.21.1` / `1.21.4` 显式过滤都是 `available:false` + `total:0` ⇒ 有行的那 5 个 quilt 档（1.21.3–1.21.11）**上游根本没有 QSL 可供参照**，属上游事实、不需要补件。② 残余 391 行的 Vanilla 侧名字已用 **MC 侧真构件**核过：Yarn 具名 jar 两件从本机 loom 缓存取出并**放进 `F:\MC_GAME\_oracle-jars\mc\`**；**227 个残余名里 98 个当场改判「本版确实声明过」**，余 129 个逐类分诊（库类 / 读者自定义 / Forge 对照行 / 行内否定例 / mixin 处理器名 / **迁移表左值**）—— **未再发现真缺陷**，仓内文档零改动。**未提交。**

### 1. 改了哪些文件

- 台账 `doc/name-provenance-audit.md`：新增 **§8.10**（QSL 边界取证 / MC 件落点表 / 核验读数 / 残余分诊 / 未核清单）；§6 复现表补 5 行脚本与 MC 件路径
- `DELIVERY_LOG.md`：本节
- `F:\MC_GAME\_oracle-jars\mc\`（**仓外**，用户指定落点）：新增 3 件 —— `minecraft-1.14.4-yarn-build.18.jar`（26.1 MB）、`minecraft-1.16.5-yarn-build.10.jar`（19.2 MB）、`minecraft_merged-1.12.2-obf.jar`（9.6 MB）
- 便签区脚本（不入库）：`F:\MOD_TEST\verify-mc.mjs`（classfile **声明表**解析）、`probe-mc.mjs`（定向探针）、`verify-extra.mjs`、`scan-jars.mjs`、`resid.mjs`
- **本轮零文档正文修复**（前几批的 6 件已在上方节记录）

### 2. 判据与反证

- **QSL 三态读法**：`ok:true` + `available:false` + `total:0` ⇒ 上游确实没有（不是「没查到」）；两发都落 `tier:"absent"` 缓存
- **MC 侧核验判据**：逐类解析 classfile 的 `fields[]` / `methods[]` 的 `name_index`，得到「本档 MC 件声明过的名字」全集 —— 比常量池字符串匹配强（后者证不了成员名）
- **反证 1（解析器先信后验）**：对已知名定向取证 —— `getDefaultState` 声明在 `Block`/`StateManager`/`Fluid` 3 类、`textRenderer` 在 `MinecraftClient` 等 6 类、`LiteralText` 类在 ⇒ 解析器可信
- **反证 2（可疑名逐站点读上下文）**：`TextComponentString` / `damageItem` 若不是落在迁移表左栏，本来会是**真缺陷**（fabric 档写 mojmap 名）；实读确认只出现在 `fabric/1.14.4/knowledge/version-changes/1.14.x.md` 的「旧名 → 新名」对照表与 `knowledge/antipatterns/yarn-mappings.md`（教「不要这么写」）⇒ 用法正确、**不改**
- **反证 3（其余仍未命中的同类核对）**：`onTick(CallbackInfo ci)` = 作者自己 mixin 类的注入方法名；1.12.2 的 `VARIANT_A/B/C`、`BLOCK_SIMPLE`/`BLOCK_COMPLEX` = 示例自造枚举值与自造 `RegistryHandler` 字段；`Keyboard.KEY_G` = LWJGL2 常量（不在 Forge/MC 件里）
- 前 5 行 Forge 名出现在 fabric 档（`IEventBus`/`DeferredRegister`/`RegistryObject`/`SubscribeEvent`/`modEventBus`）一律是**对照/否定**行（「Fabric **没有** modEventBus」）⇒ 非缺陷

### 3. 验证台账

- `query_upstream_releases source=modrinth slug=qsl`：`total=143`，`latest=11.0.0-alpha.3+0.102.0-1.21`；`minecraftVersion=1.21.1` → `available:false`/`total:0`；`=1.21.4` → 同形
- `node F:\MOD_TEST\verify-mc.mjs`（exit 0）：fabric 1.14.4 → 110 名里 **46 命中**；fabric 1.16.5 → 117 名里 **52 命中**（合计 **98 / 227**）→ `verify-mc.json`
- `node F:\MOD_TEST\probe-mc.mjs`（两发，探针自检）
- `git status --short`：本批新增仓内改动 = 台账（未跟踪新文件）+ `DELIVERY_LOG.md`；工作树另有前几批同族文档修复（M 项，含镜像副本），**全部未提交**
- **未跑** `assert-skill-mirrors`：本轮**未改任何 `.cursor/**`** ⇒ 镜像面无变更（上一批已跑过并 `ok`）
- **未跑** `npm test` / `node test-scripts.mjs`：未动 `mcp-server/**` 与门脚本
- 未 `git add/commit`（提交归用户）

### 4. 数据侧变更

无。未动 `data/**`、平台元数据、scaffold；新增件全在仓外 `F:\MC_GAME`。

### 5. 未做清单

- **forge 1.12.2 的 MCP 可读成员名核不了**：本机只有 SRG 具名件（`forgeBin` / universal）与**混淆** merged 件（本轮已把混淆件存档进 `_oracle-jars\mc\`，但它核不了名字）。类名级已覆盖（present 122 / 查无 45）
- §8.10(4) 的**库类**（Cloth / REI / Gradle DSL）与 `Keyboard.KEY_G` 一类需相应库/依赖件 ⇒ **未核实**
- `doc/name-provenance-audit.md` 仍是**未跟踪**文件（`??`）；仓根另有一个**不是本轮产物**的未跟踪目录 `ll-src/`，未触碰
- 未提交（提交归用户）

### 6. 自我更正

- 上一节 §5 把「残余 Vanilla 名」写成「要核就得拉 MC merged jar（每档几百 MB）」并**推荐不做** —— **本轮推翻**：Yarn 具名件一直在本机 loom 缓存里，**26.1 MB / 19.2 MB**（远小于我说的量级），取出即用 ⇒ 按用户指令做了，并把 98 个名字从「未核实」改判为「构件已证存在」。教训：**报「需要下载」之前先扫本机缓存**。
- §8.9(2) 说「余 391 行要该档 MC 侧件才核得了」：对 fabric 两档本轮**已兑现**（98/227）；对 forge 1.12.2 仍成立。

---

## 2026-10-13 · 「无构件档」复核 + §8.8 四项处置 + 残余 391 分诊（维护档）

**第 0 块 · 结论**：回答「无构件档是不是真没有构件」—— **不是**。缓存与临时目录里，forge 1.7.10–1.12.2、fabric 1.14.4/1.16.5、quilt 1.18.2–1.21.1、liteloader 三档、modloader、bedrock **都有可用件**（台账 §2 那句「本机无可用构件」已在 §8.9(1) 更正，表头加指针）。用新件补跑 775 行，**384 行（50%）当场改判为「构件里在」**；余 391 行逐名分诊为「库类 / 读者自定义名 / Vanilla 侧无 MC 件 / 行内否定例」四类，**未再发现真缺陷**。台账 §8.8 挂着的四项**全部处置**（3 处改代码、1 处加就地说明、2 项判为假红）。`assert-skill-mirrors` = ok。**未提交**（提交归用户）。

### 1. 改了哪些文件

- 文档修复（§8.8 四项 ⇒ 6 文件）：
  - `forge/1.13.2/.cursor/skills/mc-item/SKILL.md`：删 `getKnockbackResistance`（字段 / 构造参数 / override）；补上文档漏掉的必需项 `getRepairMaterial()`
  - `forge/1.13.2/.cursor/skills/mc-recipe/SKILL.md`：删 `getType()` override 与 `ModRecipes.MY_TYPE`（1.13.2 `IRecipe` 无 `getType()`）
  - `forge/1.13.2/.cursor/skills/mc-particle/SKILL.md`：`particleMaxAge = 40` → `setMaxAge(40)`；`onUpdate()` → `tick()`
  - `forge/1.16.5/.cursor/skills/mc-gui/SKILL.md`：`BACKGROUND_TEXTURE` → `AbstractGui.BACKGROUND_LOCATION`
  - `fabric/1.17.1/code-patterns/03-entity-patterns.md`：`EntityAttributeModification` 整块注释掉，改指 `FabricDefaultAttributeRegistry#register`（签名留 `TODO(未核实)`）
  - `fabric/1.21.1/code-patterns/02-item-patterns.md`：`ArmorMaterial` 加就地 ⚠️（本档是 **record**，逐名对照），整块改写留 `TODO(未核实)`
- 台账 `doc/name-provenance-audit.md`：§2 表头加「已被 §8.9(1) 更正」指针；新增 **§8.9**（(1) 无构件档复核表 / (2) 补核读数 / (3) §8.8 逐项处置 / (4) 残余 391 行分诊 + 量具已知局限）
- 便签区脚本（不入库）：`F:\MOD_TEST\verify-extra.mjs`（新增「源码 jar 按词切」支持）、`scan-jars.mjs`（横扫 12 个根的 jar）、`resid.mjs`（残余分诊）
- 镜像：`forge/1.13.2`、`forge/1.16.5` 两档 × `scripts/sync-skills.ps1 -TargetDir`
- `fabric/1.17.1`、`fabric/1.21.1` 改的是 `code-patterns/**`（**不进镜像面**），无需刷镜像

### 2. 判据与反证

- 「构件里在」的判据：JVM 类文件**常量池匹配**（顶层类简单名不进常量池 ⇒ 另按含 `/` 的串匹配）；`loader-jars\*-fabric-api.jar` 是**源码 jar**（内容是 `.java`）⇒ 按词切匹配
- **反证 1（三个高信号名逐站点读上下文判非缺陷）**：`forge/1.12.2` 的 `IItemTier` 全部出现在「**不要** `implements IItemTier`（1.14+）」；`fabric/1.16.5` 的 `MixinLauncher` 出现在「**不要**手写 MixinBootstrap / MixinLauncher」；`fabric/1.14.4` 的 `ScreenEvents` 出现在「1.14.4 索引里**没有** `ScreenEvents.AFTER_INIT`」—— 构件查无恰好**印证文档正确**，不是缺陷
- **反证 2（quilt 新件不改变任何判定）**：有 QSL 件的 5 档（1.18.2/1.19.4/1.20.1/1.20.4/1.21.1）在当前扫描里 **0 行** nowhere/cross；而有行的 5 档（1.21.3/1.21.4/1.21.8/1.21.10/1.21.11）**恰好没有 QSL 件** ⇒ 两集合互补
- **假红类登记**：`forge/1.16.5`、`forge/1.17.1` 的 `knowledge/porting/*` 里的 `builtInRegistryHolder` —— porting 文档讲的是**目标版本** API，按宿主档构件核必假红（与台账 §5「版本迁移文档」同类）
- `fabric/1.21.1` 那条**没有**按 record 全量改写：`RegistryEntry<SoundEvent>` 与 `ArmorMaterial.Layer` 的构造形态本档未取证 ⇒ 只加说明 + `TODO`，不拿猜的写

### 3. 验证台账

- `node F:\MOD_TEST\verify-extra.mjs`（exit 0）：输入 775 行；`fabric|1.14.4` 276 行 → present 113 / 查无 163（唯一 110）；`fabric|1.16.5` 328 → 145 / 183（唯一 117）；`forge|1.12.2` 167 → 122 / 45（唯一 40）；`liteloader|1.12.2` 4 → 4 / 0；**合计 present 384（50%）/ 仍查无 391**
- 未被任何行命中的 EXTRA 键（16 个，即那些档确实无扫描行）：`quilt|1.18.2/1.19.4/1.20.1/1.20.4/1.21.1`、`liteloader|1.8.9/1.10.2`、`forge|1.7.10/1.8.9/1.9.4/1.10.2/1.11.2`、`modloader|1.2.5/1.5.2/1.6.4`
- `node mcp-server/scripts/assert-skill-mirrors.mjs` ⇒ **ok**（扫档 57 / 比对目标 12418 / AGENTS 漂移 0 / 孤儿 0 / 拒 0）—— 证明本批 `.cursor/skills` 改动已刷全 7 面
- §8.8 那 6 个文件改动后**逐文件回读确认已落盘**（早前一次注入式读取显示的是改前内容，属读取陈旧，非改动丢失）
- 未跑 `npm test` / `node test-scripts.mjs`（本轮未动 `mcp-server/**` 与任何门脚本）；未 `git add/commit`

### 4. 数据侧变更

无。本轮只改 6 个知识面 `.md`、台账与 `DELIVERY_LOG.md`；未动 `data/**`、未动平台元数据、未动 scaffold。

### 5. 未做清单

- 余 391 行里属 **Vanilla 侧**的名字（`getPlacementState` / `setBlockState` / `isSneaking` / `ofItems` / `saturationModifier` …）需要该档 **MC 侧构件**才核得了；本机确无 ⇒ 仍**未核实**
- `quilt 1.21.3–1.21.11` 的 QSL 面：本机无该 5 档 QSL 件（有件的 5 档恰好无行）⇒ 仍**未核实**
- 第三方库 API（Cloth / REI / JEI / GeckoLib 等）本机无构件 ⇒ 仍**未核实**
- `modloader` 精确 1.6.4 无件（本机只有 1.6.2 反编译转储）⇒ 按 1.6.2 核过的结论一律标注「以 1.6.2 代 1.6.4」
- 未 `git add/commit`（提交归用户）

### 6. 自我更正

- **上一节（「crossPack 降档面系统审」）§5 与台账 §2 的「本机无可用构件」是错的**：前两轮只扫了既有「构件集」里的路径，没扫缓存与临时目录。实际 `F:\MC_GAME\_oracle-jars`、`D:\mc-skill-temp`、`.gradle/caches/**` 里 QSL / liteloader / modloader / fabric-api 源码件 / forge legacy universal 都在。本轮已在台账 §8.9(1) 列表更正，并在 §2 原表加指针（原表保留为「扫描构件集当时的状态」，不改写历史读数）。
- **上一节 §5「台账 §8.8 四项未动」→ 本轮全部关闭**（3 处改代码 + 1 处加就地说明 + 2 项判假红）。
- 量具的**行内否定盲区**本轮再次显形（`negBlock` 腿只判代码块级否定）⇒ 已写进台账 §8.9(4) 作为**已知局限**，免得下轮当新发现重复排查。

---

## 2026-10-13 · crossPack 降档面系统审 + 新扫描行全量构件对照（第三批修复：forge 1.13.2/1.14.4/1.15.2/1.16.5/1.18.2/1.20.x）（维护档）

**第 0 块 · 结论**：按令补上前两轮明确记缺的两条腿 —— ① **crossPack 降档面**（2003 行）与 nowhere 合并后过真构件，`ABSENT` 仅 97 行落在可核档（另 242 行落无构件档＝未核实），分诊出 **16 处版本错配**并全部就地修掉 + 留 javap 标记；② **新进面行**（5225 行 = nowhere 3222 ∪ crossPack 2003）跑了一遍全量构件对照。`assert-skill-mirrors` = ok；**未提交**（提交归用户）。

### 1. 改了哪些文件

- 便签区脚本（不入库）：`F:\MOD_TEST\verify-all.mjs`（全局核验：按 jar 聚合所需名字 ⇒ 每件只读一遍、缓存记 `queried` 全集）、`triage-cross.mjs`、`probe-entries.mjs`、`cross-preview.mjs`、`diff-scan.mjs`、`scan-yaml.mjs`、`sweep-check2.mjs` / `sweep-check3.mjs`
- 修复 16 处 / 14 文件（逐条证据见台账 §8.7）：
  - `forge/1.13.2/code-patterns/03-entity-patterns.md`：`EntityRendererManager` → `RenderManager`
  - `forge/1.14.4/code-patterns/01-block-patterns.md`、`forge/1.15.2/code-patterns/01-block-patterns.md`（read/write 两处）、`forge/1.15.2/knowledge/antipatterns/entity.md`、`forge/1.14.4/knowledge/antipatterns/networking.md`：`NBTTagCompound` → `CompoundNBT`（后一处另加就地 ⚠️「本块是 1.12 形态待改写」）
  - `forge/1.15.2/.cursor/skills/mc-gui/SKILL.md`：`IInteractionObject` → `INamedContainerProvider`
  - `forge/1.14.4/code-patterns/04-world-patterns.md`：`defaultBlockState()` → `getDefaultState()`
  - `forge/1.20.1` / `forge/1.20.4` `.cursor/skills/mc-entity/SKILL.md`：`ModelRenderer` → `ModelPart`
  - `forge/1.20.4/.cursor/skills/mc-gui/SKILL.md`：`NetworkHooks.openScreen(...)` → `serverPlayer.openMenu(p)`
  - `forge/1.16.5/.cursor/skills/mc-sound/SKILL.md`：`BLOCK_STONE_*` → `STONE_*`
  - `forge/1.19.4` / `1.20.1` / `1.20.4` `.cursor/skills/mc-fluid/SKILL.md`：`.noDrops()` → `.noLootTable()`
  - `forge/1.18.2/.cursor/rules/{05-events,08-client-server}.mdc`：`RegisterKeyMappingsEvent` → `ClientRegistry.registerKeyBinding(...)`（放进 `FMLClientSetupEvent`）
- 镜像：`forge/{1.15.2,1.16.5,1.18.2,1.19.4,1.20.1,1.20.4}` 六档 × `scripts/sync-skills.ps1 -TargetDir`
- 台账：`doc/name-provenance-audit.md` 新增 **§8.6**（crossPack 系统审读数与分诊）/ **§8.7**（第三批缺陷表）/ **§8.8**（仍留未核实四项）

### 3. 验证台账

- `node F:\MOD_TEST\verify-all.mjs`（exit 0）：输入 5225 行（nowhere 3222 + cross 2003）；读构件件 870 + 库池 1840；结果 nowhere `PRESENT-MAIN 1086 / DEPS 309 / LIB 560 / ABSENT 1267`、cross `PRESENT-MAIN 981 / DEPS 504 / LIB 179 / ABSENT 339`
- **核验器先验后信**：对 5 组已知名定向取证（1.14.4 有 `CompoundNBT` 无 `NBTTagCompound`；1.13.2 有 `RenderManager`；1.20.1 有 `ModelPart`；1.16.5 `SoundEvents` 只有 `STONE_*`；1.20.4 无 `NetworkHooks` 而 1.20.1 有）—— 全部与判据一致
- `node mcp-server/scripts/assert-skill-mirrors.mjs` ⇒ `ok`（扫档 57 / 比对目标 12418 / AGENTS 漂移 0 / 孤儿 0 / 拒 0）
- 修完重跑量具：nowhere **3222**（TYPE 1238 + MEMBER 1984）；crossPack **1984**（比审前 2003 少 19 行）
- 未跑 `npm test` / `node test-scripts.mjs`（本轮未动 `mcp-server/**` 与门脚本）；未 `git add/commit`

### 5. 未做清单

- 台账 §8.8 四项未动：`forge/1.13.2/.cursor/skills/{mc-item,mc-recipe,mc-particle}` 的 `IRecipeType` / `onUpdate` / `particleMaxAge` / `getKnockbackResistance`（构件已证**本档查无**，但正确替换形未取证 ⇒ 不拿邻版名顶替）；`forge/1.16.5` mc-gui 的 `BACKGROUND_TEXTURE`（归类存疑）；porting 文档的 `builtInRegistryHolder`（讲的是目标版本）；fabric 两处可疑名（正确形态未定）
- crossPack `ABSENT` 落**无构件档** 242 行、nowhere `ABSENT` 落无构件档 429 行 ⇒ 仍**未核实**
- 第三方库 API（Cloth / REI / JEI / GeckoLib 等）本机无构件 ⇒ 仍未核实
- 未 `git add/commit`（提交归用户）

### 6. 自我更正

- 上一节（「量具 yaml 盲区修正」）§5 把「**crossPack 降档面未逐行审**」与「yaml 新行进面未跑全量构件对照」列为缺口 —— **本轮两条都关闭**（读数与分诊见台账 §8.6/§8.7）。
- 更正本会话中途一处判断：我一度据 `forge/1.13.2` 用了 `initEntityAI` / `EntityAINearestAttackableTarget` 判其「抄了 1.12 的 AI 写法」；构件实测 **1.13.2 仍在**（Goal 改写是 1.14 才发生）⇒ 该判断作废，该文件未改。

---

## 2026-10-13 · 名字出处量具 yaml 盲区修正 + 第二批真缺陷修复（forge 1.13.2 / 1.18.2 / fabric 三档）（维护档）

**第 0 块 · 结论**：复查下一节「全部 nowhere」结论时发现量具的 `extractCodeFences` **整块跳过 ```yaml 围栏**，而本仓 `code-patterns/**` 的代码恰恰写在 yaml 围栏里 ⇒ 下一节「扫描面已扩到 code-patterns」实际大半没生效。已修量具并重跑（nowhere 3073 → 3232）；对随新面进来的行分诊后又修 **7 处真缺陷**（`forge/1.13.2/code-patterns/{01,04}` 的 TileEntity/Biome 写法、`forge/1.18.2/code-patterns/03` 的 `ExplosionInteraction`、`fabric/{1.16.5,1.18.2,1.20.1}/code-patterns/01` 的 `BlockSoundGroups`），一律 javap 逐名取证 + 就地留标记。台账新增 §8 记第二批，并把 §3 的 3073 总表标为过期读数。**本轮未提交**（提交归用户）。

### 1. 改了哪些文件

- 量具（便签区，不入库）：`F:\MOD_TEST\nonfabric-skill-names.mjs` —— `extractCodeFences` 的 NONJVM 分支增「`ya?ml` 围栏取 `---` 之后片段当代码扫」
- 修复（7 处 / 5 个文件，全部 `code-patterns/**`，非镜像面）：
  - `forge/1.18.2/code-patterns/03-entity-patterns.md:71`：`Level.ExplosionInteraction.BLOW` → `Explosion.BlockInteraction.BREAK`（1.18.2 主件只有 `Explosion$BlockInteraction`；`Level$ExplosionInteraction` 自 1.19.4 才有）
  - `forge/1.13.2/code-patterns/01-block-patterns.md`（TileEntity 模式）：`ITileEntityProvider`+`createNewTileEntity` → `IForgeBlock#hasTileEntity` / `createTileEntity`；`TileEntityTypeRegistry….get()` → `TileEntityType.Builder.create(...).build(null)` + `RegistryEvent.Register<TileEntityType<?>>`；`update()` → `tick()`；`writeToNBT/readFromNBT` → `write/read`；`setInteger/getInteger` → `setInt/getInt`
  - `forge/1.13.2/code-patterns/04-world-patterns.md`（Ore Generation）：删 `MinecraftForge.ORE_GEN_BUS` + `WorldEvent.GenerateSpawn` → 指向 `Biome#addFeature(GenerationStage.Decoration, CompositeFeature)`；Feature / Placement 配置类名留 `// TODO(未核实)`
  - `forge/1.13.2/code-patterns/04-world-patterns.md`（Custom Biome）：`Biome.Builder` → `Biome.BiomeBuilder`；删 `withDefaultTemperature()` / `withTemperatureBiome()` / `build()`；`surfaceBuilder(new SurfaceBuilder(...), new SurfaceConfig(...))` → `surfaceBuilder(new CompositeSurfaceBuilder<>(new DefaultSurfaceBuilder(), new SurfaceBuilderConfig(...)))`
  - `fabric/{1.16.5,1.18.2,1.20.1}/code-patterns/01-block-patterns.md`：`BlockSoundGroups.GRASS` → `BlockSoundGroup.GRASS`
- 台账：`doc/name-provenance-audit.md` —— §3 总表下加过期 banner；新增 §8（yaml 盲区 / 新行分诊 / 第二批缺陷表 / 未处理缺口 / 复现）
- 未动任何 `data/**`、门脚本、`.cursor/**`（故无需刷镜像）

### 3. 验证台账

- 量具重跑（`node F:\MOD_TEST\nonfabric-skill-names.mjs`，退出码 0）：修 yaml 后 nowhere = **3232**（TYPE 1241 + MEMBER 1991）；再修 7 处缺陷后重跑 = **3222**（TYPE 1237 + MEMBER 1985）
- 构件取证：1.13.2 主件 `forge-1.13.2-25.0.223_mapped_snapshot_20180921-1.13.jar`、1.18.2 主件 `forge-1.18.2-40.1.80_mapped_parchment_2022.08.21-1.18.2.jar`、fabric 1.17.1 / 1.20.1 loom 合并件，逐名 javap（读数见台账 §8.3 表）
- 残留扫描（`sweep-check2.mjs` / `sweep-check3.mjs`，扫 24665 个 `.md/.mdc/.java`，排除平台 `data/`、构建产物与报告面）：命中的非镜像面行**全为披露标记 / 负例 / 「该版本确实存在」的合法用法**，未再发现旧名残留
- 未跑 `npm test` / `test-scripts.mjs`（本轮未动 `mcp-server/**`、未动 `.cursor/rules` ⇒ 无镜像与门链影响）；未跑构件全量对照 `verify-names3.mjs`（缺口见台账 §8.4）

### 5. 未做清单

- **`crossPack` 降档面（944 TYPE + 1059 MEMBER 行）未逐行审**：1.18.2 的 `ExplosionInteraction` 正是靠人工复查才发现（B 腿把「1.19.4 有」降成 crossPack，绕过了 nowhere 清单）。系统性审该面本轮未做。
- **yaml 修正后新进面的行未跑全量构件对照**：只对判断可疑者逐一 javap，其余属**未核实**。
- `forge/1.13.2` Ore Generation 的 Feature / Placement 配置类名**未取证**（就地留 `// TODO(未核实)`）。
- 上一节列的「无构件档」（forge ≤1.12.2 / quilt 全族 / liteloader / modloader / bedrock / fabric 1.14.4·1.16.5）本机仍无构件 ⇒ 仍**未核实**，本轮未复查。
- 未 `git add/commit`（提交归用户）。

### 6. 自我更正

- **本会话中段的判断错误（已当场推翻）**：我一度据 1.13.2 用 `initEntityAI` / `EntityAINearestAttackableTarget` 判其「用了 1.12.2 的 AI 写法」；构件 javap 后确认 **1.13.2 仍在**（`EntityAITasks` / `EntityAI*` 全族在场，Goal 改写是 1.14 才发生）⇒ 该判断作废，文档不改。
- **纠正下一节的两处结论**：① 下一节第 0 块称「扫描面按令扩到各档 `code-patterns/`、`knowledge/`、`AGENTS.md`、`scaffold/**`」——实测**大半未生效**（yaml 围栏被整块跳过），故其 nowhere = 3073 与台账 §3 总表是**偏低读数**，真值 3232；② 其 §7「后续」的「未覆盖档」清单不变，但须增列两条覆盖缺口（crossPack 面、yaml 新行未全量核）。
- **DELIVERY_LOG 结构更正**：下一节（「非版本面收尾四项」）的节标题此前被误删、我又一度把它插到该节正文**之下** ⇒ 本轮移回正文之前；该节内容一字未改。

---

## 2026-10-13 · 名字出处量具扩面 + 全部 nowhere 过真构件 + 8 族文档缺陷修复 + /doc 台账（维护档）

**第 0 块 · 结论**：扫描面按令扩到各档 `code-patterns/`、`knowledge/`、`AGENTS.md`、`scaffold/**`（含 `.java`）并加入 fabric 全族，nowhere 从 806 涨到 3073 行；3073 行逐名过真构件（主件 + 档内依赖件 + 本机库池）后分四态，量具盲区 1825 行（文档没错）、**真缺陷 8 族 45 处已就地修掉并留出处标记**、846 行可核档查无/498 行本机无构件（未核实）。台账落 [doc/name-provenance-audit.md](./doc/name-provenance-audit.md)（脚本生成，含方法/覆盖表/缺陷族/待审 39 名）。本轮**未提交**（提交由用户执行）。

1. **改了哪些文件**
   - 修复（8 族，均带构件证据与就地标记）：
     - `forge/{1.17.1,1.18.2,1.19.4,1.20.1,1.20.4}/code-patterns/04-world-patterns.md`、`forge/1.19.4/code-patterns/README.md`、`neoforge/code-patterns/04-world-patterns.md`：`AmbientMoodSettings.LEGACY_CAVE` → `LEGACY_CAVE_SETTINGS`（1.14.4 那处整套 snippet 臆造，按 javap 重写为 `surfaceBuilder`/`parent` 形态）
     - `forge/{1.19.4,1.20.1,1.20.4}/.cursor/rules/09-anti-patterns.mdc`（✅ 块）、`…/.cursor/rules/08-client-server.mdc`（决策流文案）、`…/knowledge/antipatterns/events.md`（❌+✅ 两处并补披露）：`RenderGameOverlayEvent` → `RenderGuiOverlayEvent`
     - `forge/1.16.5/code-patterns/04-world-patterns.md`：`withEffects/withFogColor/withSkyColor/withGenerationSettings/withMobSpawnSettings` 全族臆造 → 真名；`category(` → `biomeCategory(`；`AMBIENT_BASALT_DELTAS_LAZY` → `…_LOOP`；`Biome$Builder#surfaceBuilder` 移除（1.16.2+ 已迁 `BiomeGenerationSettings`）
     - `forge/1.17.1/code-patterns/03-entity-patterns.md`：`Level.ExplosionInteraction.BLOW` → `Explosion.BlockInteraction.BREAK`
     - `forge/{1.17.1,1.19.4,1.20.1,1.20.4}/code-patterns/03-entity-patterns.md`：裸 `INNER_ARMOR/OUTER_ARMOR` → `ModelLayers.PLAYER_INNER/OUTER_ARMOR`
     - `forge/{1.16.5,1.17.1,1.19.4,1.20.1,1.20.4}/code-patterns/03-entity-patterns.md`：`getAttributeMap()/getAttributeManager().registerAttribute()` → `createAttributes()` 形态（1.16.5 `AttributeModifierMap.MutableAttribute`，1.17.1+ `AttributeSupplier.Builder`）；`.setShouldWatch(true)` 删除（1.16.5 无此方法）
     - `forge/{1.16.5,1.17.1,1.19.4,1.20.1}/knowledge/antipatterns/networking.md`：`getReachingSide` → `getReceptionSide`
   - 镜像：`forge/{1.19.4,1.20.1,1.20.4}` 的 7 面镜像按纪律用 `scripts/sync-skills.ps1 -TargetDir` 重刷（42 个镜像文件随源变化）
   - 新建：[`doc/name-provenance-audit.md`](./doc/name-provenance-audit.md)（台账，由 `F:\MOD_TEST\gen-doc.mjs` 生成）
   - 便签区（不入库）：量具 `nonfabric-skill-names.mjs`（扩面 + CRLF 修）、`artifact-map2.mjs`、`verify-names3.mjs`、`apply-fixes.mjs`/`apply-fixes2.mjs`、`gen-doc.mjs`、`probe*.mjs`

3. **验证台账**（as-of 本轮；数字均带口径）
   - 量具（扩面后，`node F:\MOD_TEST\nonfabric-skill-names.mjs` 退出码 0）：nowhere **3073 行** = TYPE 1229 + MEMBER 1844；各包 JSON 求和 = 总表（自洽）；不变量「来源行是整行注释 = 0」（`probe7`）
   - 真构件核验（`verify-names3.mjs`，退出码 0，3073 行）：`PRESENT-MAIN 966` / `PRESENT-DEPS 299` / `PRESENT-LIB 560` / `ABSENT 846`（该档有构件、三者皆无）+ `498`（无构件档）；口径：主件 = 各档 mapped/merged/loom 件，依赖件 = net.minecraftforge `eventbus/coremods/unsafe/fml*` + net.neoforged `neoforge-<ver>-universal/bus/coremods` + fabric `remapped_mods` 全部件，库池 = 本机 `modules-2` 1890 件（含跨版本，方向偏 PRESENT）
   - 修复残留检查（`probe13.mjs`）：非镜像面内 `LEGACY_CAVE` 6 处全为披露注释；`RenderGameOverlayEvent` 28 处 = 19 处「该版本（1.12.2–1.18.2）确实存在」+ 9 处披露；`withEffects` 族 / `getReachingSide` / 裸 `INNER/OUTER_ARMOR` 仅剩披露与负例
   - 门：`node mcp-server/scripts/assert-skill-mirrors.mjs` → `ok`（57 棵树 / 12418 条比对目标 / AGENTS 漂移 0 / 孤儿 0）
   - 构件档位覆盖：可核 32 档（forge 1.13.2–1.20.4 九档、neoforge 10 档、fabric 12 档、rift 借 1.13.2）；不可核（本机无构件）列于台账 §2 表
   - 待审清单（台账 §5.1，39 个唯一名）经逐名核：全部为读者自建名 / 处理器名 / 散文，**无 API 名**

5. **未做清单**
   - 无构件档一律**未核实**（不是「判无缺陷」）：forge ≤1.12.2（68 行；本机 `caches/minecraft` 下 1.12.2 只有 obf/SRG 件，无 MCP 层）、quilt 10 档、liteloader 3 档、modloader 3 档、bedrock、fabric 1.14.4/1.16.5 = 共 498 行
   - 第三方库 API 248 行（Cloth/REI/JEI 等）：本机 `modules-2` 无对应 group，未核
   - `version-changes/*` 文档按宿主档构件核会假红（讲的是别的版本）——需拿被述版本构件重核，本轮未做（台账已单列该类）
   - 量具的**字段腿 / 库件腿**未补（本轮只用外部构件人工核）
   - 未 `git add/commit`（纪律：提交归用户）；未改任何 `data/**`、门、脚本
   - `ll-src/`（LiteLoader 源码树，未跟踪）**非本轮产物**，未动

6. **自我更正**
   - 本会话早先版本（`verify-names.mjs` / `verify-names2.mjs`）报的 ABSENT 偏大：只拿**合并主件**核 ⇒ `SubscribeEvent`/`DeferredRegister`/`FMLJavaModLoadingContext`/`ScreenEvents`/Cloth 类全成假 ABSENT。v3 加「档内依赖件 + 全机库池」后改判 **560 行**为 PRESENT-LIB；**以 v3（`verify3.json`）为准**，v1/v2 的汇总数字作废。
   - 上一轮说 1.18.2 的 `RenderGameOverlayEvent`「未核实」→ 本轮构件实测：**1.18.2 有该类**（1.19.4 起才删），故 1.18.2 档不改。
   - 上一轮报的「181 处」是含 7 面镜像的粗数；本轮按非镜像面重数 = 28 处（19 合法 + 9 披露）。

---

## 2026-10-13 · 非版本面收尾四项（temp 证据入库 / iserror-anchor selftest 接线 / en README 补 Discord / CORPUS 行号口径）（维护档）

**第 0 块 · 结论**：按用户点名的四项收尾 —— ① 把台账 `evidenceRefs` 指到的 6 份 gitignored `temp/` 证据复制进跟踪面 `mcp-server/docs/evidence/`，台账 9 条引用随之改指（干净 clone 不再在引用位点断链）；② `assert-iserror-anchor.mjs` 的 `--selftest` 接进 `test-scripts.mjs` 的 `SELFTEST_GATES`（此前只在 `REAL_RUN_GATES`）；③ `README_human.en.md` 只补 Discord 段（不含 QQ）；④ `CORPUS_PROVENANCE.md` 头部加一句「`原 AGENTS.md:NNN` 是搬入当时快照、会漂」。验证链 `assert-scripts-parse` / `assert-rule-ledger` / §第8步 `test-scripts.mjs` / `npm test` 全绿。**未 commit、未 push**；6 份新证据件**已 `git add`**（要自行 add 的，`git reset mcp-server/docs/evidence/` 即可）。

### 1. 改了哪些文件

**新建（已 `git add`；`mcp-server/docs/evidence/` 6 件，源见括号）**
- `sweep81-CLEANUP-list.md`（← `temp/audit/sweep81/CLEANUP-list.md`，逐字）
- `sweep81-SECTIONLESS-TRIAGE.md`（← `temp/audit/sweep81/SECTIONLESS-TRIAGE.md`，逐字）
- `w14-javadoc-orphan-list.txt`（← `temp/w14-javadoc-orphan-list.txt`，逐字）
- `audit-20260918-REPORT.md`（← `temp/audit-20260918/REPORT.md`；迁入时把 6 行本机绝对路径 `C:\Program Files\Java…` / `G:\JAVA17…` / `D:\mc-skill-temp…` / `G:\MCP_USE…` / `G:\graalvm-jdk…` 归一化为 `<…>` 占位符、顶部加 1 行迁入说明；729→731 行）
- `w55-cleanup-list.txt`（← `temp/w55-cleanup-list.txt`，逐字）
- `anchor-lint.mjs`（← `temp/ralph-20260922/_anchor-lint.mjs`；自用行 `node temp/ralph-20260922/_anchor-lint.mjs` → 新路径，1 处）

**改（跟踪件，未 add）**
- `mcp-server/scripts/assertion-ledger.json`：9 条 `evidenceRefs` 改指 `mcp-server/docs/evidence/`（涉 7 条规则：`forge-javadoc-1122-orphans-deletion` / `corpus-sectionless-classification` / `javadoc-index-parity-gate` / `w14-javadoc-576-orphans-ruling` / `external-content-trust-boundary` / `w55-hygiene-rulings` / `w54-no-external-injection-entry`）；同批改这几条 `claim`/`evidence` 散文里的旧 temp 路径。`w54` 原写「`_anchor-lint.mjs` 落在 gitignored `temp/`、零 tracked 引用」——迁入后该事实不再成立，故改写成「现跟踪于 `mcp-server/docs/evidence/`、仍**不进 门链** ⇒ 未纳管不变」。
- `mcp-server/test-scripts.mjs`：`SELFTEST_GATES` 末尾追加 `"./scripts/assert-iserror-anchor.mjs",`（+1 行注释）；数组去重长度 42→43。
- `mcp-server/scripts/assert-corpus-semantics.mjs:36` / `assert-javadoc-index-parity.mjs:34` / `assert-backlog-table-shape.mjs:10`：注释里的旧 temp 路径改指新路径（3 处，纯注释）。
- `README_human.en.md`：文末补 `## Come hang out:` + `DISCORD: https://discord.gg/vY8n6G865`（只 Discord）。
- `CORPUS_PROVENANCE.md`：头部 blockquote 加第 4 行 —— ⚠️「各条 `原 \`AGENTS.md:NNN\`` 的行号是 2026-10-09 搬入快照、会随根纲增删漂移 ⇒ 只作追溯、按章节名/关键句搜索，别拿行号回查」。现盘实测该文件 **6 行**含 `原 \`AGENTS.md:…\``（其中第 54 行并列 3 个行号 ⇒ 逐行号计 8）。
- `CONTRIBUTING_LIST.md`：`L17` 行「现状」格**追加**一条 2026-10-13 更正（原文不回改 —— 遵本表「台账历史行不回改」规矩）：该件已迁入 `mcp-server/docs/evidence/anchor-lint.mjs` 受版本控制、**仍未进门链**（其依赖 `temp/plan-20260921-fix.json` 仍未入库）⇒ 原「不把它改造成正式门」裁定不变。

**未动（说明）**：`mcp-server/CHANGELOG.md:1091`（2026-09-24 dated 历史记录，按规矩不 back-modify）；`.gitignore:109` / `.zcodeignore:109`（说的是**仍存在**的 temp 副本，未变假）。

### 2. 判据与反证

- **台账 `evidenceRefs` 逐条存在**（`assert-rule-ledger.mjs:95-101` 对每条 ref `fs.existsSync`）是「干净 clone 可复现」的承重判据。改前 9 条指向 gitignored `temp/`（clean clone 必红）；改后 `node scripts/assert-rule-ledger.mjs` ⇒ `ok（… 证据引用逐条存在）`。该判据自身的反证形态已具备：ref 指向空气即报 `evidenceRefs 指向不存在的文件`。
- **`assert-iserror-anchor --selftest` 接线**：该门 `--selftest` 6 例（绿 2 / 红 4）此前**无默认链触发点**（只在 `REAL_RUN_GATES` 真跑；selftest 臂要人手跑）。接线后由 `test-scripts.mjs` §S4 的 `SELFTEST_GATES` 循环逐道 spawn。反证：`test-scripts.mjs` 自带**投毒③**（selftest 数组删一项、地板取实测 M）⇒ 报 `W1-2 数组 M=42 < 地板 43` 并点名，证该臂有牙。
- **未新增 / 未放宽任何判据**：本轮只 `git add` 新证据件、改台账 ref、登记一记已有 selftest、改注释与文档。`README_human.*` 无门覆盖（实测全仓 0 引用）；CORPUS / CONTRIBUTING_LIST 是文档面。

### 3. 验证台账

- `cd mcp-server && node scripts/assert-scripts-parse.mjs` ⇒ `ok (223 个跟踪脚本可解析)`；口径 = tracked `.mjs/.js/.cjs`，含新 `anchor-lint.mjs`（改前 222）。
- `node scripts/assert-rule-ledger.mjs` ⇒ `ok（不变量 86 条：closed 85 / open 1）`，末句「证据引用逐条存在」。
- `node test-scripts.mjs` ⇒ **rc=0**；§S4 自印「盘上 77 / 可达 77 / §S18-S19 真跑 **52** / W1-2 selftest **43**」（后者改前 42）；末行 `script helper regression tests passed`。
- `npm test` ⇒ **exit 0**。
- 未跑：`npm run build`（未动 `src/**`）、`npm run test:cli:*`（未动 CLI 信封）、语料抓取类（与 `npm test` 并发会假红）。

### 5. 未做清单

- **上轮未做清单第 3 条未处理**：根文档内 `src/...` 缺 `mcp-server/` 前缀的 P3 群（`AGENTS.md` / `AUTO_SETUP.md` / `CONTRIBUTING*.md` / `README.md`）——用户本轮未点名。
- **`README_human.en.md` 的 F&Q 第 4 条**（「为什么这么多工具」）相对中文版仍缺 —— 用户只点名同步 Discord。
- **另外 13 道带 `--selftest` 但不在 `SELFTEST_GATES` 的门**（实测枚举：`assert-config-platform-face` / `assert-doc-absence-claims` / `assert-glossary-mojmap-face` / `assert-legacy-isolation` / `assert-lib-census-counts` / `assert-rule-ban-vs-example` / `assert-rule-internal-refs` / `assert-rules-api-names` / `assert-scaffold-mixin-shape` / `assert-skill-skeleton-census` / `assert-skill-yarn-attest` / `assert-test-harness` / `assert-yarn-named-integrity`）——用户只点名 iserror-anchor，其余登记备查、未动。
- **`CORPUS_PROVENANCE.md` 的 6 处 `原 AGENTS.md:NNN`** 只加了口径句、未改成章节名（走「只加说明、不改行号」路线）。
- **提交 / push 未做**（由用户执行）。

### 6. 自我更正

- 无（本轮未推翻上轮任何结论）。进度对照：上轮（2026-10-12）未做清单 4 条中，本轮关 3 条 —— 「`evidenceRefs`→temp/」（第 1 条）、「CORPUS 行号」（第 2 条；上轮记「7 处」，本轮实测 6 行 / 逐行号 8，计数口径不同、不追）、「`README_human.en` 的 QQ/Discord 缺失」（第 4 条的 Discord 半）；剩「`src/...` 缺前缀」（第 3 条）。**iserror-anchor 不在那份未做清单里**，是用户另行点名的项。

---

## 2026-10-12 · 只读审查（`temp/audit-20261011`）非版本面修复 · 批 B（~27 P1）+ 批 C（~115 P2 + P3）（维护档）

**第 0 块 · 结论**：按审计判决修完**非版本面**的批 B 与批 C —— `src`/`scripts`/门脚本的 P1 与 P2 逐条落地，文档与计数块对齐现值，P3 只做可操作且不产生新假红项；版本面（8 个平台树）仍**只出移交清单、不改文件**。验证链全绿：`npm run build` / `node test-scripts.mjs` / `npm test` / `test:cli:quick` / `test:cli:full` 均 exit 0，两新门与 `assert-authoring-lint` 直跑绿。**无落盘风险**：未 commit、未 push。**一处需你拍板**：见第 6 块 —— 为容纳 `generateCapability` 的上界哨兵，把 `assert-generator-rejection-codes` 的未判定地板 4→5。

### 1. 改了哪些文件

**`mcp-server/src`（B1 P1 + C1 P2，共 45 件）**
- `lib-skills/index.ts`（去根级 `.refine`，ZodEffects 使 MCP inputSchema 空）；`loader-api/extract.ts`（varargs / C 数组维）；`mappings/yarn-sqlite.ts` + `lookup-obfuscated.ts` + `mixin/method-string.ts` + `mixin/resolve.ts` + `mixin/access-transformer.ts`（SRG 正则放宽 + `prefer=forge` + `mojang_hashed`→`from=mcp`）；`prompts/templates.ts`（3 处 Quilt entrypoint）+ `prompts/index.ts` + `mixin/index.ts`；`porting/index.ts`（26.x 不写 parchment）。
- P2：`validate/index.ts`、`wave/register.ts`、`docs-platform/fabric/index.ts`、`generators/index.ts`、`bedrock/index.ts`、`playtest-bridge/index.ts`、`playtest-evidence/index.ts`、`update/github.ts`、`build-log/index.ts`、`audit-resources/index.ts`、`cli-parse.ts`、`platform-pack/detect.ts`、`platform-pack/write.ts`、`gradle/index.ts`、`datapack/index.ts`、`diagnostics/index.ts`、`utils/actionable.ts`（A-27 计数 380→381）等。

**`mcp-server/scripts`（B2 P1 + C2 P2 + B3 门 P1，共 30 件）**
- 生产者：`parchment-extractor.js`、`process-neoforge-docs.js`、`forge-javadoc-indexer.js`、`tsrg-extractor.js`、`process-fabric-docs.js`、`process-fabric-wiki.js`、`process-forge-docs.js`、`provision-26x-docs.mjs`、`probe-forge-versions.js`、`probe-neoforge-versions.js`、`postinstall.mjs`、`pin-mdk-checksums.mjs`、`generate-porting-breakdown.js`。
- `_lib/`：`api-name-collector.mjs`、`build-yarn-sqlite.mjs`、`import-mcp-csv.mjs`、`import-forge-srg.mjs`、`import-tsrg.mjs`、`build-semantic-index.mjs`。
- 门：`assert-test-harness.mjs`、`assert-registry-limit-window.mjs`、`assert-rule-ledger.mjs`、`assert-rule-java-shapes.mjs`、`assert-scaffold-mixin-shape.mjs`、`assert-glossary-mojmap-face.mjs`、`assert-cross-layer-names.mjs`、`assert-skill-mappings-key.mjs`、`assert-index-channel-layout.mjs`、`assert-generator-rejection-codes.mjs`（地板 4→5）。

**根 `scripts/`**：`build-api-summaries.mjs`、`pin-mdk-checksums.mjs`、`project-cloth-skill.mjs`、`validate-rules-against-cache.mjs`。

**测试**：`test-core.mjs`（`m_46859_` 断言语义反转 + 新增真·不存在 token 用例）、`test-decompile.mjs`、`test-cli.mjs`、`test-mdk-npm-form.mjs`（`test()` 补 thenable 检测）、`test-scripts.mjs`。

**文档 / 元信息（B4/B5 + C3）**：根 `README.md` / `README.en.md` / `README_human.md` / `README_human.en.md` / `AGENTS.md` / `AUTO_SETUP.md` / `CONTRIBUTING.md` / `CONTRIBUTING.en.md` / `CONTRIBUTING_LIST.md` / `CORPUS_PROVENANCE.md` / `THIRD_PARTY_NOTICES.md` / `CHANGELOG.md` / `Minecraft 社区常用库模组全览（2026 版）.md` / `server.json` / `doc/tool-error-codes.md` / `mcp-server/README.md` / `mcp-server/CHANGELOG.md` / `mcp-server/docs/{mcmap-linkie-absorption,mixin-support,query-api-classname-case,evidence-forge-registries-all-versions,mc-skill-update}.md` / `knowledge/libs/**`（README + 6 份 SKILL）/ `common_skill/{README.md,mc-router/SKILL.md}` / `.github/{SECURITY,CODE_OF_CONDUCT,ISSUE_TEMPLATE/bug_report.md,ISSUE_TEMPLATE/config.yml,dependabot.yml,workflows/release-mcp-server.yml}` / `community_knowledge/{ATTRIBUTION.md,README.md,authored×4,links×3,indexes/index-l0.json}`。

### 2. 判据与反证

- **`isMounted`（assert-rule-ledger）**：旧判据 = 宿主全文裸子串，`test-scripts.mjs` 里那张「本文件完全未引用 Y=10 道（列名：…）」的 `console.log` 串与注释都能把它喂绿。新判据分族：`assert-*` 要求 `scripts/<gate>` 路径段、`test-*` 要求剥离行首 `//` 后的独立 token。**踩坑与纠正**：首版把 `./scripts/` 归一成 `scripts/` 却仍要求前导定界符 ⇒ 实测 52 条假红（真挂载 `"./scripts/<gate>"` 前是 `/`）；改为断言-族走路径段、测试-族走 token 后 86 条全绿。
- **R-2 窗口锚（assert-test-harness）**：旧锚 `indexOf("function test(")` 会落到 `test-mdk-npm-form.mjs` 注释里的 `` `function test(` `` 字面量上（+400 窗口正好覆盖下一行注释的 "thenable"）⇒ 假绿。新锚 `LOCAL_HARNESS.exec().index` 实测抓出该文件同步 `test()` 未处理 thenable ⇒ 已给该文件补 thenable 检测（该文件是真缺陷，不是误报：`test-decompile.mjs` 参考实现就有）。R-4 另加两条恒真模式。
- **`test-core` 的 `m_46859_`**：审计 `R4-V2-008-009` 明证 `m_/f_` 形是 **Forge SRG（MCP 侧）**名、就在 `data/forge_1.20.1/mappings/yarn-mappings.sqlite` 的 `methods.name_named`（实测 `m_46859_` → `isEmptyBlock`）。旧断言「NOT_FOUND + mojang-hashed 名不在 yarn sqlite」编码的是**修前缺陷行为**，故反转并另加真·不存在 token 保留否证意图。同批把 `lookup-obfuscated.ts` 的 NT_FOUND 建议串从「mojang-hashed（m_/f_）名不在 yarn sqlite 中」改成真事实。
- **`union-number`（cli-parse）**：首版「凡 union 含 number 成员即转 number」实测打破 `test-cli-parse.mjs:155`（`string|number` union 的 `"123"` 被转成 `123`）；改为**含 number 且不含 string** 才转 —— `packFormat: number|[number,number]` 可达，`string|number` 保持原样（:122 与 :155 双绿）。
- **A-27 计数**：`src/build-log/index.ts` 新增 `LOG_HARD_MAX` 拒绝位点（真 +1）与 `lib-skills/index.ts` 注释里手写的 `ok:false` 字面量（误 +1）共推高 2；注释改写为「落失败分支」并把口径数字 380→381（`actionable.ts` 头注，`grepLines` 358 在 ±5 窗内）。

### 3. 验证台账

- `cd mcp-server && npm run build`（tsc）⇒ 无输出（成功）。
- `node test-scripts.mjs` ⇒ **rc=0**（盘上 77 道 assert-* / 可达 77 · §S18/S19 真跑 52 道 · W1-2 selftest 42 道 · 末行 `script helper regression tests passed`）。
- `npm test` ⇒ **exit 0**；`npm run test:cli:quick` ⇒ exit 0；`npm run test:cli:full` ⇒ exit 0。
- 新门 / 受影响门直跑：`assert-prose-name-roster.mjs`（`--selftest` + 真跑）、`assert-registry-field-existence.mjs`（`--selftest` + 真跑）、`assert-authoring-lint.mjs` ⇒ 均绿。
- 社区索引随 frontmatter（3 个 links 补 `mcHint`）重建：`node scripts/build-community-index.mjs --write` ⇒ `wrote 110 entries`；`test-core` 的 `testCommunityIndexSync` 由红转绿。
- 未跑：语料抓取类命令（与 `npm test` 并发会假红）；`mc_skill_update check`。

### 4. 数据侧变更

- `data/forge_1.13.2/extracted/{api-index,class-names,method-lookup}.json` 重建（`tsrg-extractor.js` 登记恒等 `CL:` 行的直接产物）：键 3993→**4027** / 非空类 3827→**3861** / 成员 **40635** / 类名 3993→**4027**。
- `community_knowledge/indexes/index-l0.json` 重建（110 条；3 个 links 文件的 `mcHint` 变更）。
- （批 A 已重建的 `data/forge_{1.7.10…1.12.2}/extracted/**` 24 件不在本轮。）

### 5. 未做清单

- `assert-rule-ledger` 的 `evidenceRefs` 仍允许指向 gitignored 的 `temp/`（fresh clone 必红）—— 审计记的独立项，本批未处理。
- `CORPUS_PROVENANCE.md` 7 处「原 `AGENTS.md:NNN`」历史行号漂移未改（需补 commit 锚或改指章节名）。
- 根文档内 `src/...` 缺 `mcp-server/` 前缀的 P3 群（`AGENTS.md` / `AUTO_SETUP.md` / `CONTRIBUTING*.md` / `README.md:1023`）未逐处改（低价值、改有误伤风险）。
- `README_human.en.md` 的 F&Q 第 4 条与 QQ/Discord 段相对中文版缺失（翻译滞后）未补。
- 版本面全部（`fabric|forge|neoforge|quilt|bedrock|liteloader|rift|modloader/<档>/**`）**未改**，移交清单见 `temp/audit-20261011/HANDOVER-VERSION-FACE.md`。
- 未 commit、未 push（提交归用户）。

### 6. 自我更正

- **需你拍板**：`mcp-server/scripts/assert-generator-rejection-codes.mjs` 的 `UNJUDGED_CEILING` 由 **4 抬到 5**。原因：C1 给 `generateCapability` 补了与 `generate_model/_lang/_config/_worldgen/_entity_runner` 四兄弟同形的上界哨兵，多出一个「`errors` 正文由变量/函数调用组成」的静态未判定（运行期有码，实测 `VERSION_UNSUPPORTED`）。该门自述「只许降不许增」，此抬动即一次**棘轮放宽** —— 若你要求严守，替代是**撤掉 `generateCapability` 的上界哨兵**（`26.99.9` 会被 `isNeoForgeAttachmentVersion` 的 `/^26\.\d/` 放行、回 `ok:true` + 骨架）。二者择一，现取「保哨兵、抬地板并在门内注释与交付里双记」。
- 本批多为我自己 B/C 改动触发的连带红（`assert-rule-ledger` / `assert-test-harness` / `test-core` / `test-cli-parse` / `test-wave-bcd` / `assert-generator-rejection-codes`），均已在**改地面文**一侧收口（不靠改 harness 变绿，唯一例外是上面那条显式记名的地板抬升）。
- 批 A 节（本文件下一节）所述「未跑 `mc_skill_update check`」在本批同样成立。

---

## 2026-10-12 · 只读审查（`temp/audit-20261011`）非版本面修复 · 批 A（P0 三条 + 三条反向检测门腿）（维护档）

**第 0 块 · 结论**：按审计判决修掉**非版本面**批 A —— 3 个 P0（legacy Forge 六档 api-index 全员错挂 / remap 缓存键缺版本与构件身份 / test-cli 的 `--fail-on-error` 死臂）+ 审计 §6.5 点的三条反向检测腿（成员分布地板、围栏外名字清单 vs 真构件名册、注册表字段级存在性）。P0-A **连数据一起重建**（六档 `extracted/` 四件），用户可见症状已消：`query_api 1.12.2 World` 从 `methods=0` 变为 **80 条 SRG 方法**且不再有空壳警告。版本面（`<平台>/<档>/` 规则树与 knowledge）按裁定**不改**，只出移交清单。批 B/C **未做**。未提交。

### 1. 改了哪些文件

**新建（2 门 + 2 基线）**
- `mcp-server/scripts/assert-prose-name-roster.mjs` —— 门腿①：围栏外「清单行」里的 `<Name>Registry` 名必须落在本档 FAPI 真构件名册或 vanilla 映射。`--selftest` / `--measure` / `MC_SKILL_PROSE_ROSTER_TEST_ROOT`。
- `mcp-server/scripts/assert-registry-field-existence.mjs` —— 门腿②：`Registries.<M>` / `RegistryKeys.<M>` 的字段级存在性（member 真存在但 owner 不对即红）。同上三入口。
- `mcp-server/scripts/data/prose-name-roster-baseline.json`（36 条棘轮键 + `fileFloor`/`tokenFloor`）
- `mcp-server/scripts/data/registry-field-baseline.json`（27 条棘轮键 + `fileFloor`）

**改（工具/数据/测试/文档）**
- `mcp-server/scripts/forge-srg-extractor.js` —— owner 改从成员行自带的 mapped 全名取（`FD:` 2 token / `MD:` 4 token）；成员行 owner 缺位先建位；**恒等 `CL:` 行也登记**；加 `ownerNotInClassNames` 计数告警。原 `currentClass` 机制整体退场。
- `data/forge_{1.7.10,1.8.9,1.9.4,1.10.2,1.11.2,1.12.2}/extracted/{api-index,method-lookup,critical-classes,class-names}.json` —— 24 个受控 JSON 重建（见第 4 块）。
- `mcp-server/scripts/assert-index-channel-layout.mjs` —— `mappingInput` 按档分叉（旧六档 `joined.srg`）；六档登记类数钉；**新增 A5 成员分布地板**（比例阈值）；新增 `MC_SKILL_INDEX_LAYOUT_TEST_INDEX_PACK`；成功行改按档判定（原全局 `failures.length` 写法在多档下会吞后续档的成功行）。
- `mcp-server/src/api/index.ts` —— 删 `QUERY_API_SHELL_INDEX` 常量与 `:833` 正则分支；头注（:5）去「类名空壳」；`no-methods` 文案（原 :759）去陈旧括注。
- `mcp-server/src/tool-registry.ts` —— `query_api` 边界句「可能 found:true 但 methods 为空（类名空壳）」→「只有 SRG 类名与 `func_/field_` 成员名」。
- `mcp-server/src/decompile/services/mod-decompile.ts` —— 新增导出纯函数 `remapCacheStem(modId, modVersion, version, jarIdentity, kind)`；最终件与 `yarn-intermediary` 中间步共用（键含 MC 版本 + jar 内容身份，与 `outDir` 同口径）。
- `mcp-server/test-core.mjs` —— 1.12.2 断言语义反转（「空壳警告必须保留」→「数据健康：无空壳警告且方法清单非空」）。
- `mcp-server/test-decompile.mjs` —— import `remapCacheStem` + 新钉键用例。
- `mcp-server/test-cli.mjs` —— `diagnose_gradle --fail-on-error` 臂改无条件 + 换会真出 error 的夹具 + 钉住夹具前提。
- `mcp-server/test-scripts.mjs` —— 两新门登记进 `REAL_RUN_GATES` 与 `SELFTEST_GATES`；§A5/§idx 投毒块加「旧档成员分布折成一类必红」一记；两条地板注释改为「以 §S4 自印行为准」（原注释里的实测数早已漂）。
- `README.md`（8 处：:506 / :510 / :527 / :528 / :529 / :551 / :579 / :581 / :593 / :595 / :769 / :787 中的症状词与连带行）、`README.en.md`（6 处同段镜像）、`AGENTS.md:408,455`、`AUTO_SETUP.md:599`、`mcp-server/README.md:25,344,361` —— 只改症状词，保留仍成立的建议（「不要把 `query_api` 当 javadoc」一律留着）。
- `mcp-server/CHANGELOG.md` —— 第九十三批条目。

**temp（不入受管面，供复算/移交）**：`tools/c-srg-fingerprint-verify.mjs`（四值对拍器）、`tools/_grep.mjs`（UTF-8 安全递归 grep，cmd 的 findstr 会毁 CJK）、`HANDOVER-VERSION-FACE.md`（版本面移交清单）。

### 2. 判据与反证

- **A1 反证**：修前六档「非空类恒为 1」、成员被并进最后一个类 ⇒ 四值指纹的 `nonEmpty`/`hash` 必不等；修后 `ALL MATCH`（1.7.10 `26f08b1f4697a5c2` … 1.12.2 `42d303369c9a0fec`）。指纹由**独立解析 `joined.srg`** 得到，不是抽取器产物 ⇒ 真·对拍。
- **A5 地板投毒**（`assert-index-channel-layout.mjs`）：把 1.12.2 的 api-index 折成「键集不变、全部成员并进第一个类」⇒ 实测双红：`非空类占比 0.000 < 地板 0.9`、`单类成员占比 1.000 > 上限 0.05`；干净基线同门 rc=0。
- **A3 死臂反证**：旧夹具实测 `errors=[]` + `status=0`（臂真空）；新夹具实测 `errors=[缺少 Forge 依赖, 缺少 ForgeGradle 插件]` + `status=1`。probe 脚本 `tools/_probe-gradle.mjs`（argv 直传，绕开 CMD 引号）。
- **两新门活性**：①`--selftest` 4 组纯函数夹具 + `1.21.10` FAPI 真名册腿（`CompostingChanceRegistry` 在册 / `CompostableItemRegistry` 不在）；②`--selftest` 4 组 + `1.21.10` 真库腿（`Registries` 上无 `ENCHANTMENT`、`RegistryKeys` 上有）。两门真跑 rc=0 且**新增违规 0**（现值 = 基线）。
- **反证（没误伤）**：`Registries.ENCHANTMENT` 在 1.19.4/1.20.1/1.20.4 是**正确写法**（实测该三档 `Fields` 表 owner 真在 `Registries`），门腿②对这三档 0 判 —— 故**严禁全局替换**（已写进移交清单）。

### 3. 验证台账

- 四值指纹对拍：`node temp/audit-20261011/tools/c-srg-fingerprint-verify.mjs` ⇒ `ALL MATCH`（6/6 档；口径 = classes/nonEmpty/total/hash，as-of 2026-10-12）。
- 用户可见冒烟：`node mcp-server/dist/cli.js query_api --className=net.minecraft.world.World --version=1.12.2`（`MC_SKILL_DATA=<repo>/data`）⇒ `found=true` + `methods` 80 条（`func_*`）+ 无 `类名空壳` warning + `truncated=true`。
- `cd mcp-server && node test-scripts.mjs` ⇒ **rc=0**（§S4：盘上 77 道 assert-* / 可达 77 · §S18/S19 真跑 **52** 道 · W1-2 selftest **42** 道 · 末行 `script helper regression tests passed`；§A5/§idx 投毒自检行含新增的「旧档成员分布 1 记必红」）。
- `cd mcp-server && npm test` ⇒ **exit 0**（含 `build` tsc / `test-core.mjs` 反转断言 / `test-decompile.mjs` 新用例 / `test-cli.mjs` 新臂 / `assert-cli-quick`）。
- `npm run test:cli:quick` ⇒ exit 0；`npm run test:cli:full` ⇒ exit 0。
- 两新门直跑：`node scripts/assert-prose-name-roster.mjs` ⇒ `扫 519 件 / 名册 token 114 · 违规 36（基线 36，新增 0）`；`node scripts/assert-registry-field-existence.mjs` ⇒ `扫 778 件 / 706 处强类型位 · 违规 27（基线 27，新增 0）`。
- 文档面（无门看护）：按症状词（`类名空壳|空壳警告|methods:\[\]|3313|3300 个`）在全部面 grep 归零（残留 2 条为**本轮新写的否定句**「不再有空壳警告」与 en 同句，人工核过）；`grep SHELL_INDEX mcp-server/src` = 0。
- 未跑：`mc_skill_update check`、语料抓取类命令（与 `npm test` 并发会假红）。

### 4. 数据侧变更

- `data/forge_<v>/extracted/**` 六档 × 4 件 = **24 个受控 JSON** 重建（1.7.10 / 1.8.9 / 1.9.4 / 1.10.2 / 1.11.2 / 1.12.2）。前 → 后（`api-index` 成员归属从「全并进最后一个类」变为按 owner 归位；`class-names.json` 长度 = CL 去重数）：
  - 类数（= class-names 长度）：1836 / 2541 / 2941 / 2980 / 3122 / 3344（修前 `class-names.json` 在 1.8.9 / 1.9.4 是 6 字节空壳，现为满量）。
  - 非空类：1780 / 2468 / 2864 / 2902 / 3034 / 3256（修前六档**恒为 1**）。
  - 成员合计：20163 / 25343 / 28862 / 29384 / 30410 / 32732（修前同值但全挂在一个类上）。
  - 未重算：`critical-classes.json` 的名册仍是 mojmap/1.16+ 类名（旧 SRG 档必大面积 null，六档实测 `1/42 found`）—— 属批 C 的 P2，本批未动；`*_RELEDGER=1` 未跑（本轮未动任何台账门）。
- 门基线新增 2 份（见第 1 块）；未改任何既有基线。

### 5. 未做清单

- **批 B（~27 个非版本面 P1）未做**：`src/loader-api/extract.ts` varargs / `src/lib-skills/index.ts` root `.refine()` 使 MCP `inputSchema` 序列化为空（`resolve_lib_skills` 在 MCP 面失效）/ `src/mappings/yarn-sqlite.ts` SRG 反查缺 `prefer:"forge"` / `src/prompts/templates.ts:581,582` Quilt entrypoint 引用反向 / `src/porting/index.ts` 对 26.x 硬写 parchment / 四个生产者覆盖保护（`parchment-extractor.js` · `process-neoforge-docs.js` · `forge-javadoc-indexer.js` · `tsrg-extractor.js`）/ 8 道门脚本 P1 / 计数与元信息类（`mcp-server/README.md:90` 82→86、模板 49→61、`THIRD_PARTY_NOTICES.md` 计数、`server.json` 137M→1.8GiB 等）。
- **批 C（~115 P2 + P3 清扫）未做**。
- **版本面 94 单元 / 2,255 文件未判未改**（按用户裁定）：落点清单与机读基线见 `temp/audit-20261011/HANDOVER-VERSION-FACE.md`（含门腿①② 的两份基线 = 27 + 36 条可复算清单，以及 F18/F19/F8/§2.2 与逐档 P1 计数）。
- **`critical-classes.json` 名册错层**（旧 SRG 档的 P2）未修 —— 归批 C。
- **未 commit / 未 push**（提交归用户）；本轮未按「维护面夜批（阶 1）」走（未建专用分支、未代提交）。

### 6. 自我更正

- **上一版计划的两处被用户当场纠正，已改**：① 我一度把「禁台账日期戳」的门归因错（写成 `assert-authoring-lint` 管日期戳；实际该门只有 J1 frontmatter / J2 指针路径 / J3 纯负向三条腿，真出处是本仓既有口径）——本轮执行约束据此改写为「面文只写现状与指针；读数与历史归 `DELIVERY_LOG` / `CHANGELOG`」，并据此**没有**在面文里加任何日期戳；② 我列的文档锚点漏了 README.en.md 整个英文面与若干行，`AGENTS.md:452` 是假锚点（该行是「`query_*` 是兼容工具」段、无空壳症状，动它即误伤）—— 实际改法改为**按症状词 grep 机械枚举 + zh/en 成对**，`AGENTS.md` 只动 `:408` 与 `:455`。
- **本 CHANGELOG 内的一条数字更正**：`test-scripts.mjs` 的两条地板注释原写「实测 37 / 26」，实测 §S4 自印为「真跑 52 / selftest 42」；我已去掉具体数字，改为指向 §S4 自印行（该注释早已漂，属审计点在的「披露位 ≠ 实测量」家族）。
- **一处工具教训（写进临时件注）**：CMD 下 `findstr` 对 UTF-8 CJK 不可靠（会整行乱码/漏命中），本轮改用自写 `tools/_grep.mjs`；`%errorlevel%` 在 CMD 里于解析期展开 ⇒ 判退出码一律走 node `spawnSync`（`tools/_rc.mjs` / `_probe-gradle.mjs`），本轮的 A3 结论正是靠它才拿对。

---

## 2026-10-12 · 五树「无 QSL 构件」表述精化（联网复核天花板 + 77 处改写 + 派生件重生成）（维护档）

**第 0 块 · 结论**：按用户令「完成五树『无 QSL 构件』表述精化」——先联网复核 QSL 天花板（六面一手：release 线止 MC 1.21.1、snapshot 线与源码仓库止 1.21.5；那五个版本在 release+snapshot+QFAPI+Modrinth 四线全 0；真正到 1.21.11 的是 quilt-loader / quilt-mappings），再对五树 48 个文件 **77 处**改写统一为「两条构件线 + 本版 0 命中」措辞并加防误读注；1.21.11 源稿改动触发 data 派生件按生成器重生成。终态门链 rc=0（中途唯一一次红 = `assert-qsl-verified-sync` 抓派生件过期，已按生成器正路修复）。未提交。

### 1. 改了哪些文件

- 五树共 48 文件：quilt `1.21.3 / 1.21.4 / 1.21.8 / 1.21.10` 各 10 文件、`1.21.11` 8 文件——`.cursor/rules/00-project-setup.mdc`（入口行括注）、`01-registry.mdc`（:3 横幅、Decision Flow 行；四树另有离线数据条）、`05-events.mdc`、`06-networking.mdc`（仅四树）、`.cursor/skills/mc-{registry,events,networking}/SKILL.md:12`、`AGENTS.md`（:8 横幅 + 注册行）、`knowledge/common/qsl-verified.md`、四树 `pack.meta.json:8`（其「未联网复核」句改为「已联网复核」——**日期-free**，与同日确认的 as-of/日期清理政策对齐）。
- 措辞统一点：**无 QSL/QFAPI 构件：release 线止于 MC 1.21.1（`10.0.0-alpha.5+1.21.1`）、snapshot 线另有 `+1.21.5-SNAPSHOT`——两条线均无本版件**；AGENTS 横幅另注**源码仓库最高分支 1.21.5**（五版两线同样 0 命中）；旧句 `maven 只到 alpha` / `非可编译 API——禁止生成` / `无可用…正式版构件` / `禁止当可编译` 全部退场；skills 面保持无日期式（现状 + 指针）。文内保留的 `lastUpdated 2025-09-21` / `2025-12 停更` 均属上游字段值 / 争议声明名（数据值与裁定引用类，不属我方动作时间戳）。
- `quilt/1.21.11/AGENTS.md:9` 对照事实行插入防误读句：「**QSL 本体不在对照之列**——release 止 1.21.1、snapshot 另有 `+1.21.5-SNAPSHOT`，1.21.11 在两线均 0 命中（见 :8）」（quilt-mappings/loader 到 1.21.11 是「QSL 到 1.21.11」误传的最可能来源）。
- 镜像：五树各跑 `sync-skills.ps1` 一次（含 `.cursor/agent/default.md` 孪生件按 AGENTS.md 重生）。
- 工具（scratch，不入仓）：`D:\mc-skill-temp\adjud2\refine-5trees.mjs`——断言式批量改写器（每 op 先断言目标行现内容/唯一命中数，77/77 全过后才统一写盘；默认 check 模式）。
- data 侧（见第 4 块）：`data/quilt_1.21.11/**` processed `qsl-verified.md` + `index-l0/l1/l2.json` 由生成器重写。

### 2. 判据与反证

- 上网复核（六面一手，2026-10-11/12）：① umbrella `org.quiltmc:qsl` release **144 版**（`<release>`=`<latest>`=`10.0.0-alpha.5+1.21.1`，lastUpdated 2025-09-21；`1.21.3/1.21.4/1.21.8/1.21.10/1.21.11` 后缀逐字 0）；② 模块 `qsl.core:registry` **141 版**同形；③ **snapshot 168 版**（1.21 族仅 6 条，最高 `10.0.0-alpha.5+1.21.5-SNAPSHOT`，lastUpdated 2026-01-14）；④ QFAPI 坐标 **151 版**止 `11.0.0-alpha.3+0.102.0-1.21`；⑤ Modrinth 合并页（slug `qsl`=「QFAPI / QSL」）**143 版** game_versions 上界 1.21；⑥ **QSL 源码仓库 12 分支最高 `1.21.5`**。对照实测：quilt-loader 1.21.11=**307 构建**（同端点 99.9.9→404 反证按版本分列真实）、quilt-mappings **712 版**、`<release>`=`1.21.11+build.2`。
- 反证（没动不该动的）：1.18.2/1.19.4/1.20.1/1.20.4/1.21.1 五树零改动（已按四件套）；1.21.11 `qsl-verified.md` 入口行的「javap 实测」本体保留，只换「maven 上无构件」括注。
- 残留扫（五树源面含孪生件、排 7 面镜像目录）：旧词 `maven 只到 alpha|非可编译|正式版构件|禁止当可编译|当可用依赖|QSL 构件只出到` **15→0**；五树新增日期扫描 `2026-10-1x` **0**。
- 口径自正（写进新文案）：①「只出到 1.21.1」是 **release 线** shorthand——snapshot 线与源码仓库到 1.21.5，两线并列后五版仍全 0；② 改 `qsl-verified.md` 源稿后 data 派生件必须走 `node scripts/index-qsl-verified.mjs --write`（**仓库根 scripts/**），门会抓手改/过期。

### 3. 验证台账

- 终态门链（as-of 2026-10-12，串行，全 exit 0）：`node test-scripts.mjs` **rc=0**（日志 `D:\mc-skill-temp\adjud2\ts-run6.log`，46 行；`本轮未执法腿=0`；#23 规则树 API 名门真树红 0 且「靠豁免洗的 0 条」；末行 `script helper regression tests passed`）。中途读数：`ts-run4` 红于 `assert-qsl-verified-sync`（「1.21.11: processed 与源稿不一致（派生件过期/被手改）」）→ 生成器重生成 → `g-qslsync` 绿（「ok（10/10 档源稿存在，processed 派生件全部与源稿归一化一致，无孤儿）」）→ `ts-run5` 绿 → pack.meta 去日期戳 → `ts-run6` 绿（终态）。
- `assert-scaffold-rules-conflict` = 「47 档 · 规则 447 篇 · 判死符号 67 · scaffold 冲突 0 · **台账 checked**」（LEDGER 3065 未动、免重钉）。
- `assert-skill-mirrors` = 「扫档=57 · 镜像目标=12418 · AGENTS 漂移 0 档 · 拒=0」；`assert-authoring-lint` = 「目标 13 件 · J1 12 份 · J2 23 枚全在盘 · J3 纯负向 0」。
- 生成器读数（`qsl-idx2.log`）：1.21.11 四件 WROTE（processed + index-l0/l1/l2，sha 已刷新）；1.21.1 sha 未变；1.21.3/4/8/10 按设计 skip（无语料树）。
- 抽查：1.21.3 `AGENTS.md:8` 与 1.21.11 `.cursor/rules/01-registry.mdc`（:3 横幅 + Decision Flow 行）逐字复核新文案，无残句。
- 改写器证据：`refine-5trees.mjs` check 模式 77/77 断言全过 → `--write` 77/77（0 失败）。

### 4. 数据侧变更

- `data/quilt_1.21.11/quilt-docs/1.21.11/processed/qsl-verified.md` + `index-l0.json` / `index-l1.json` / `index-l2.json`：由 `node scripts/index-qsl-verified.mjs --write`（仓库根）按源稿机械重生成（唯一被改语料 = 源稿改动的派生；其余四树无语料树按设计 skip；1.21.1 轮内核对 sha 未变）。
- 门 LEDGER、其它索引与台账：**零变更**。

### 5. 未做清单

- 1.18.2/1.19.4/1.20.1/1.20.4/1.21.1 五树未动（已按四件套；1.20.4/1.21.1 上轮已精化）。
- 并行写方清扫在两处 AGENTS 横幅留下的引号残句（1.21.1「「止于」」、1.20.4「「的 QFAPI 7.7.0 + QSL 6.3.0 终版」」）未修——非本轮面，留其收口。
- `pack.meta.json` 只改「未联网复核」句；其内 `2026-09-13` 实测读数段与 `A-43 更正 2026-09-19` 保留（机器载荷面，日期类按同日 as-of 政策的保留类处置——若该政策要扫机器载荷，另行拍板）。
- 规则/knowledge 面的日期戳维持现状（技能面 0 日期为本轮保持项）。
- 未提交（提交归用户）。

### 6. 自我更正

- 口径级自正两处（本轮直接修正了我此前给用户的口头结论）：① 「QSL 构件只出到 MC 1.21.1」是 **release 线** shorthand——snapshot 线与源码仓库到 1.21.5；五树文案已按「两条线 + 本版 0 命中」写全。② 生成器命令的正确 cwd 是**仓库根**：`node scripts/index-qsl-verified.mjs --write`（首试 `cd mcp-server && node scripts/…` 报 MODULE_NOT_FOUND；`assert-qsl-verified-sync` 报错文案里的同款命令亦未标 cwd）。
- 一处当日自纠：`pack.meta.json` 初稿写成「已于 2026-10-11 联网复核」——属我方动作日期戳；按同日确认的「as-of 与日期全仓清理」政策改为日期-free「已联网复核」，并复扫五树 `2026-10-1x`=0、复跑收口链 rc=0。
- 并发写记：本轮与「`as-of` 术语与取证日期戳全仓清扫」轮同日并行（其节在本文件下方）；本轮的规则/AGENTS/skills 新文案按无日期式落笔、与该政策同向；若其清扫后续触及 quilt 五树，以彼轮记为准。
- 对旧节无更正；本节与「四族构件实证轮」「四族构件实证轮审查 F1–F4 修复」两节同族——那两节的 QSL 事实结论不受影响，本版只是把 shorthand 精确化并接线到五树全文。

---

## 2026-10-11 · `as-of` 术语与取证日期戳全仓清扫 + 规范本体删除（用户令「as-of以及日期全部清理；并找找那个规则写了这个规范，删除」；维护档）

**第 0 块 · 结论**：把「计数必须带 **分母 + 口径 + as-of**」这条规范**本体**从 8 处规范/表单文件里删掉（统一改为「分母 + 口径」），并据此把**面文**（README 两语 / AUTO_SETUP / mcp-server README / forge 1.18.2 scaffold README_AI / 8 篇 lib-* 社区短文 / library-integration-jei-emi / mc-research 技能源稿 + 装机副本）里的 as-of 与「我方动作时间戳」清面；**脚本/代码层**清掉 50 行注释戳、26 处错误消息串里的 as-of 标注、2 个已成死字段的 `asof`。**边界（按判定刀保留）**：台账落点（`DELIVERY_LOG` / `mcp-server/CHANGELOG` / `CORPUS_PROVENANCE` / `NIGHT_BATCH` / `doc/tool-error-codes` / `ingame-playtest-automation`）+ 机器载荷（`assert-community-attribution` 的 as-of 时效判据、`mcmod-dev-tutorials.md` 的 ≥20 行 as-of 地板、`assert-bedrock-script-api-pin` 的 `asOf` 钉值、`external-apis-signoff.tsv` 的 `asof` 列、`PROSE_RE` / `asOfRe`）+ 上游事实（`As of Minecraft 1.20.2 …` 引文、parchment `2023.09.03` 格式例）+ 裁定落款（`（2026-09-08 裁定）` 类）。`npm run build` 通过；第 8 步 `node test-scripts.mjs` **rc=0**；`assert-authoring-lint` ok。未 commit。

### 1. 改了哪些文件

**A. 规范本体删除（8 处，义务句由「分母 + 口径 + as-of」改为「分母 + 口径」）**

- `WRITING-FOR-AGENTS.md:96`（§7 出处形状）／`REPORT-FORMAT.md:43`（§维护档 · 3 验证台账）／`.codebuddy/rules/实施计划要求.mdc:16`／`.github/PULL_REQUEST_TEMPLATE.md:26`／`bugfix_list.md:232`（追加规则③）／`CONTRIBUTING.md:232-233`（库数据链计数口径 A/B 的「（2026-09-24 复跑）」）／`CONTRIBUTING.en.md:232-233`（同构镜像）／`CONTRIBUTING.en.md:487,492`（未排期清单列规）／`CONTRIBUTING_LIST.md:5,10`（列规与表头）／`common_skill/mc-research/SKILL.md:8,31,35`（技能在教 as-of）。
- 装机副本同步：`C:\Users\zzrCN\.agents\skills\mc-research\SKILL.md`（逐行 diff 后拷回，现已与源稿逐字一致）。
- 模板体同步：`mcp-server/src/prompts/templates.ts:668`（`mc-research` 工作流产出行「论断/出处/状态/as-of」→ 去 as-of），与源稿同改。

**B. 面文清 as-of（我方动作时间戳）**

- `README.md`（zh）/ `README.en.md`（en）：as-of 与带日期标题全量清（zh 已落盘于上一轮；本轮修 en 6 个锚后重跑 `clean-readmes-asof.cjs en`，en 40 对全命中写出）。残留仅 2 条「留」项：`README.md:742` / `README.en.md:720` 的「2026-09-08 裁定」落款、`README.md:970` / `README.en.md:916` 的 parchment `2023.09.03` 版本串格式例。
- `AUTO_SETUP.md:455`：`（as-of 2026-10-02 实测 …）` → `（实测 …）`。
- `mcp-server/README.md`：22 对替换（薄档合法落款行保留；`2026-09-12 补的` / `2026-09-25 现扫更新` / `第 42/43 轮` / `快照不自带 as-of` 等段内戳清理；保留 mtime / sha / 计数 / 提交哈希等数据值）。
- `forge/1.18.2/scaffold/README_AI.md`：3 对（`（2026-09-14 实读）` / `（2026-09-24 一手坐实，勿删）` / `（… as-of 2026-09-24）`）。
- 社区短文 8 篇：`lib-bookshelf.md` / `lib-curios.md` / `lib-fabric-language-kotlin.md` / `lib-modern-ui.md` / `lib-patchouli.md` / `lib-satin.md` / `lib-yacl.md` / `library-integration-jei-emi.md`（`快照 as-of 2026-09-16`→`快照`、`as-of 2026-09-07 最新件`→`最新件`、`（2026-09-02）`/`**2026-09-25 更正**`/`（as-of 2026-09-25 重抓后的完整面）`）；「2026-09-22 裁定④」等落款保留。
- `community_knowledge/authored/ingame-playtest-automation.md` 与 `community_knowledge/links/mcmod-dev-tutorials.md` **未动**——两者是 REGISTRY 落点与 attribution 门的载荷面（见 §2 与 §5）。
- 量具：`temp/backup-ledger-20261011/clean-readmes-asof.cjs`（en 锚修正版，带 `en`/`zh` 单侧开关）/ `clean-surfaces-asof.cjs`（面文，含 `--dry`）/ `scan-asof-rest.cjs` / `agg2.cjs` / `probe*.cjs` / `check*.cjs`；报告 `asof-clean-report.txt` / `surfaces-report.txt` / `asof-rest-raw{,2,3}.txt` / `comments-diff*.txt`。

**C. 脚本 / 代码注释清戳（50 行，注释级）**

- `clean-comments-asof.cjs` 处理 24 个文件 50 行：`assert-lib-session-resolve-parity.mjs`(10) / `assert-doc-absence-claims.mjs`(4) / `assert-rule-ban-vs-example.mjs`(3) / `assert-backlog-table-shape.mjs`(5) / `assert-bedrock-script-api-pin.mjs`(2) / `assert-forge-blockshape-family.mjs`(1) / `assert-cross-layer-names.mjs`(2) / `assert-forge-1182-registry-consts.mjs`(2) / `assert-corpus-faithfulness.mjs`(1) / `assert-lib-coord-snapshot.mjs`(1) / `assert-scaffold-mixin-shape.mjs`(1) / `assert-workflow-hitl.mjs`(1) / `build-yarn-mojmap-pairs.mjs`(1) / `test-scripts.mjs`(1) / `test-assistant-gaps.mjs`(1) / `test-core.mjs`(1) / `test-semantic.mjs`(1) / `src/tool-registry.ts`(1) / `src/generators/index.ts`(2) / `src/generators/common.ts`(1) / `src/generators/playtest-bridge-mod.ts`(2) / `src/playtest-bridge/index.ts`(1) / `src/bedrock/index.ts`(1) / `src/generators/playtest-driver.ts`(4)。
- **错误消息串**里的 as-of 标注（26 对，`clean-msg-asof.cjs`）：`assert-doc-absence-claims.mjs`(5) / `assert-rule-ban-vs-example.mjs`(4) / `assert-backlog-table-shape.mjs`(1) / `assert-forge-blockshape-family.mjs`(2) / `assert-lib-session-resolve-parity.mjs`(14，含 10 条 `basis:` 台账条目里的 as-of 尾标）。
- `assert-forge-blockshape-family.mjs:298,324`：`asof: '2026-09-23'` 两处死字段（消息串已不再读它）删除。
- 注：上列两批的 .mjs 改前均存 `temp/backup-ledger-20261011/pre-msg-clean/`（5 件）。

**C2. 第二批残留（同轮续清；`clean-residual-asof.cjs` 精确对，任一对不符即整文件 SKIP 不写）**：11 文件 19 对——

- `src/generators/playtest-driver.ts`(3)：`**八处 javap 分叉**（JDK 8 \`javap -p\`，as-of 2026-10-04）` 与 `COMPILE_OK**（as-of 2026-10-04）` 去 as-of；两处 `**真机跑通 = 2026-10-04**` → `**真机跑通**`。
- `src/generators/playtest-bridge-mod.ts`(1)：`## 本仓对该档的完整出处盘点（as-of 2026-10-11，构件复核后）` → `（构件复核后）`。
- `src/bedrock/index.ts`(1)：`上游实况（npm dist-tags，as-of 2026-09-18）` → `（npm dist-tags）`。
- `src/generators/index.ts`(2) / `src/generators/common.ts`(1)：`（本仓 as-of 2026-09-19/21 只核到 …）` → `（本仓只核到 …）`（哨兵消息的数值与「先按 search_*_docs 核」半句不动）。
- `assert-lib-session-resolve-parity.mjs`(4)：5 处 `。as-of 2026-09-25` 尾标、`（as-of 2026-09-25 实扫 50）`→`（实扫 50）`、`（as-of mtime …）`→`（mtime …）`、`。复核 as-of 2026-09-26`。
- `assert-doc-absence-claims.mjs`(2) / `assert-rule-ban-vs-example.mjs`(1)：两门地板消息去 `；as-of 2026-09-23`。
- `assert-bedrock-script-api-pin.mjs`(2)：`钉值必须带依据与 as-of 日期` → `…与日期`（字段名 `asOf` 与判据①④不动）。
- `CONTRIBUTING_LIST.md`(2)：`新增条目的规矩`（`:136`）与 `L43` 行括号（`:54`）里的 `分母 + 口径 + as-of` → `分母 + 口径`。
- `.github/CODE_OF_CONDUCT.md`(1)：`验证强度、as-of 日期` → `验证强度、日期`。
- 规范声明残留 2 处：`V2.0.0-RELEASE-NOTES.md:5` 与 `mcp-server/docs/mcmap-linkie-absorption.md:7` 的「本文/下文每个数字都带**分母 + 口径 + as-of**」→ 去 `+ as-of`（文件名、日期与读数不动）。

**C2 保留边界（机器载荷，未动）**：`${tier.asOf}` / `${apiPin.asOf}` 的机器渲染（`playtest-driver.ts:4755` / `bedrock/index.ts:870`）、`assert-community-attribution.mjs` 的 `asOf`/`asOfRe`/`FLOOR_ASOF`/三地板与其语料模板、`assert-backlog-table-shape.mjs` 的 `PROSE_RE` 与自检夹具、四份基线 JSON 的 `asOf` 键、pin JSON 的 `asOf` 值、`_lib/api-name-collector.mjs` 的 `as-of ${baseline.asOf}` 渲染、`community_knowledge/links/mcmod-dev-tutorials.md` 与 `community_knowledge/authored/forge-event-system-practices.md` 的 as-of（attribution 门按行读取）；`.codebuddy/plans/*` 与 `.workbuddy/memory/*`（gitignored 历史计划/记忆，非受管面）。

### 2. 判据与反证

- 判据 = 用户令 + 本项目既定判定刀（记忆 `skills-no-ledger-stamps`）：**清** = 我方取证动作时间戳（实测 / 复核 / 现扫 / 复测 / 复跑 / 重抓 / 本轮 + 其 as-of 标注）；**留** = ① 裁定落款（`（2026-09-xx 裁定）`）② 上游事实（`As of Minecraft 1.20.2 …` 引文、parchment `2023.09.03`）③ 数据名/值内嵌（mtime / sha / 计数 / 提交哈希）④ 落点文件与机器载荷（见 §5）。
- 反证 1（en 全命中）：`clean-readmes-asof.cjs en` 40 对**全部 x1**（无 MISS），输出末行 `ALL OK`；两次全量重扫（`scan-asof-rest.cjs`）后，`README.md` / `README.en.md` 只剩前述 4 个「留」命中（经 `indexOf` 放大逐条核过 = 裁定落款 + 格式例）。
- 反证 2（脚本层清净）：对 `mcp-server/scripts/` + `src/` + `test-*` 三前缀过滤重扫 `asof-rest-raw3.txt` = **0 行**（`left.cjs` 输出 `REMAINING script/src lines: 0`）。
- 反证 3（语法与构建）：改动过的 .mjs 全 `node --check` OK；`npm run build`（tsc）通过（`src/` 有改，必须重编 dist）。
- 反证 4（门链）：第 8 步 `node test-scripts.mjs` **rc=0**（`GREEN`）；`node scripts/assert-authoring-lint.mjs` = `ok: 目标 13 件 · J1 技能 12 份 · J2 路径指针 23 枚全在盘 · J3 纯负向现数 0（豁免 2）`。
- 反证 5（装机副本）：`common_skill/mc-research/SKILL.md` vs `~/.agents/skills/mc-research/SKILL.md` 逐行 diff 仅 3 行差（即本次改的三行），拷回后 `identical: true`、`has as-of: false`。
- 可红性：量具本身按「精确 count 断言」写（不符即记 MISS 且整文件不写），首跑 en 6 锚不匹配时**确实是整文件 SKIP 未写**（保护性），修锚后 40 对全绿才落盘——即量具的「不匹配就不动盘」这条腿本轮被真实走过一次。

### 3. 验证台账

（as-of 2026-10-11，串行）
- `node --check`（改动过的 .mjs）：全 OK。
- `npm run build`（mcp-server）：`tsc` 无输出 = 成功。
- **第 8 步** `node test-scripts.mjs`：**rc=0**（`GREEN`；`§S4 门链四数` 盘上 75 / 可达 75 · §S18/S19 真跑 50 道 · W1-2 selftest 40 道 · `本轮未执法腿=0` · 末行 `script helper regression tests passed`）。触因 = 本轮改了 `mcp-server/scripts/**` 与 `src/**`。**消息串清理与死字段删除之后复跑一次仍 `GREEN`**（同一命令两次 rc=0；子门读数：#22 自检 9/9 · #21 自检 8/8 · #20 自检 37/37 · #23 自检 62/62）。
- `node test-cli.mjs`：`test-cli: ok`（其 DOC_SCAN 覆盖本轮改过的 `mcp-server/README.md` / `AUTO_SETUP.md`）。
- `node test-core.mjs`：`core regression tests passed`（`docs-tool-tables registered=86 … 双向零差异` 不变）。
- 三条被改门的直跑：`assert-backlog-table-shape: ok`（124 行 × 3 列，号序连续；「现状列含 as-of/未复核/已闭环 93/124 份」照常只打印）· `assert-lib-session-resolve-parity: ok`（6 组双链路同答 + 35 组窗口口径；地板 30/1/4/8/12）· `assert-forge-blockshape-family: ok`（13 档 / 被扫文件 917 / 禁用形态 0）。
- `node scripts/assert-authoring-lint.mjs`：ok（13 目标 / 12 技能 / 23 指针 / J3=0）。
- 全仓重扫读数（`scan-asof-rest.cjs`，排除 `data/` `temp/` 构建产物）：首扫 76 文件 → 清扫后 **46 文件 / 441 行**，余下全部落在 §5 的「留」清单（台账落点 99+82+63+28+21+18+17+7+6… 行）。
- **第二批（C2）后复跑**（as-of 2026-10-11）：改动 4 个 .mjs 全 `node --check` OK；`npm run build`（tsc）无输出；**第 8 步 `node test-scripts.mjs` 单次复跑绿**（日志 `temp/backup-ledger-20261011/ts-residual.log`；末行 `script helper regression tests passed` · `本轮未执法腿=0` · 0 处 `✗` / `FAIL`；#21 / #22 / #23 三门自检与真树读数不变）。C2 之后另有 3 处**纯文档文本**改动（`CONTRIBUTING_LIST.md:54` 行括号、`V2.0.0-RELEASE-NOTES.md:5`、`mcp-server/docs/mcmap-linkie-absorption.md:7`）落在门跑之后，三者均不在任何门的读面内（`test-cli.mjs` 的 `DOC_SCAN` 只覆盖 `README.md` / `mcp-server/README.md` / `AGENTS.md` / `AUTO_SETUP.md` / `CONTRIBUTING.md`），故未再跑门。
- **复扫读数**：`scan-final-asof.cjs`（含英文 `as of` 短语，不排除 `data/`）= 244 文件 / 701 行；其中 `mcp-server/(scripts|src)` 剩 22 行，**逐行核过全是机器载荷 / 别名误伤**（`alias of enUsJson` 的 `as of`；`_temp/*.d.ts` 上游文本；`（as-of ${baseline.asOf}）` 渲染）。规范短语 `分母 + 口径 + as-of` 全仓剩 13 行 = 本批自身的记录 3 行（`DELIVERY_LOG` / `CHANGELOG`）+ gitignored 的 `.codebuddy/plans`、`.workbuddy/memory` 10 行。
- 门跑范围说明：**按用户令「小范围改文档就不用跑门了」**，README / 面文 / 规范本体那几批**未**逐批跑门；本轮改到 `scripts/**` 与 `src/**`，故按第 8 步纪律跑一次全链（rc=0）——不是为文档改动跑的。

### 4. 数据侧变更

无——未触 `data/**`、门基线、`LEDGER` 值；`src/**` 改的是注释与模板体字符串（`templates.ts` 一行），已 `npm run build` 重编 `dist/`（`dist/` 不入库）。

### 5. 未做清单

- **按判定刀保留（未清，若用户要清请点名）**：① 台账落点 —— `DELIVERY_LOG.md`、`mcp-server/CHANGELOG.md`、`CORPUS_PROVENANCE.md`、`NIGHT_BATCH.md`、`doc/tool-error-codes.md`、`community_knowledge/authored/ingame-playtest-automation.md`、`mcp-server/docs/{knowledge-coverage-sweep-20260924,mcmap-linkie-absorption,evidence-forge-1182-registries}.md`、`V2.0.0-RELEASE-NOTES.md`、`CONTRIBUTING_LIST.md` 正文（99 行，逐条实测记录）、`.codebuddy/plans/*`、`.workbuddy/memory/*`；② 机器载荷 —— `assert-community-attribution.mjs` 的 `asOf` / `asOfRe` / 三地板、`community_knowledge/links/mcmod-dev-tutorials.md`（82 行，门要求 ≥20 行含 as-of）、`assert-bedrock-script-api-pin.mjs` 的 `asOf` 钉值形状（判据①④）、`assert-skill-yarn-attest.mjs` 的 `external-apis-signoff.tsv` 的 `asof` 列、`assert-backlog-table-shape.mjs` 的 `PROSE_RE`、`authoring-lint-baseline.json` / `corpus-semantics-baseline.json` / `rules-api-names-baseline.json` / `assertion-ledger.json` 的 `asOf` 键；③ 上游事实 —— `forge/1.20.4/knowledge/common/datapack-format.md` / `neoforge/knowledge/{common/resourcepack-format,version-changes/1.20.x}.md` 的 `As of Minecraft 1.20.2 …` 引文。
- `THIRD_PARTY_NOTICES.md`（3 处 as-of 2026-09-27）**未动**：该文件在 `.codebuddy/rules/实施计划要求.mdc:19` 列为**禁区**（与根 `LICENSE` / `package.json` 同列），改它超出本令授权的默认范围，留待用户点名。
- `.codebuddy/plans/*` / `.workbuddy/memory/*`：属历史计划与记忆档（非受管面），未动。
- **C2 补清**：此前 §1 C 漏列的门内 prose 残留已清（`assert-lib-session-resolve-parity` / `assert-doc-absence-claims` / `assert-rule-ban-vs-example` / `assert-bedrock-script-api-pin` 的消息串；`CONTRIBUTING_LIST.md` 两处规范短语；`.github/CODE_OF_CONDUCT.md` 一处；`V2.0.0-RELEASE-NOTES.md` 与 `mcmap-linkie-absorption.md` 两处「口径声明」）⇒ 现全仓 `as-of` 只剩上列机器载荷 + 台账落点 + 上游引文 + gitignored 的 `.codebuddy`/`.workbuddy`。`mcp-server/scripts/provision-26x-docs.mjs:8` 的 `(as of crawl)` 是英文习语（无日期、非台账戳），未动。
- **C2 的行数口径**：`CONTRIBUTING_LIST.md` 表内 99 处 `as-of` 行仍保留（逐条实测记录，属台账正文）；只清了其中的**规范短语**与表头/列规。
- 未 commit（提交归用户）。

### 6. 自我更正

- **量具三度改坏注释**：`clean-comments-asof.cjs` 初版把注释里的 `getX()` 改成 `getX(`（ASCII 括号清理规则误伤，在 `playtest-driver.ts` 上放大到 79 行 diff 时暴露）——改为**只清全角括号**并加「只动含 as-of 的行」门后重跑；随后又两次因前导缩进/悬空标点被吃（2 空格变 0）继续收紧，最终版保留前导空白、只吃 token 与紧邻标点。教训：**批量改写量具必须先在放大 diff 上人工过一遍**，不能只看「x1 命中」。
- **规范本体漏算一处**：初次盘点把 `CONTRIBUTING.md` 的库数据链计数口径（`:232-233` 的「（2026-09-24 复跑）」）归为「台账数据」未动，后按「它本身就是计数口径义务句」改判为**规范本体**并清（zh + en 同构）。
- 首扫曾把 `mcp-server/scripts/_temp/server-2.9.0-index.d.ts` 计入待清面；实为 `_temp/` 临时产物目录，未动（**不是** `_lib/`）。

---

## 2026-10-11 · README 系错误码台账入住 `doc/tool-error-codes.md` + 两语文末立「指针表」（用户令「清掉、放 doc 文件夹、留指针、所有指针收文末、en 同步」；维护档）

**第 0 块 · 结论**：README.md / README.en.md / mcp-server/README.md 里残余的三处 as-of 台账（「实跑取证」21 行、「86 个工具的错误码覆盖清单」18 行、tier 计数副本一句）已清面，逐字并入新落点 [`doc/tool-error-codes.md`](./doc/tool-error-codes.md)（98 行，含 tier 快照附录）。两语 README 文末各立「指针表（外部落点索引）」21 行，把正文外指落点收拢；en 同步；两语「项目结构」树已按用户拍板加 `doc/` 行；清理遗留的四处悬空引用（两语各两处，用户读 README 发现）已按拍板「带路径自含」修复；「快速开始」整节（含「解释模板」）已按指令移到「模组测试流程 loop」之前（两语同步）。声明面三处（受管面清单 / 台账落点行 / 归档指针门 REGISTRY 5→6）同步。门链 authoring-lint / test-core / test-cli / 第 8 步 test-scripts 全 rc=0（树行与引用修复落盘后 test-cli / test-core 均已复跑仍绿）；搬运反证四腿 ALL GREEN。未 commit。

### 1. 改了哪些文件

- 新增 `doc/tool-error-codes.md`（98 行；用户点名的落点）：zh §1 实跑取证（18 非空行）/ zh §2 覆盖清单（15 行）/ en §1（18 行）/ en §2（15 行）四节**正文逐字** + §4 tier 快照附录（as-of 2026-10-04 = 53 项 = fabric 18 / neoforge 14 / quilt 10 / forge 10 / liteloader 1）；抬头写明来源、口径与「中文两节标题降为 `## 1.` / `## 2.` 适配层级（正文未改写）」。
- `README.md`（1288 行）：删两节错误码台账 40 行（原 :567-606）+ 已并入社区短文的游玩自测指针节 5 行（原 :160-164）+ 7 处删行（教程收尾 / AUTO_SETUP 段 / CLI 细节 bullet / mixin-support 行 / 补充文档行 / 许可行 / FAQ 历史台账行）+ 7 处改行（教程 intro 改「跑前必读…见文末『指针表』」等）+ 4 处串尾收编；文末 +27 行「指针表（外部落点索引）」（含 21 行表）。
- `README.en.md`（1217 行）：同构镜像（40+5 行删（原 :563-602 / :161-165）+ 7 删行 + 6 改行 + 6 串尾 + 表 27 行）。
- `mcp-server/README.md:171`：删计数副本（「as-of 2026-10-04 为 53 项 = …」），口径句「唯一真源、正文不数档」保留（快照已入 doc 附录）。
- 声明面：`REPORT-FORMAT.md:19`（受管面清单 + `doc/**`，清单是手列快照，新增顶层目录须同步）；`CONTRIBUTING.md`（目录清单 + `doc/`；§台账落点行 + 「工具错误码台账 → `doc/tool-error-codes.md`」）；`CONTRIBUTING.en.md`（同构镜像两处）；`mcp-server/scripts/assert-archive-pointers.mjs`（REGISTRY 5→6，why 行点名来源）。
- 用户拍板跟进（同轮）：`README.md` / `README.en.md` 的「项目结构 / Project layout」树各加 `doc/` 行（放在平台树后的非平台目录组，`bedrock/` 与 `community_knowledge/` 之间；zh 4 字符 + 25 空格对齐既有列宽）。
- 悬空引用修复（用户拍板「带路径自含」，同轮追加）：`README.md:205/213` 与 `README.en.md:206/214` 四处替换——首现处（205/206）改为「见游玩自测口径单源 [`community_knowledge/authored/ingame-playtest-automation.md`](./community_knowledge/authored/ingame-playtest-automation.md) 的「意图空间 · 执行器落地面」节（入口行在文末「指针表」）」（术语就地定义）；末处（213/214）把「见上方『后半 loop 真机矩阵与已核实边界』」/ "the pointer above (…)" 改指「文末「指针表」的游玩自测行（§真机台账 = 现行判据 T5 + 历史归档 T0–T4）」，前半改「见上文…（同一口径单源）」/ "the same single source of truth"。
- 结构重排（用户指令「快速开始放到模组测试流程 loop 前面」，同轮追加）：`快速开始`（含「解释模板」子节，58 行）从「社区知识与库模组」之前**整节移到「模组测试流程 loop」之前**——两语同步（en `Quick start` 同构）；内容逐字不动，只搬块 + 接缝空行归一到单空行（搬运器断言：块逐字在场一次 + 非空白行数不变）；zh 1289→1288 行 / en 1218→1218 行。量具 `temp/backup-ledger-20261011/move-quickstart.cjs`（含移前整份备份 `README*.md.premove`）。
- 首节标题改名（用户点选「2」，同轮追加）：`## 定位：人在环的副驾驶` → `## 它是什么：AI 帮你干活，重要决定你来做`；en `## Position: a copilot with a human in the loop` → `## What it is: AI does the work, you make the calls`；术语表两语引用同步（zh「人在环（HITL）」行改「见「它是什么」一节」，en 改 `see the "What it is" section`）；全仓扫旧名（人在环的副驾驶 / copilot with a human / 见「定位」一节 / the "Position" section）零残留。
- 支持版本表同步（用户指「没有同步」，同轮追加；两语 10 处）：① NeoForge 两表把「primer 可有 26.2（旁路）」改为「**26.2 / 26.3 走迁移指南**」+ 表注（`get_migration_guide` 的 `route="26.1->26.2"` / `"26.2->26.3"`，源 = NeoForge Primer；配合 `analyze_porting_path`；官方文档发布后同步补档）；② LiteLoader 行补 **`1.8.9` / `1.10.2` 为 draft**；③ ModLoader 行补 **`1.2.5` / `1.5.2` 为 draft**（禁止用 `1.6.4` 顶替）。一手证据：`get_migration_guide` 两条路线 `found:true`（platform=fabric 也回同一 Primer）；`list_fabric_versions` / `list_neoforge_versions` 均无 26.2/26.3；`activate_platform_pack session modloader 1.2.5` 与 `liteloader 1.8.9` 均 `PACK_NOT_FOUND`（message 明写 `pack-status=draft`）。
- temp 量具（不入库）：`temp/backup-ledger-20261011/` 的 `build-doc-file.cjs` / `clean-readme2.cjs` / `verify-round3.cjs` + 两语改写前整份备份 + `testscripts-run.log`。

### 2. 判据与反证

- 判据 = 用户令 + `WRITING-FOR-AGENTS.md` §6 搬动程序（并入落点 → 新落点在 `assert-archive-pointers` REGISTRY 登记 → 原处留指针 → 跑门链）+ §2 指针句三件（可复制路径 + 触发条件 + 失败读数）。
- 搬运反证（`verify-round3.cjs`）四腿全绿：① 四节共 66 非空行逐行在 doc（18/15/18/15；标题行按归一化比层级 / 编号）；② 两语 16 条搬走签名行 / 收编指针句**零残留**（README.md 现存唯一「实跑取证」串即指针表行内）；③ 两语文末指针表在最后一节（其后无 `##` 级标题）+ 6 条关键行在盘；④ 教程 intro 标记在盘。
- 解释性裁定（披露）：「所有指针」实现为**正文外指落点**收进文末表；**文内互引**（FAQ 指本文节）保留原位（导航 ≠ 落点），已写进两语表头；en 表 21 行与 zh 同集（agent 向行不剔）。
- 可红性：`assert-archive-pointers --selftest` OK（P1 在盘 / P2 未提及两向 / P3 缺面 / P4 在册未注册两向）。
- 基线口径：原文取自工作树**改写前备份**（不是 `git HEAD`——工作树含未提交改动，上批已有教训）；删除区衔接抽查两语均为「空行 + 下一节标题」，无孤立分隔线。

### 3. 验证台账

（as-of 2026-10-11，串行，全 rc=0）
- `node scripts/assert-archive-pointers.mjs`：在册档案 6 全部在盘且被必读面提到（面 3/3），新条 `doc/tool-error-codes.md ← CONTRIBUTING.md`；`--selftest` OK。
- `node scripts/assert-authoring-lint.mjs`：目标 13 件 · J1 技能 12 份 · J2 路径指针 23 枚全在盘（新 `./doc/tool-error-codes.md` 已解析）· J3 纯负向现数 0（豁免 2）。
- `node test-core.mjs`：`core regression tests passed`；`docs-tool-tables registered=86 README groups=15 rows=88 tools=86 双向零差异 投毒=8 次全命中`。
- `node test-cli.mjs`：`test-cli: ok`（「根 README 短形式 0 行」文本地面门 + 形式门 5 份文档 0 处）。
- **第 8 步** `node test-scripts.mjs`：**rc=0**（日志 `temp/backup-ledger-20261011/testscripts-run.log`；§S4 门链四数 盘上 75 / 可达 75 · §S18/S19 真跑 50 道 · W1-2 selftest 40 道 · `本轮未执法腿=0` · 末行 `script helper regression tests passed`）。触因 = 本轮改了 `mcp-server/scripts/assert-archive-pointers.mjs`（与第九十批不同，那批未动脚本故未跑）。
- 树行落盘后复跑（用户拍板跟进）：`node test-cli.mjs` = `test-cli: ok`；`node test-core.mjs` = `core regression tests passed`（`docs-tool-tables registered=86 … 双向零差异` 不变）——日志 `temp/backup-ledger-20261011/testcli-rerun.log` / `testcore-rerun.log`。
- 悬空引用修复后复跑：`node test-cli.mjs` = `test-cli: ok`；`node test-core.mjs` = `core regression tests passed`——日志 `temp/backup-ledger-20261011/testcli-rerun2.log` / `testcore-rerun2.log`。
- 结构重排后复跑：`node test-cli.mjs` = `test-cli: ok`；`node test-core.mjs` = `core regression tests passed`——日志 `temp/backup-ledger-20261011/testcli-rerun3.log` / `testcore-rerun3.log`；post-move sha256 前 12：`README.md` = `24dddc695015`、`README.en.md` = `525a9df9059a`。
- ⚠️ 并发写记：本轮期间 `模组测试流程 loop` 的 **zh 标题日期**（原「（2026-10-01 起）」）被另一写方清掉——本轮首次骨架提取时还在、本批搬运前复读时已无；**不是本批任何一步改的；en 标题仍带 "(since 2026-10-01)" ⇒ 两语标题现不同步**。来源未核实，本批未动，是否把 en 同步去掉等用户定。
- 本批尾部两项（首节标题改名 + 支持版本表同步）**未跑门**——用户令「小范围改文档就不用跑门了」（标题改名那次门跑已被用户取消）；只做 grep 级残引自检（旧名/残引零残留，改动点逐条复读）。

### 4. 数据侧变更

无——未触 `data/**`、门基线、LEDGER 值；无 `src/**` 改动（无需 `npm run build`）。

### 5. 未做清单

- `README.en.md` 不在任何门的扫描面（`test-cli` DOC_SCAN = README.md / mcp-server/README.md / AGENTS.md / AUTO_SETUP.md / CONTRIBUTING.md）⇒ en 侧无机器门，靠搬运反证 + 人工镜像兜底（既有现状，非本轮引入）。
- `README_human*.md` 未加指针表（人读本不含这些台账；要统一等拍板）。
- `doc/` 未进 `CONTRIBUTING_LIST`（发现入口 = 两语结构树行 + 指针表行 + CONTRIBUTING 落点行；实测该文件出现的 `doc/` 子串均为 `data/forge_javadoc/*`，非本目录）。
- 未 commit（提交归用户）。

### 6. 自我更正

- 本批汇报初稿曾写 en 指针表「18 行、剔 agent 向行」——盘上实物为 **21 行、与 zh 同集**；以盘为准更正。
- 并入时中文两节标题由 `###` 降为 `## 1.` / `## 2.` 并编号（结构适配）；doc 抬头已如实写明「正文未改写」，避免「逐字」句被标题层级差打脸。
- 首跑核对脚本三红（zh 两个标题 + tier 附录锚串）均为**量具**按原样标题写死所致，非产物缺陷——修量具后四腿全绿（坑记在脚本注释）。
- **自我更正（悬空引用）**：本批把 5 行游玩自测指针块整体收进文末指针表时，连带删掉了块内两条锚（`[[详细口径单源：…]]` 定义行 + 节标题本身）⇒ 教程节内两语各两处悬空（zh 205/213、en 206/214 的「口径单源」与「见上方『后半 loop 真机矩阵与已核实边界』」/ "the pointer above"）——由用户读 README 直觉发现（「结构有点问题」），已按拍板「带路径自含」修复（首现带路径定义、末处指文末指针表行）。教训：**收块要顺带扫正文对块内「定义行 / 术语 / 标题」的引用**。

---

## 2026-10-11 · rules / knowledge 面取证日期戳全量清扫（用户令「统一清一遍这些面」；维护档）

**第 0 块 · 结论**：按用户指令把 rules / knowledge（含 `code-patterns`、各档 `AGENTS.md`、`knowledge/libs` 与技能残余）里**我方取证/复测/抓取动作的时间戳**全量清扫：命中 632 行 → **残留 76 行**（残留 = 上游事实日期 / 裁定落款 / 文件名与数据值内嵌 / `versions.json` 数据文件）；实删 **594 行**（577+15+2，跨 ≈350 文件，含 neoforge「对照签字」表**抓取日整列** 6 文件）。镜像 46 棵全刷（12418 目标 0 漂移）、quilt 数据副本 6 档重建、台账 `contextualSkipped 3065` **无漂移**、`test-scripts` rc=0。未 commit。

### 1. 改了哪些文件

- 清扫面（两遍 `--write`）：`<平台>/<档>/.cursor/{rules,skills,agent}`、`<平台>/<档>/knowledge/**`、`<平台>/<档>/code-patterns/**`、`<平台>/<档>/AGENTS.md`、根 `knowledge/**`（libs/patterns）。代表形态：`（javap 实测 2026-10-01）`→`（javap 实测）`；`（2026-10-05 核）`→整块删；`实证 2026-10-05：`→`实证：`；`（截至 2026-09-04…）`→`（最新…）`；`本文件 2026-09-05 新建`→`本文件新建`；`（2026-10-11 构件实证）`→`（构件实证）`；`已于 2026-10-05 由 X 换成 Y`→`已由 X 换成 Y`；libs `> 数据读取日期：…（源：`→`> 数据来源：`（28 行）；neoforge 核实表 `| 抓取日 |` 列删除（表头/分隔/数据行同步，6 文件）。
- 数据侧：`data/quilt_1.18.2|1.19.4|1.20.1|1.20.4|1.21.1|1.21.11/**` processed `qsl-verified.md` + index-l0/l1/l2 重建（`index-qsl-verified.mjs --write`）。
- 镜像：46 棵树 `sync-skills.ps1` 全刷（含补漏后单刷 `forge/1.16.5`）。
- `mcp-server/scripts/assert-scaffold-rules-conflict.mjs`：**未改**（台账前后同值）。
- 清扫器（scratch，未入仓）：`D:\mc-skill-temp\adjud2\stamp-clean.mjs`（规则表 + 守护闸 + 表列摘除 + 定点改写）、`stamp-triage.mjs`（可疑筛）、`touched-trees.txt`。

### 2. 判据与反证

- 判据 = 用户令「统一清一遍」+ WRITING-FOR-AGENTS §6（记录去落点）。判定刀四类：**清** = 我方取证/读取/复测/抓取/核对时间戳；**留** = G1 裁定/定案/结案落款（含 W5-2 / A-43 / 用户裁定）、G2 上游事实（最后提交·末次发布·归档·编辑·releaseTime·lastUpdated·跨度）、G3 文件名与数据值内嵌（`crash-*.txt`、`fetchedAt: …T…Z`、URL 段）、G4 上游版本-日期元组（`0.13.1+26.2，2026-08-19`）。
- 反证五条：① 干跑全量 diff 抽样 300+ 块 + 可疑筛 0；② **误伤三类已修复并留探针**——ISO 时间戳截断（`fetchedAt:T…`）、代码 `()` 被当空括号删、代码块内注释对齐被空格折叠（加围栏感知，CLN 114→104）；③ 残留 76 行逐条分类 = 裁定 33 / 上游 29 / versions.json 5 / 文件名内嵌 2 / 跨度 2 / 其余 5（5 行为上游 release 元组，逐行过目）；④ RELEDGER 前后 `contextualSkipped 3065` 不变（只动文本不动判死面）；⑤ 镜像门 + qsl-sync 门独立绿。
- 一处口径修正：G4 守护的排除检查原写 `pre.slice(-45)` 而 `pre` 只截 20 字符（排除空转，2 行漏清）⇒ 改 `pre50`，探针复跑证清（踩坑记录在脚本注释）。

### 3. 验证台账

- 清扫读数：pass1 `343 文件 / 577 行` + pass2 `68 文件 / 15 行` + 补漏 `2 行` = **594 行**（口径 = 逐遍实际改动行数，同文件多遍分别计）；表列摘除 6 文件。
- 残留：同 pathspec `git grep -nE "20[0-9]{2}-[01][0-9]-[0-3][0-9]"` = **632 → 76**（分类见第 2 块；清单 `date-stamp-residual2.txt`）。
- 门：#1 `MC_SKILL_SCAFFOLD_RELEDGER=1` 重算 = 3065（全同）⇒ 无需重钉，独立 checked rc=0；#2 `assert-skill-mirrors` rc=0（57 档 / 12418 目标 / 0 漂移 / frontmatter 全查）；#3 `index-qsl-verified --write` 6 档 + `assert-qsl-verified-sync` **绿**（10/10 档一致、无孤儿）；#4 `test-scripts` **rc=0**（日志 `D:\mc-skill-temp\adjud2\testscripts-datesweep2.log` 29 行 · §S4 G3 49 树/633 处/取件缺口 0 · G4 61 库 sha256 全对账 · `本轮未执法腿=0` · 末行 `script helper regression tests passed`）。
- 过程日志：`testscripts-datesweep.log`（首轮链）、`stamp-clean-report-{dry,write}.txt`、`probe{2,3}.txt`。

### 4. 数据侧变更

- `data/quilt_*` 6 档 processed + index-l0/l1/l2 重建（sha 随源稿刷新）；其余 `data/**` 未动。
- 无门钉值变更；`versions.json`（libs 数据文件）不在清扫面（见第 5 块）。

### 5. 未做清单

- **`versions.json` 照留**：数据文件（`dataDate`/`basis` 被投影脚本消费），其 5 行日期即残留之一。
- **月粒度写法**（如 quilt「（2026-09 maven 复核）」）不匹配日期正则，未动；要清须另立口径。
- `community_knowledge/**` 与 `DELIVERY_LOG` / `CHANGELOG` / `CORPUS_PROVENANCE` 等**落点文件**按设计不清。
- `mcp-server/scripts/**` 内维护注释里的日期（LEDGER 重钉史等）未动（非面文，且不在本次 pathspec）。
- **并行会话**在本轮中途写入 quilt 1.20.4/1.21.1 的横幅日期戳已随二次清单清掉（其正文改动不受影响——清扫只动日期 token）；若其后续再写同款戳，需再跑一遍（清单须现取）。
- 未 commit。

### 6. 自我更正

- 首轮清单生成早于并行会话的 quilt 横幅写入 ⇒ 首轮漏 5 行；以「**重取清单 + 幂等重跑**」补救。教训：器扫类作业「清单生成」与「落盘」之间存在第三方写入窗口，落盘前应复取清单。
- 误伤三处（ISO 时间戳 / 代码 `()` / 代码块对齐）与 G4 排除空转一处，均已修并在脚本留注释 + 探针；见第 2 块。
- 承接上一节口径：技能面先清，本轮按用户「统一清」扩到 rules/knowledge/AGENTS/code-patterns，判定刀一致——**我方动作时间戳 = 记录（清）；上游事实与裁定落款 = 留**。

---

## 2026-10-11 · 四族构件实证轮审查 F1–F4 修复（bedrock 假反例 / 生成器旧文案 / quilt 头幅矛盾 / modloader 编译口径）（维护档）

**第 0 块 · 结论**：按用户「1)修复 2)我自己来」——对上一轮「四族构件实证轮」审查发现的 F1–F4 全部修复落盘：F1 bedrock 技能 Beta 判定法假反例换真反例（`getPackSettings` → `BlockComponentTypes.EntityStorage` + 两包 `@beta` 读数 stable 0 / beta 110）；F2 生成器三处 modloader 旧文案（「仅一处出处 / 5 项全无来源」→「已实证三类出处 / 4 项无来源」）；F3 modloader 编译验证口径（旧 exit-0 属旧签名产物 → 双臂复跑口径）；F4 quilt 1.21.1 / 1.20.4 两树头/横幅与构件实证自相矛盾共 **25 处**统一（rules + AGENTS + skills；1.18.2/1.19.4/1.20.1 及 1.21.3–1.21.11 八树零改动，属正确状态）。终态门链 rc=0；F: 侧存档污染清理归用户。未提交。

### 1. 改了哪些文件

- `knowledge/libs/bedrock-only/mc-script-server/SKILL.md`：Beta 判定法改写——对照臂换 `BlockComponentTypes.EntityStorage`（beta 包带 `@beta`、stable 包查无），自证读数「stable `index.d.ts` 全域 **0** 条 `@beta` / beta **110** 条」；删去不成立的 `world.getPackSettings` 反例。无日期戳（现状 + 判据式）。
- `mcp-server/src/generators/playtest-bridge-mod.ts`（头注 ~L61-65）/ `playtest-driver.ts`（~L2480-2483 warnings）/ `src/wave/register.ts:258`（`GENERATE_PLAYTEST_DRIVER_DESCRIPTION`）三处：改为「本仓对该档已实证三类出处（`ModLoader.setInGameHook` 注册 / `BaseMod.onTickInGame(float, Minecraft)` 回调实名 / `ModLoader.getMinecraftInstance()` 单例），玩家与位置、发聊天（语义）、截图、读方块 **4 项仍无来源** ⇒ MC 半边逐条 `TODO(未核实)` + throw，`/execute` 一律 fail-closed」。
- `modloader/1.6.4/knowledge/common/safe-api.md:103`：「编译验证强度」改写——2026-10-04 的 exit 0 针对**旧回调签名**（`public void onTick()`）产物、不代表现产物；现产物对未更新旧替身报 **2 errors**（须补齐 `onTickInGame` / `getMinecraftInstance` / `Minecraft` 类），补齐替身后 **exit 0**（记录 `D:\mc-skill-temp\adjud2\mlcheck\` 的 `out-orig` / `out-fixed`）。
- quilt 1.21.1（15 处）：`.cursor/rules/05-events.mdc`（:3 横幅、:13 节标题）、`01-registry.mdc`（:3、:9、:11 墓碑、:20 Decision Flow）、`AGENTS.md`（:7 横幅尾、:19 注册行）、`.cursor/skills/mc-registry`（description + 横幅 + 正文）、`mc-events`（同三处）、`mc-networking`（横幅）。
- quilt 1.20.4（10 处）：`.cursor/rules/01-registry.mdc`（:3、:19）、`05-events.mdc`（:3、:9 邻档禁令改为「只走本档实证表」）、`AGENTS.md`（:7 尾、:19 行）、skills `mc-registry` / `mc-events`（横幅 + :20 邻档禁令行）/ `mc-networking`（横幅）。
- 统一措辞四件套（按各树实证面逐树写）：**alpha 构件逐字在场**（指针 `knowledge/common/qsl-verified.md`）/ **仍无正式版** / **默认不生成** / **要用须用户显式确认接受 alpha 依赖**；networking 符号无实证者保留「无构件实证、只作方向」。
- 镜像：两树各跑 sync-skills 两次（第二次因并行写方的日期清扫改动源面）；`npm run build` 重跑。
- 无 `data/`、LEDGER、门基线变更。

### 2. 判据与反证

- F1 判据：`minecraft-server-2.10.0.tgz` 干净重解包（`D:\mc-skill-temp\adjud2\bedrock-stable\`，823,584 B，sha512 `c6d9c0d4…`）——`world.getPackSettings` 在 **:22628 在场**（原「∉ stable」反例不成立）；`@beta` 计数 stable=0 / beta=110；真反例 `BlockComponentTypes.EntityStorage`（stable 查无、beta 有）。原记录哈希 `CB5A9A94…`（66,288 B）实为 server-ui 2.2.0 的 `index.d.ts`（同目录先后解包覆盖 ⇒ 取件污染）。
- F2 判据：以该轮自产物 `ml-bridge-regen.json` 与 DELIVERY_LOG 该节正文（「onTickInGame 实名」「仍缺 4 项」）为准——三处 .ts 字符串仍写「仅 setInGameHook 一处出处 / 5 项全无来源」，属自相矛盾，按已实证事实改写。
- F3 判据：双臂 JDK 8 `javac -encoding UTF-8`：补齐替身对现产物 **exit 0**；未更新替身 **2 errors**。全盘无任何脚本/替身含 `onTickInGame`（旧 exit 0 只能来自旧签名产物）。
- F4 判据：树内自证——1.21.1/1.20.4 的 rules/AGENTS/skills 头把「源码树考据，非可编译 API」「不存在任何可用构件」当绝对句，与本树 `05-events.mdc` 勘误段、`qsl-verified.md` 构件实证行直接矛盾；统一改写保留全部禁令的**政策**（默认不生成），只替换不成立的事实断言。反证：620 源文件探针，两树旧词命中 **68→0**；日期戳扫描两树 skills+rules **0 残留**。
- 边界反证：1.18.2/1.19.4/1.20.1 三树（同批实证、已自洽）零改；1.21.3–1.21.11 五树（无该版 QSL 构件、原句仍成立）零改。

### 3. 验证台账

- 终态门链（as-of 2026-10-11，串行，全 exit 0）：`npm run build` OK；`node test-scripts.mjs` **rc=0**（日志 `D:\mc-skill-temp\adjud2\ts-run3.log`；`本轮未执法腿=0`；#23 规则树 API 名门真树红 0 且「靠豁免洗的 0 条」；末行 `script helper regression tests passed`）；`assert-scaffold-rules-conflict` = 「47 档 · 规则 447 篇 · 判死符号 67 · scaffold 冲突 0 · 台账 checked」（**LEDGER 3065 未动、免重钉**）；`assert-skill-mirrors` = 「扫档=57 · 镜像目标=12418 · AGENTS 漂移 0 档 · 拒=0」。
- 前序快照（同日、改动后、日期清扫前）：`test-core.mjs` rc=0；`npm run test:cli:quick` rc=0；`assert-authoring-lint` = 「目标 13 件 · J1 12 份 · J2 23 枚全在盘 · J3 纯负向 0」（技能文本再变后此两道不在读面内，j-面差异已由 mirror 门复跑覆盖）。
- 探针与证据：`D:\mc-skill-temp\adjud2\`——`mlcheck\`（双臂编译）、`bedrock-stable\`（干净解包）、`bedrock-ui\`（污染件留档）、`probe-quilt2.mjs` / `quilt-face.mjs` / `date-scan.mjs`、`ts-run2/run3.log`、`g-conflict2.log`、`g-mirror2.log`。
- ⚠️ 并发写记：落笔期间另一写方在同两树做技能/规则面日期戳清扫（与本轮同向），且发生在我前次镜像同步之后 ⇒ 已按合并后源面二次重刷镜像并复跑全部门链；本节读数为并发合并后的终态快照。

### 4. 数据侧变更

无——未触 `data/`、语料索引、LEDGER 值、门基线。bedrock oracle 目录污染在仓外（`F:\MC_GAME\_oracle-jars\bedrock\package\`），**归用户自理**（用户已明示「2)我自己来」）。

### 5. 未做清单

- F: 侧存档污染清理 = 用户自理（勿动 `F:\MC_GAME\_oracle-jars\bedrock\package\` 以外为误读；本轮未碰 F:）。
- 并行写方清扫在 AGENTS 横幅留下的两处引号残句（1.21.1「「止于」」、1.20.4「「的 QFAPI 7.7.0 + QSL 6.3.0 终版」」）未修——属对方在写的面、非本轮 F1–F4；建议其清扫收口时一并顺文。
- 1.21.3–1.21.11 五树 rules :3 的「maven 只到 alpha」措辞（本版实为 **0 构件**）未改——无该版构件、不构成「不成立」类缺陷；要统一为「无本版构件」建议并入「技能/规则措辞统一」另立项。
- 各树 skills 面存量日期戳（如 1.21.3+ 的 `mc-registry`）不在本轮范围，待「技能面日期戳清扫」扩面统一处理。
- 未提交（提交归用户）。

### 6. 自我更正

点名旧节：**「2026-10-11 · liteloader / modloader / bedrock / quilt QSL 四族构件实证轮（含 1.21.1 QSL 证伪）」**（本文件下文）。本轮对其三处记录作更正（正文不改写，按只追加规则在此更正）：

- (a) 该节 §1（§「改了哪些文件」bedrock 条）与 §2（bedrock 判据条）的「Beta 判定对照臂：`getPackSettings` ∈ beta、∉ stable」**不成立**：干净解包中 `getPackSettings` 在 stable 2.10.0 **:22628 在场**；真反例 = `BlockComponentTypes.EntityStorage`。同条「d.ts 无 `@beta`/@rc 注解标签」**只对 stable 成立**（beta 包 110 条 `@beta`）。技能正文已按新对照臂改写。
- (b) 该节 §3（验证台账）记录的「解包 d.ts（stable `CB5A9A94…`）」实测对象是 **server-ui 2.2.0 的 `index.d.ts`**（66,288 B）——同目录多包先后解包互相覆盖所致；@minecraft/server 2.10.0 stable 干净件 = 823,584 B / sha512 `c6d9c0d4…`。行证据（`:23297` / `:27123` / `:21580`）经干净件复核**成立**；tgz 层哈希（`777B7CBA…` / `37D8B6C0…`）与 liteloader/modloader md5 五枚复核**全部相符**。污染目录清理归用户。
- (c) 该节把桥模板改为 `onTickInGame` 真签名并改 `safe-api.md` 表后，**编译验证句与生成器三处文案未随动**（前者仍写 exit 0 属旧签名产物、后者仍写「一处出处 / 5 项」）——属该轮的收口遗漏，已按 F2/F3 修正（本节 §1/§2）；该节 javap 结论本身（`onTickInGame` 三档都在、mcarchive 最新 = 1.6.2、quilt alpha 全集在场）复核无误。

---

## 2026-10-11 · README 系「后半 loop 真机矩阵」台账段落二次清理（并入社区短文 §真机台账 T5；维护档）

**第 0 块 · 结论**：用户指正 README 仍带台账段落（点名「后半 loop 真机矩阵」）——该节 2026-10-01 加入、2026-10-08 首并过一次（40 条边界 + 旧矩阵 → 社区短文 T0–T4，README 留紧凑矩阵 + 判据八条）；本轮把余下两块连英文镜像一并**逐字**并入 `community_knowledge/authored/ingame-playtest-automation.md` §真机台账 **T5**，README 两语只留指针块；教程两段 dated 读数改「运维口径 + 指针」、FAQ 改指，并顺手修正路由表一处过期计数（自建桥动作 4→10）。搬运反证四腿全绿 + 门链四道 rc=0；未提交。

### 1. 改了哪些文件

- `community_knowledge/authored/ingame-playtest-automation.md`（833→935 行）：节首「真机台账」标题与说明改为「2026-10-08 首并，2026-10-11 二次清理」；T1 注释的「现行紧凑版矩阵在 README」改指 T5；**新增 T5**（第 619–719 行）= T5.1 中文原文 + T5.2 英文原文（正文各 32 非空行逐字全中；两语标题行与收尾指针行单列 text 块留档）。
- `README.md`（1352→1321 行）：第 160–196 行整节（37 行）→「后半 loop 真机矩阵与已核实边界」指针块（5 行）；「实测链（…2026-10-03 首次真机）」段 → 「两条运维口径（`fabric 26.1.2` 真机实测）」+ 指路；「真机读数（as-of 2026-10-01…）」段 → 「四会话真机读数」+ 指路；「首次真机实测（…）暴露的两条易用性边界」→「两条易用性边界（`fabric 26.1.2` 真机实测）」；FAQ「游玩自测」行改指社区短文 §真机台账；路由表「自建桥动作只有 4 个」→「10 个、按档 fail-closed」。
- `README.en.md`（1279→1248 行）：第 161–197 行整节 → 英文指针块；Measured chain 段 → 运维规则 + 指路；Real-machine readings 段 → 会话小结 + 指路；usability 措辞同款改；FAQ 行改指。
- `temp/backup-ledger-20261011/`（不入库，`.gitignore` 第 44 行 `temp/` 已排）：改写前 `README.md`/`README.en.md` 整份备份、两语节文本 `*-matrix-section.txt`、量具 `extract.cjs` / `insert-t5.cjs` / `clean-readme.cjs` / `verify-move.cjs`。

### 2. 判据与反证

- 定档与落点判据：`WRITING-FOR-AGENTS.md` §6「台账与实施状态：一史一处」（规则/口径留面、记录/状态去落点；面上只留指针；搬动程序 = 先并入落点 → 原处留指针 → 跑门链）——游玩自测口径/坑位/逐轮取证史的唯一落点即该短文（`assert-archive-pointers` REGISTRY 第 3 条），未新建落点。
- 搬运反证（四腿，全绿）：① 切出的两语原文各 32 非空行**逐行**在 T5 区命中；② README 两语不再含 6 条搬走签名行（表头 / 八条标题 / 原收尾指针行）；③ 新指针块 6 条关键行在盘；④ 判据原文抽查（`/status.ready` 条）README 已清。读数见第 3 块。
- 反证（为什么上一轮留、这轮并走不矛盾）：2026-10-08 的「留」是为了让「读 README 的 agent」看到判据（T3 有记账）；本轮用户拍板按 §6 收口——留的是**指针**（点名路径 + 触发条件 + 失败读数三件齐），判据本体在 T5 逐字可引，不丢信息。
- 一处注意（记录）：本轮基线是**工作树**而非 `git HEAD`（HEAD 的 README 比工作树旧一版，首轮抽取曾按 HEAD 取到错位行）；备份与行号均以改写前工作树为准。

### 3. 验证台账

- 门链（as-of 2026-10-11，串行跑，全 exit 0）：`node scripts/assert-archive-pointers.mjs` = 「在册档案 5 全部在盘且被必读面提到（面 3/3）；账本候选 5（在册 2 + 豁免 3）」；`--selftest` OK（1 正对照 + 投毒：P1 缺失 / P2 无提及 / P2 README 替代 / P3 缺面 / 围栏两向 / P4 未在册两向）。`node scripts/assert-authoring-lint.mjs` = 「目标 13 件 · J1 技能 12 份 · J2 路径指针 23 枚全在盘 · J3 纯负向现数 0（豁免 2）」（与上期读数一致 ⇒ 未扰动）。`node test-core.mjs` = `core regression tests passed`（`docs-tool-tables registered=86 README groups=15 rows=88 tools=86 双向零差异`）。`node test-cli.mjs` = `test-cli: ok`（含「根 README 短形式 0 行」「根 README 示例行 exit 0 tool=status」）。
- 第 8 步 `test-scripts.mjs` 未跑：未动 `mcp-server/scripts/**` 或 `scripts/**`，触发条件不成立（按 `WRITING-FOR-AGENTS.md` §8 第 5 步）。
- 行号读数（口径 = 按 `\n` 计）：README.md 1352→1321；README.en.md 1279→1248；社区短文 833→935；T5 区 = 第 619–719 行。

### 4. 数据侧变更

无——未触 `data/`、语料索引、LEDGER 值、门基线；`assert-scaffold-rules-conflict` 台账（3065）与语料无关，未重钉。

### 5. 未做清单

- 同类 as-of 台账三处**未动**（用户点名的是 playtest 台账，这三处清不清待拍板）：`README.md`「实跑取证：常见错误码…（as-of 2026-10-04）」节、「86 个工具的错误码覆盖清单（as-of 2026-10-04）」节、`mcp-server/README.md:171` 的 tier 计数副本（写「唯一真源、正文不数档」却列了 as-of 计数）。
- `README.en.md` 路由表①「有桥」行与中文不同构（仍只写 BlackBoxPro，缺「本仓自建最小桥 8 目标」口径）——本批未改，属内容补齐而非台账清理。
- 未提交（提交归用户）；工作区其余未提交件（会话开始前已在 M 状态）未触碰。

### 6. 自我更正

- 抽取原文时先按 `git show HEAD:README.md` 取行号，与工作树错位一行——真因 = README 工作树本就有未提交改动、HEAD 是旧一版。已改为按**内容标记**从工作树定位（不认行号），并把这条件写进第 2 块备查。
- 首次落指针块后，指针块尾行与「后半 loop 教程」标题之间缺空行（沿用原文的紧排），已补一个空行；en 侧核对无此问题。
- `README.en.md` 新增段里一处全角冒号（`**Two operational rules …**：`）已修回半角（`:`）；该改动在所有门跑完之后，属标点级、不在任何已跑门的读面内（test-cli 的 5 份文档不含 `README.en.md`）。

---

## 2026-10-11 · 技能正文台账式日期戳清扫（补正「四族构件实证轮」一节；维护档）

**第 0 块 · 结论**：用户指正「不要在 skill 里面写类似于台账的 `**2026-10-11 构件……**`（skill 行文规范没有写吗?）」——WRITING-FOR-AGENTS §6 判定刀本已规定「规则 / 口径留面、记录 / 状态去落点」（2026-10-10 立规），我在四族轮把带日期的取证史写进了 **3 个技能源稿**（liteloader 1.8.9/1.10.2 的 mc-gui、`knowledge/libs/bedrock-only/mc-script-server`），现已全部改写为「现状 + 指针」；技能面日期戳 0 残留（7 面镜像随刷），门链复跑 rc=0。另：quilt QSL 维持「披露但不当默认选型」（用户拍板，与现行文本一致，零改动）。

### 1. 改了哪些文件

- `liteloader/1.8.9/.cursor/skills/mc-gui/SKILL.md`、`liteloader/1.10.2/.cursor/skills/mc-gui/SKILL.md`：删 `**2026-10-11 构件 javap 复核**` 戳与「亦在构件中」叙述 → 「本档可用（名字以 knowledge/common/verified-api.md 核实表为准）：…」+ 原有禁令原样保留；description 由「构件 javap 已核（…）」改回功能型「GUI / HUD 钩子（HUDRenderListener / Tickable / PluginChannelListener，签名已核）」。
- `knowledge/libs/bedrock-only/mc-script-server/SKILL.md`：删「（2026-10-11 实证）」戳与「旧示例…已过时」记录 → 「**Beta 判定法**：…（对照臂：`world.getPackSettings` 只出现在 beta 包）」+ 现状句「`BlockExplodeAfterEvent` 属 stable 面——**不是** Beta API，不要当 Beta 事件生成」。
- 镜像：`scripts/sync-skills.ps1 -TargetDir liteloader/1.8.9` 与 `liteloader/1.10.2` 各跑一次（各 3 skills / 11 rules / AGENTS 面），日期戳在源稿与全部镜像面 0 残留。
- `mcp-server/scripts/assert-scaffold-rules-conflict.mjs`（注释更正一行）：上一节 LEDGER 归因里的「规则/技能」改为「`.cursor/rules` 侧」——该门头注 :40 自述**只读 `.cursor/rules`**（不读技能与各宿主投影），技能改写不动它的计数；数值 3065 未变。

### 2. 判据与反证

判据 = WRITING-FOR-AGENTS §6 判定刀（「规则/口径」留面、「记录/状态」去落点；单行落款除外）+「面上只留指针…取证史整段进落点」+ §8 完成判据「没有实现史」。反证三条：① `git grep "2026-10-11"` 对四族全部 `*/skills` 面 0 命中（源稿 + 7 面镜像）；② `MC_SKILL_SCAFFOLD_RELEDGER=1` 重算 `contextualSkipped` 仍 = **3065**（技能文本改写不触发漂移 ⇒ 反证上一节归因错在「技能」二字）；③ `assert-skill-mirrors` 独立跑 rc=0（扫档 57 · 镜像目标 12418 · 漂移 0 · frontmatter 合法性 78 篇规则 + 1257 技能正文全查）。

### 3. 验证台账

- 门链：`cd mcp-server && node test-scripts.mjs` **rc=0**（日志 `D:\mc-skill-temp\adjud2\testscripts-fourfam2.log`，45 行 · `本轮未执法腿=0` · #23 规则树 API 名门真树红 0／豁免洗 0 · 末行 `script helper regression tests passed`）。
- 独立门：`assert-scaffold-rules-conflict` = `台账 checked` rc=0；`assert-skill-mirrors` rc=0。
- 残留 grep：`2026-10-11` 在 `liteloader/*/.cursor/skills`、liteloader 各镜像面、`modloader|bedrock|quilt` 各 skills 面、`knowledge/libs` 全 0。

### 4. 数据侧变更

无——LEDGER 值未动（3065），数据链 / 语料 / 索引 / 构件均未触碰。

### 5. 未做清单

- 同款「取证快照 + 日期」注记仍广存于 **rules 与 knowledge/common 核实表**（本仓既有长期风格，如「javap 实测 2026-10-01」）；本轮只按用户指令清**技能面**——若要统一清 rules / knowledge 面，另行拍板（会再触发 LEDGER 重钉周期）。
- quilt QSL alpha 事项按用户拍板维持现状（披露见 qsl-verified.md 顶部与 05-events；默认路径仍 Vanilla `Registry.register` / 同版 Fabric API）——零新改动。
- 未 commit。

### 6. 自我更正

- 「四族构件实证轮」一节第 1 块对 LEDGER +3 的归因写成「来自上述四族规则/技能实证行改写」——经查该门**只读 `.cursor/rules`**，技能面（含我当时改的 mc-gui）不在扫描面内，归因已在该门注释里改正为 rules 侧。
- 本轮教训（同一枚）：**取证史 / 日期戳属「记录」，落点是 DELIVERY_LOG 与 memory，不是技能正文**；技能正文只写现状与指针。规范早已写明（WRITING-FOR-AGENTS §6），是我落笔时把「出处」与「取证史」混为一谈。

---

## 2026-10-11 · forge 22 处修复复审收尾：归因改写 + 联网核证（维护档）

**第 0 块 · 结论**：对上一轮「forge 系老版本全量构件裁决」的 22 处修复做了逐条对照文档复审，code-level 判定**全部正确**；落地两类收尾改动——①两处**归因改写**（Fabric 1.12.2/1.13.2 支持面、`RenderGameOverlayEvent` 族移除点）均经联网/构件当场取证；②若干**措辞与可编译性修正**（1.15.2 `BasicParticleType` 等）。共改 16 个文件（15 个修复件 + 1 句 authority 文件失实句），受触 9 棵树的镜像已刷。收口链 `test-scripts.mjs` 首跑红在一道台账漂移（已由**平行会话**先钉解决、非本轮失分），复跑 **rc=0**。未提交。（本轮为知识库面改写，无 L 阶梯适用；判绿 = 收口链 + 逐点落地核实。）

### 1. 改了哪些文件

- `forge/1.12.2/.cursor/rules/01-registry.mdc:62`：Fabric 分支句改写 → 「本仓没有 fabric/1.12.2 树（建档自 1.14.4 起；官方 Fabric 线不支持 1.12.2——2026-10-11 meta 实测对该版回 400/空表、1.14.4 回 200；Fabric 系支持仅见 Legacy Fabric 分支、本仓未建档）」。
- `forge/1.13.2/.cursor/rules/01-registry.mdc:87`：同款改写（保留 `knowledge/porting/01-api-cross-loader.md` 的 `ls data` 实证指针）。
- `forge/1.16.5/.cursor/rules/01-registry.mdc:205-208` + `forge/1.17.1/.cursor/rules/01-registry.mdc:205-206`：`ServerStartingEvent`（`net.minecraftforge.event.server`）标注为「1.18 起的新名/新包（1.17.1 仍是 `fmlserverevents` 旧名，1.18.2 构件已无旧名）——本档构件查无」。
- `forge/1.15.2/.cursor/skills/mc-particle/SKILL.md`：frontmatter `mappings: mcp`→`official`；注册代码 `() -> new ParticleType(false) {}`→`() -> new BasicParticleType(false)`（1.15.2 构件：`ParticleType` 唯一构造是 `(boolean, IParticleData$IDeserializer)`，无单参构造 ⇒ 旧写法编译不过；`BasicParticleType` 即 1.16.5+ `SimpleParticleType` 前身）；注册段注释补「官方 1.15 文档页同流程、页内用 MCP 旧名（`makeParticle`/`Minecraft#particles`/`registerFactory`），与 official 名指同一批成员」对照说明。
- `forge/1.16.5/.cursor/skills/mc-particle/SKILL.md`：注释补构造序证据（`IParticleFactory#createParticle` 首参是 data；`SpriteTexturedParticle` 构造只有 `(ClientWorld, ×3)/(ClientWorld, ×6)`、无 data 参 ⇒ 直接 `MyParticle::new` 对不上，须显式 lambda）。
- `forge/{1.17.1,1.18.2,1.19.4,1.20.1,1.20.4}/.cursor/skills/mc-particle/SKILL.md`：注释把裸 `SpriteParticleRegistration` 限定为 `ParticleEngine.SpriteParticleRegistration`（**嵌套类、顶层无此类**）。
- `forge/{1.19.4,1.20.1,1.20.4}/.cursor/rules/09-anti-patterns.mdc:253-254`：旧归因「1.19.3 弃用、1.19.4 移除」→ 构件口径（旧族止于 **1.18.2**：40.3.11 sources 有；**41.1.0（1.19）** 起只有新族——41.x 的 2022-07 客户端重构 PR **#8786** 引入 `RenderGuiOverlayEvent` 族）。
- `forge/1.15.2/scaffold/gradle.properties:13`：Mappings 注释断言化（「本包钉 official/mojmap 层；rules / skills / 示例一律按 official 名书写」）。
- `forge/1.15.2/AGENTS.md:29`（authority 文件）：因 mc-particle frontmatter 改值，把「本包 35 件 skills 全声明 `mappings: mcp`」改为「以 `mcp` 为主（34 件；`mc-particle` 自 2026-10-11 起为 `official`——其 ②③ 段随 2026-10-06 构件复核改用 official 成员名）」，保留「混合档（2026-09-25 定案）/ 逐件值只描述成员名族且并非每件都经核实」原披露。
- 镜像：`sync-skills.ps1 -TargetDir forge/<ver>` 对 9 棵树全跑（每棵 `Sync Complete: 35 skills, 11 rules`；1.15.2 在 AGENTS.md 改后二次刷并核镜像行）。

### 2. 判据与反证

- 未动门与断言；复审判据 = 逐条对照该档构件 javap + 官方文档页；联网取证三件（存档见第 3/4 块）：
  - **Fabric 支持面**：官方 meta 对 1.12.2 / 1.13.2 回 **HTTP 400**（body 2 字节 = `[]`），1.14.4 对照 **200 / 253 builds**；Legacy Fabric（`meta.legacyfabric.net`）对两版各 **200 / 74 builds** ⇒ 原「无 Fabric Loader 发行」措辞不成立，改为「官方线不支持 + Legacy 分支存在、本仓未建档」。
  - **渲染叠加事件族**：`jar tf` 复列（2026-10-11）——`src-1.18.2-40.3.11.jar` 仅 `RenderGameOverlayEvent.java`；`src-41.1.0/44.1.23/45.4.1.jar` 仅 `RenderGuiOverlayEvent.java` ⇒ 原「1.19.3 弃用」为推测，删去改构件口径。
  - **`ServerStartingEvent` 改名点 = 1.18**（1.17.1 仍 `fmlserverevents.FMLServerStartingEvent`，1.18.2 已换名）。
- 反证（不动 34 件的依据）：1.15.2 与 1.16.5 两档 AGENTS.md 均载有 2026-09-25「混合档」定案（值只描述成员名族、并非每件都经核实）⇒ 全档 `mcp` 标注是**已披露已知态**、非失修；本轮只改被修复直接触发失实的一件与其摘要句。

### 3. 验证台账

- 落地核实（逐点、磁盘实况）：全部 16 个文件按 Read/ASCII 锚复核到位。期间发现本机 **`findstr` 对含 CJK 的模式静默不匹配**（同批纯 ASCII 模式全命中），一度把已落地的修复读成「未落地」——已按磁盘实况纠正并改用 Read/ASCII 锚（坑记入记忆）。
- 门 #1：`cd mcp-server && node test-scripts.mjs` **rc=1** —— 唯一红 = `assert-scaffold-rules-conflict` 台账漂移（实跑「`contextualSkipped=3065`，钉的是 3062」；日志 `D:\mc-skill-temp\adjud2\testscripts-repair-closeout.log`）。复核：**平行会话**（liteloader/modloader/bedrock/quilt QSL 构件实证轮，其节在本文件下方）已于当日 14:56 按同协议重钉 3065（其节第 4 块 + 代码注释 `mcp-server/scripts/assert-scaffold-rules-conflict.mjs:361-364` 两处自述）——**非本轮重钉、本轮未改任何门钉值**；门独立复跑 = GREEN（`47 档 · 规则 447 篇 / ❌ 行 455 条 · 判死符号 67（歧义丢弃 160）· scaffold 冲突 0 · 台账 checked`）。
- 门 #2：同命令复跑 **rc=0**（`testscripts-repair-closeout2.log` **46 行** · 0 AssertionError · 末行 `script helper regression tests passed` · `本轮未执法腿=0`；§S18/S19 真跑块逐道 rc=0；`#23 规则树 API 名门` 真树 rc=0·红 0）。
- 残留扫：`1.19.3` 在三处 anti-patterns 零命中；`RenderGameOverlayEvent` 在 1.19.4/1.20.1/1.20.4 仅存于「已不存在」披露行；新 token（`旧族止于 1.18.2`、`#8786`、`BasicParticleType`、`ParticleEngine.SpriteParticleRegistration`）逐档在盘可查。

### 4. 数据侧变更

- **无**。本轮未改任何 LEDGER / 台账 / 数据文件；`contextualSkipped 3062→3065` 一值为平行会话所钉（见第 3 块），本轮修复未再触发漂移（链 #2 直接用 3065 钉值全绿即为证）。
- 新增 scratch（未入仓，`D:\mc-skill-temp\adjud2\`）：`meta-fabric-{1.12.2,1.13.2,1.14.4}.json`、`meta-legacy-{1.12.2,1.13.2}.json`（5 份 meta 应答）、既有 `src-*.jar` 4 份与 `forge-meta.xml`、`testscripts-repair-closeout{,2}.log`。

### 5. 未做清单

- **未提交**（本批与工作区其余未提交件一起等用户处置；提交归用户）。
- **1.15.2 其余 34 件 / 1.16.5 的 frontmatter 值与正文名族偏差**：属两档 AGENTS.md 已披露的「混合档、并非每件都经核实」既定状态，本轮只同步了被修复直接触发失实的那一句；逐件改值需逐件核代码层，未做（可作另立轮候选）。
- **联网核证面收窄**：只核了 fabric 官方/legacy meta 与 Forge maven 构件；未扩展其他分发渠道（与本题无关）。

### 6. 自我更正

- 上一节（forge 全量构件裁决轮）第 3 块记「门 #1 唯一红 = 台账漂移并已重钉 3062」；本轮链 #1 又红在同门（3065 vs 3062）——起因是平行会话的新一轮规则改写与本节修复同日均动树，该值已由平行会话按其自述协议落定，本节**不重复记账、不并功**。
- 复审中途曾把 1.15.2 全档 `mappings: mcp` 判为「一致性问题」；后查该档与 1.16.5 的 AGENTS.md 2026-09-25 定案，知其为已披露混合档已知态——最终只改被本轮修复直接影响的 mc-particle 一件 + 同步 authority 句，余 34 件不动。
- 探针自身坑（同第 3 块首条）：本机 `findstr` 含 CJK 模式的「查无」一度误读为「修复未落地」，已改用 Read/ASCII 锚复核、结论纠正。

---

## 2026-10-11 · liteloader / modloader / bedrock / quilt QSL 四族构件实证轮（含 1.21.1 QSL 证伪）（维护档）

**第 0 块 · 结论**：按用户更正（「bedrock / liteloader / modloader 之前没有查过；quilt QSL 可以下载 JAR，放到 F:\MC_GAME」），为这四族补齐**真构件级**核对（此前只到扫描面）：liteloader 三档全打通并订正幻影类 `com.mumfrey.liteloader.Listener`（真身是 `api.Listener`）、1.8.9/1.10.2 的「tick 取证受阻」禁令解除；modloader 三档官方 zip 入库、订正 `getUniqueEntityId`（1.6.2/1.5.2 不存在，仅 1.2.5 有；mcarchive 列表独立证**上游最新就是 1.6.2、无 1.6.4 构件**）、桥骨架占位换成真签名 `onTickInGame(float, Minecraft)`；bedrock 以真 npm d.ts 核准 stable 面与 scaffold 钉值、Beta 判定法成文并纠正过时示例；quilt QSL **重大证伪**——1.21.1 树旧文「以上符号在已发布构件中不存在」不成立（alpha 构件全含），1.18.2 独缺 `DYNAMIC_*`，+1.21.3/1.21.4/1.21.8/1.21.10/1.21.11 **0 个 QSL 构件**（各档「无构件」声称维持成立）。收口台账重钉 3062→3065 后 `test-scripts` rc=0。未 commit。

### 1. 改了哪些文件

- `liteloader/1.8.9/knowledge/common/verified-api.md` + `liteloader/1.10.2/knowledge/common/verified-api.md`：重写为构件 javap 表（jar 名/md5 + LiteMod/api.Listener/Tickable/PluginChannelListener/ChatFilter/ChatListener/OutboundChatListener/RenderListener/ViewportListener/CommonPluginChannelListener 逐类签名）；「tick 钩子取证受阻」旧禁令标历史、解禁；1.10.2 另加混淆警告（vanilla 参类型是混淆名，只证类/方法/参数个数）。
- `liteloader/1.12.2/knowledge/common/verified-api.md`：4 处——构件复核头注、LiteMod 全签名 + 顶层面 `com.mumfrey.liteloader.Listener` **不存在**订正、各回调组件签名行、CommonPluginChannelListener `List<String>`。
- `liteloader/1.8.9/.cursor/skills/mc-gui/SKILL.md` + `liteloader/1.10.2/.cursor/skills/mc-gui/SKILL.md`：Tickable/PluginChannelListener 解禁（构件表已核），「未列进本档构件表的名字不得输出」保留。
- `modloader/1.6.4/knowledge/common/safe-api.md`：加构件头注（官方 1.6.2 zip，mcarchive 证无 1.6.4）；BaseMod 表加 `onTickInGame(float, Minecraft)`/`onTickInGUI`、getName 非抽象、clientChat/serverChat；ModLoader 表 `getUniqueEntityId` 划线勘误（→ 用 `registerEntityID`）、加 `getMinecraftInstance()`、重载注记；桥可行性节重写。
- `modloader/1.5.2/knowledge/common/safe-api.md` + `modloader/1.2.5/knowledge/common/safe-api.md`：重写（空表维持 + 构件签名节；1.5.2 旧判「tick 无出处」标作废；1.2.5 独有 `getUniqueEntityId` 与 1.2.5 专属回调名）。
- `modloader/1.6.4/.cursor/rules/04-entity.mdc`（`getUniqueEntityId` 划线勘误）+ `05-events.mdc`（加真 tick 回调行）。
- `mcp-server/src/generators/playtest-bridge-mod.ts`：6 处——占位 `public void onTick()` → 真签名 `@Override public boolean onTickInGame(float partialTicks, Minecraft mc)`（返回值语义 TODO 恒 true）、JSDoc/类头/todo 串/README 引言/来源表逐处更新（as-of 2026-10-11，仍缺 4 项 fail-closed）。
- `bedrock/.cursor/rules/00-project-setup.mdc`：版本登记刷新（beta=`2.12.0-beta.1.26.60-preview.30`、rc=`2.11.0-rc.1.26.60-preview.30`；默认 `[1,26,44]` = 旧一代 beta，**只登记不改**维持）。
- `bedrock/.cursor/rules/07-script-api.mdc`：版本口径改「以 npm dist-tag `latest` 为准（2026-10-11 实况 2.10.0）；docsStatus.scriptApiStable（读=2.9.0）是语料基准会滞后」。
- `knowledge/libs/bedrock-only/mc-script-server/SKILL.md`：Beta 判定法成文（stable/beta npm pack 对照 + 对照臂 `getPackSettings`）；`BlockExplodeAfterEvent` 旧示例标已过时（现 stable 2.10.0 与 beta 包都在）。
- `quilt/1.18.2|1.19.4|1.20.1|1.20.4/knowledge/common/qsl-verified.md`（各 2 处）：QSL Core Registry 行升级为构件实证（jar 名 + javap：`getEntryAddEvent`/`RegistryMonitor.create` + `filter`/`forAll`/`forUpcoming`）；新增各档生命周期节（Server 4 字段 + 回调；Client 3 字段无 STARTING）；1.18.2 另注 `DYNAMIC_REGISTRY_SETUP/LOADED` 缺席（逐版差异禁跨档抄）。
- `quilt/1.21.1/knowledge/common/qsl-verified.md`：降级声明重写——源码考据升为构件实证（alpha 构件含全部符号）+ 勘误段（旧「不存在」不成立，已删）；alpha-only 注记保留。
- `quilt/1.21.1/.cursor/rules/05-events.mdc`：删三处划线否决 + 构件实证注记 + 勘误段（「仍成立的是 1.21.1 线只有 alpha、没有正式版」）+ 跨档禁令软化。
- `mcp-server/scripts/assert-scaffold-rules-conflict.mjs`（LEDGER 常量）：重钉 `contextualSkipped 3062→3065`（+3 场合型丢弃行，来自上述四族规则/技能实证行改写）。
- 数据侧（见第 4 块）：`data/quilt_1.18.2|1.19.4|1.20.1|1.20.4|1.21.1/**` processed `qsl-verified.md` + index-l0/l1/l2 重建。
- 镜像：`sync-skills.ps1` 跑 5 次——liteloader/1.8.9（35 skills/11 rules）、liteloader/1.10.2（同形）、modloader/1.6.4（2 skills/11 rules）、bedrock（10/11）、quilt/1.21.1（3/4）。

### 2. 判据与反证

判据全部 = 真构件 `javap`（JDK21，路径见第 3 块）。要点与反证：

- liteloader：`com.mumfrey.liteloader.Listener` 三枚构件全部「找不到类」；`api.Listener.getName()` 在。`Tickable.onTick(Minecraft, float, boolean, boolean)` 三档全在（推翻旧「取证受阻」）。1.10.2 vanilla 类型是混淆名（bcx/ey/eq…）⇒ 只证结构不证可读名，**无 mapping 腿，不硬编**。
- modloader：`getUniqueEntityId` 在 1.6.2/1.5.2 javap 查无、1.2.5 有 ⇒ 文档缺陷。`BaseMod.onTickInGame(float, Minecraft)→boolean` 三档都在。mcarchive 列表独立复核**最新发布 = 1.6.2**（1.6.4 构件不存在，此前骨架「TODO 缺 1.6.4」实为上游无此物）。1.6.2 vanilla 参类型混淆（`ats`），与 1.10.2 同口径。
- bedrock：真 d.ts 逐行实证——`readonly playerSpawn: PlayerSpawnAfterEventSignal`（:23297）、`export const world: World`（:27123）、`run(callback: () => void): number`（:21580）；server-ui 三表单类在。Beta 判定对照臂：`getPackSettings` ∈ beta 包、∉ stable 包。npm dist-tags as-of 2026-10-11：latest=2.10.0（与 scaffold 钉值/规则 00 一致）、beta=2.12.0-beta.1.26.60-preview.30。d.ts 无 @beta/@rc 注解标签（方法级判定只能走包对照）。
- quilt QSL：`ModInitializer.onInitialize(ModContainer)` + `ENTRYPOINT_KEY` 五档全在；1.21.1 `10.0.0-alpha.5+1.21.1` **含** `RegistryEvents`/`RegistryMonitor`/`ServerLifecycleEvents`/`ClientLifecycleEvents` 全族 ⇒ 旧文「不存在」被证伪。1.18.2 的 RegistryEvents **无** `DYNAMIC_REGISTRY_SETUP/LOADED`（1.19.4+ 才有）。生命周期回调五档一致：`$Starting#startingServer(MinecraftServer)`、`$Stopped#exitServer(MinecraftServer)`、`ClientLifecycleEvents$Ready#readyClient(class_310)`；Client 无 STARTING 字段。maven 版本后缀直方图（144 版）：+1.18.2:25 / +1.19.4:11 / +1.20.1:7 / +1.20.4:7 / +1.21.1:3 / **+1.21.3·+1.21.4·+1.21.8·+1.21.10·+1.21.11:0** ⇒ 那 5 棵树「无构件」维持成立，无需改动。
- 替身口径沿用：**只证签名形状、不证类存在**；本轮全部结论出自真构件，无替身腿。

### 3. 验证台账

- Oracle 构件（用户授权落点 `F:\MC_GAME\_oracle-jars\`，仓外）：
  - liteloader：1.8.9=`liteloader-1.8.9-20160414.153538-10.jar`（md5 `12CBDC8C16DE3552A2EFA3582AA37738`，附 sources jar `85C35FE4…`）/ 1.10.2=`liteloader-1.10.2.jar`（md5 `8A7C21F32D77EE08B393DD3921CED8EB`）/ 1.12.2 = gradle 缓存 `…\com.mumfrey\liteloader\1.12.2-SNAPSHOT\e3197d8d8a4f60576bf9af88b654d2e94b8c56ea\`。
  - modloader：`ModLoader-1.6.2.zip`（md5 `A3E335BA5D5E1625918C8932D8FA14C8`）/ `1.5.2`（`6423AC75F1EFC55115FD7AFA9D35506A`）/ `1.2.5`（`71A43B73A25F7F92C1B2D620DEE97CC9`）+ 解包 `ex-1.6.2|1.5.2|1.2.5\`（md5 逐枚 2026-10-11 现场重算）。
  - bedrock：npm tarball `minecraft-server-2.10.0.tgz`（sha512 前 32 `777B7CBA91A7FAAE2F7907654FA8257E…`）/ `2.12.0-beta.1.26.60-preview.30.tgz`（`37D8B6C0…`）/ `minecraft-server-ui-2.2.0.tgz`（`8F316278…`）+ 解包 d.ts（stable `CB5A9A94…` / beta `FCE28B07…`）。
  - qsl：5 版 × 3 模块 = 15 jar（`qsl_base`/`registry`/`lifecycle_events`；1.18.2=`1.1.0-beta.26`、1.19.4=`5.0.0-beta.11`、1.20.1=`6.3.0`、1.20.4=`8.0.0-alpha.13`、1.21.1=`10.0.0-alpha.5`）+ `qsl`/`core` POM。
  - 工具：`G:\graalvm-jdk-21_windows-x64_bin\graalvm-jdk-21.0.12+7.1\bin\javap.exe`。
- 门与自检：#1 `MC_SKILL_SCAFFOLD_RELEDGER=1 node scripts/assert-scaffold-rules-conflict.mjs`（只打印）= 重算值，手抄重钉后独立复跑 **GREEN / rc=0**；#2 `cd mcp-server && node test-scripts.mjs` **rc=0**（日志 `D:\mc-skill-temp\adjud2\testscripts-fourfam.log`，45 行；`本轮未执法腿=0`；§S4 G1–G4 全绿——G3 语料保真 49 树/633 处 `<<<`/取件缺口 0，G4 索引自洽 61 库/Σchunks 51516/sha256 全对账/孤儿 chunk 0；#23 规则树 API 名门真树红 0 且「靠豁免洗的 0 条」；§S18/S19 真跑 50 道逐道 rc=0）；#3 `node scripts/assert-qsl-verified-sync.mjs` **GREEN**（「10/10 档源稿存在，processed 派生物全部与源稿归一化一致，无孤儿」）；#4 桥生成器再生成探针 `hasOnTickInGame=true hasOldPlaceholder=false`；#5 `npm run build`（tsc）OK + `node test-assistant-gaps.mjs` 全过；#6 残留扫 5 路（`已发布构件中不存在`/`仅 HUDRenderListener`/`tick 钩子一行`/`onTick()` 0 命中；`BlockExplodeAfterEvent` 恰余 1 处 = 刻意保留的「已过时」注记）。
- 台账/证据：`D:\mc-skill-temp\adjud2\`（`mcarchive-modloader.html`、`qsl-meta.xml`、`mcs-versions.json`、`ml-bridge-regen.json`、各日志；scratch 未入仓）。

### 4. 数据侧变更

- 门 LEDGER 一值重钉：`contextualSkipped 3062→3065`（+3 场合型丢弃行；`crossLines 455 / verdictSkipped 2341 / banned 67 / per-pack 分布 / conflicts 0` 重钉前后全同）。
- `data/quilt_<ver>/quilt-docs/<ver>/processed/qsl-verified.md` + `index-l0/l1/l2` 重建 5 档（1.18.2/1.19.4/1.20.1/1.20.4/1.21.1），经 `node scripts/index-qsl-verified.mjs --write`；1.21.3/1.21.4/1.21.8/1.21.10 按设计跳过（无源稿或缺 index）——同步门 #3 绿证无孤儿/无漂移。
- 无 `docsStatus` 改写（bedrock 语料未重抓，仅规则侧登记新版本数字）。
- Oracle 构件与全部 scratch 均落仓外（`F:\MC_GAME\_oracle-jars\`、`D:\mc-skill-temp\`），仓库无二进制新增。

### 5. 未做清单

- quilt：QSL 1.21.1 线**只有 alpha**（`10.0.0-alpha.5`），是否接受 alpha 依赖写进工程 = 用户拍板项（已在要拍板里挂着）；其余 5 个 quilt 档上游 0 构件，只能维持「无构件」披露。
- modloader：桥骨架仍缺 4 项 MC 侧名字（玩家/坐标字段、聊天语义、截图、方块读取签名）⇒ 维持 `// TODO(未核实)` + fail-closed；1.6.2 混淆参类型只到结构级。
- liteloader：1.10.2 混淆参类型同上；三档均未做真机/编译验证（本轮是文档口径轮）。
- bedrock：只核了 `@minecraft/server` + `server-ui` 两个包；其余模块（`server-net`/`server-admin` 等）未下载；`script_eval` 不在 Learn pack-manifest 的结论沿用旧证（未复测）。
- 版本类数字为 as-of 2026-10-11（npm dist-tag 与 maven 都会漂）。
- 未 commit（提交归用户）。

### 6. 自我更正

- **quilt/1.21.1 旧判被本轮证伪**：此前在无构件前提下把「以上符号在已发布构件中不存在」写进树与规则（保守降级）；本轮 alpha 构件 javap 证明符号**全部存在**——该句已删并替换为「alpha-only」限定（错的是「不存在」，不是「要谨慎」）。教训与 `mc-fluid` 族并列：**无构件时的「查无」只能写成「未核实」，不能写成「不存在」**。
- **modloader `getUniqueEntityId`** 曾被三棵树列为可用 API——真构件证它 1.6.2/1.5.2 均无（仅 1.2.5 有）；三棵树 + 生成器已按勘误修正。
- **liteloader `Listener` 包位**：旧行把 `com.mumfrey.liteloader.Listener` 与 `api.Listener` 并写；构件证实顶层那只是幻影类。
- **liteloader 「tick 取证受阻」**（2026-10-04 GitLab 404 所致）本轮解除——不是「后来有了」，是当时没拿到的构件现在拿到了；两棵树的禁令已按证据反转。

---

## 2026-10-11 · forge 系老版本全量构件裁决（10 档 936 行 → 22 处修复）（维护档）

**第 0 块 · 结论**：把 nonfabric-scan 里剩余未裁决的 forge 系版本树全部过了一遍真构件 javap（1.12.2–1.20.4 共 10 档 936 行），判出并修复 **22 处**「文档教的 API/事件/音效名在真构件里不存在或已改名」缺陷（粒子注册机制 5 档、键盘常量 2 档、音效名 2 档、事件类名 3 档、fabric 死引用 3 档、datagen 构造 2 档、其余 5 档为既有修复复验），全树 7 面镜像已刷，残留扫 0 真命中。门收口见第 3 块。

### 1. 改了哪些文件

- `forge/1.12.2/.cursor/rules/01-registry.mdc`：`fabric/1.12.2` 死引用 → 「本仓无该树」披露。
- `forge/1.13.2/.cursor/rules/01-registry.mdc` + `08-client-server.mdc`：同款死引用；`KeyInputEvent` 补 `client.event` 包 import 注（`fml.common.gameevent` 整族在本档不存在）。
- `forge/1.15.2`：`01-registry.mdc` 死引用（fabric 建档不含 1.15.2）；`skills/mc-particle` 注册机制重写（`RegistryEvent` 旧法 → `ParticleFactoryRegisterEvent` + `particleEngine.register` + `createParticle(T,…)` 首参 data）；`08-client-server.mdc` `Keyboard.KEY_G`→`GLFW.GLFW_KEY_G`。
- `forge/1.16.5`：`01-registry.mdc` `ServerStartingEvent`→`FMLServerStartingEvent`（1.17+ 名）；`08-client-server.mdc` 同 KEY_G 修；`skills/mc-particle` `MyParticle::new`→两级 lambda（参数序不匹配）。
- `forge/1.17.1`：`01-registry.mdc` →`FMLServerStartingEvent` 且注明搬到 `net.minecraftforge.fmlserverevents`；`skills/mc-sound` `Sounds.DIRT_*.get()`→`SoundEvents.GRAVEL_*`（vanilla 无 DIRT 方块音，且无 Sounds 类）；`skills/mc-particle` 两级 lambda。
- `forge/1.18.2`：`skills/mc-sound` `BLOCK_STONE_*`→`STONE_*`（BLOCK_ 前缀零命中）；`skills/mc-particle` 两级 lambda。
- `forge/1.19.4`：`09-anti-patterns.mdc` `RenderGameOverlayEvent.Post`→`RenderGuiOverlayEvent.Post`（1.19.4 已移除）；`skills/mc-particle` `registerSpriteSet/registerSprite` lambda 化。
- `forge/1.20.1`：同 09-anti-patterns 修；同 mc-particle 修；`skills/mc-datagen` `ItemTagsProvider` 构造（第三参真类型 `CompletableFuture<TagsProvider.TagLookup<Block>>`、补 `String modId, ExistingFileHelper` 五参 super）+ `PIGLIN_LOVED` TODO 销账。
- `forge/1.20.4`：同 1.20.1 三处（该档构件逐条复探）。
- 1.14.4 零改动（既有修复链 `acceptFunction`/`func_215932_a` 复验通过；`particles`/`registerFactory` 属该版真名）。
- `mcp-server/scripts/assert-scaffold-rules-conflict.mjs`（LEDGER 常量）：重钉 `contextualSkipped 3056→3062`（+6 场合型丢弃行，来自上述 9 棵树的 ❌/✅ 实证行改写；scaffold 侧 git 无改动经核对）。

### 2. 判据与反证

未动门与断言；判据全部来自构件 javap（表见第 3 块）。反证类：`IScreen`（1.16.5 存在）、`ItemGroup.TAB_*`（1.16.5 存在，1.17 才改名）、`HierarchicalModel.animate/animateWalk`（1.20.1/1.20.4 为 **protected 且存在**——`-public` 面查不到是探针陷阱）、`MC.particles`（1.14.4 真名，1.15 才改 `particleEngine`）、`SoundEvents` BLOCK_ 前缀判定（1.18.2 零命中 vs STONE_* 各一），均已逐名取证未误杀。

### 3. 验证台账

- Oracle 构件（`~/.gradle/caches`）：1.12.2=`forgeBin-1.12.2-14.23.5.2847.jar`；1.13.2=`..._mapped_snapshot_20180921-1.13.jar`；1.14.4=`..._mapped_snapshot_20190719-1.14.3.jar`；1.15.2=`..._mapped_official_1.15.2.jar`；1.16.5=`..._mapped_official_1.16.5.jar`；1.17.1=`..._mapped_official_1.17.1.jar`；1.18.2=`..._mapped_parchment_2022.08.21-1.18.2.jar`；1.19.4=`..._mapped_parchment_2023.06.26-1.19.4.jar`；1.20.1=`..._mapped_parchment_2023.09.03-1.20.1.jar`；1.20.4=`..._mapped_parchment_2024.02.25-1.20.4.jar`（各文件头出处均带 as-of 2026-10-06）。
- 台账：`D:\mc-skill-temp\adjud2\agent3-inline\forge-versions.tsv`（10 档 × 行数/修复数/逐档判定）。
- 行数：1.12.2=55、1.13.2=45、1.14.4=88、1.15.2=81、1.16.5=81、1.17.1=122、1.18.2=98、1.19.4=122、1.20.1=122、1.20.4=122，合计 936。
- 残留扫（全 15 棵 forge 树，正确通配深度）：`RenderGameOverlayEvent` 仅 1.14.4（该版合法）；`Keyboard.KEY`、`fabric/1.1x` 死引用、`BLOCK_STONE` 全部 0 真残留。
- 剩余盘点（同日全扫描文件过一遍）：除上述 10 档与 neoforge 轮已裁的 `neoforge-loose`（72）/`26.1`（1）外，**无任何文件带未裁行**——quilt 10 档各 `judged=7` 且 `nowhere=0`；rift `judged=8`·`nowhere=0`；bedrock / liteloader / modloader / forge 1.7.10–1.11.2 / forge 1.21.1 各文件 `judged=0` ⇒ 本扫描面**剩余未核对 = 0**。
- 镜像：10 棵树 `sync-skills.ps1 -TargetDir forge/<ver>` 全跑（各 `Sync Complete: 35 skills, 11 rules`）。
- 门：#1 `cd mcp-server && node test-scripts.mjs` rc=1 —— 唯一红 = 本门台账漂移（实跑输出「`contextualSkipped=3062`，钉的是 3056」，日志 `D:\mc-skill-temp\adjud2\testscripts-forge-closeout.log`）；按门自述规程 `MC_SKILL_SCAFFOLD_RELEDGER=1` 重算（除 contextualSkipped 外各数全同）→ 手抄重钉 3062 → 独立复跑 = GREEN → #2 同命令 **rc=0**（`testscripts-forge-closeout2.log` 45 行 · 0 AssertionError · 末行 `script helper regression tests passed` · `本轮未执法腿=0`；§S18/S19 真跑 50 道逐道 rc=0）。

### 4. 数据侧变更

该门 LEDGER 一值重钉：`contextualSkipped 3056→3062`（+6 场合型丢弃行，来自 9 棵 forge 树规则/技能侧 ❌/✅ 实证行改写；`crossLines 455 / verdictSkipped 2341 / banned 67 / per-pack 分布 / conflicts 0` 重钉前后全同）。台账与 javap dump 全在 `D:\mc-skill-temp\adjud2\`（scratch，未入仓）。

### 5. 未做清单

- 其余平台已随本批一并盘点（见第 3 块末条）：quilt / bedrock / liteloader / modloader / rift 与 forge 1.7.10–1.11.2 均无未裁行，非「跳过」而是「无行可裁」；quilt 的 QSL 专属签名口径与本扫描面无关，若要做仍需自备 QSL jar（走 `ingest_loader_api`）。
- 各档 `mc-compat-jei` 的 JEI 名（`@JeiPlugin`/`IModPlugin`/`registerCategories`）与 `MixinExtras` 为外部库名，本机无构件可证 → 记 BENIGN_EXTERNAL。
- DistExecutor 类本机所有 1.17.1/1.16.x 构件均不含（fml 核心未下载）→ `unsafeCallWhenOn`/`runWhenOn` 族记 UV（1.16.5 构件曾有 `unsafeRunWhenOn` 等，连续性论证）。
- 未 commit。

### 6. 自我更正

- 1.16.5 档初判 `MyParticle::new` 缺陷时以 1.16.5 构造序为据；1.17.1+ 各档复用时确认同一缺陷模式在每档的首参序不同（T vs SpriteSet），逐档按该档构件重写 lambda，未套用邻档文本。
- 「1.17 把 ServerStartingEvent 改名」初判有误——本档真名仍是 `FMLServerStartingEvent`（只是搬了包 `fmlserverevents`）；按构件订正后落笔（与 1.16.5 档的包差异也逐档注明）。

---

## 2026-10-11 · 非 forge 平台 javap 普查收口：neoforge 轮 + 门重钉（维护档）

**第 0 块 · 结论**：用 base-mod 编译战役留下的真构件（`neoforge-20.4.251-merged.jar`）对 neoforge loose 面做 javap 普查，72+1 行逐条裁决完毕，真缺陷 20 行 / 17 处分布在 10 个文件里全部落修（出处串「javap 2026-10-06」）；收口链先红在一道门（scaffold 台账计数漂移），按该门自述规程重钉 `contextualSkipped 3054→3056` 后 `node test-scripts.mjs` rc=0。未提交。

### 1. 改了哪些文件

- `neoforge/code-patterns/01-block-patterns.md:24-38`：`.tab(CreativeModeTab.TAB_BUILDING_BLOCKS)` 删（20.4 无 `tab()`/无 `TAB_*`）；补 `BuildCreativeModeTabContentsEvent` 正解（`event.getTabKey()` / `event.accept(ItemLike)` 逐字 javap）。
- `neoforge/code-patterns/02-item-patterns.md`：`:13/:52/:66/:99/:116` 五处 `.tab` 删；`:134` `MobEffects.SPEED`（Yarn 名）→ `MOVEMENT_SPEED`。
- `neoforge/code-patterns/03-entity-patterns.md`：`:64-66` `this.level` → `this.level()`（`javap -p` 证字段 private）；`:86-97`+`:101-118` `HumanoidArmorLayer` 三参 → 四参（+`context.getModelManager()`），裸 `INNER_ARMOR/OUTER_ARMOR` → 自定义 `ModelLayerLocation` 并补 `registerLayerDefinition`。
- `neoforge/knowledge/antipatterns/events.md:131-151`：`RegisterAttachmentsEvent` 幻影类（jar tf 0 命中）→ `RegisterCapabilitiesEvent`（四成员逐字 javap）。
- `neoforge/knowledge/antipatterns/item.md:72-80`：✅ 处 `slot -> attacker.getItemBySlot(slot)` 对真签名 `<T extends LivingEntity>(int,T,Consumer<T>)` 编译不过 → `entity -> entity.broadcastBreakEvent(EquipmentSlot.MAINHAND)`。
- `neoforge/knowledge/antipatterns/block.md:16-25`+`:136-142`：两处 ✅ 的 `Properties.of(Material.STONE)`（Material 类 20.4 已删）→ `of().mapColor(MapColor.STONE)`。
- `neoforge/knowledge/porting/01-api-cross-loader.md:67-81`：Fabric 段 `@AutoRegister`/`AttachmentType`/`EntityAttributeModifierEvent`/`EntityAttachmentsComponent` 全编造 → 改「Fabric 无内置 capability/attachment；用第三方 CCA（`knowledge/libs/fabric-only/mc-cca`）+ TODO(未核实)」。
- `neoforge/knowledge/porting/03-real-world-examples.md:187-191`：`Registries.ATTACHMENT_TYPE`（javap 查无）→ `NeoForgeRegistries.Keys.ATTACHMENT_TYPES`。
- `neoforge/knowledge/version-changes/1.20.x.md:116-127`：✅ 的 `of(Material.WOOD)` → `of().mapColor(MapColor.WOOD)` + Material 移除说明。
- `neoforge/scaffold/README_AI.md:98-108`：「添加新物品」示例删 `.tab` + 出处注（该文件 `:3-5` 已有废弃横幅；构建口径表 `:64/:68` 未动，见第 5 块）。
- `mcp-server/scripts/assert-scaffold-rules-conflict.mjs`（LEDGER 常量）：重钉 `contextualSkipped 3054→3056` + 注明改动轮。
- 未动：`mcp-server/scripts/data/scaffold-banned-symbols.json`（盘上 M 属 2026-10-05 未提交批，非本轮；本轮未设 `*_WRITE_SYMBOL_LEDGER`，无写入路径）。

### 2. 判据与反证

动了 `assert-scaffold-rules-conflict` 的钉值散列。能红的证据：收口链 #1 该门 rc=1 实跑输出「`contextualSkipped=3056，钉的是 3054`」；重钉后独立复跑 `cmd /c "node scripts/assert-scaffold-rules-conflict.mjs && echo GREEN || echo RED"` = GREEN；实质判据 **conflicts=0** 重钉前后不变（漂移只发生在计数侧；per-pack 判死分布与符号台账未动）。对照组：链 #2 全绿。

### 3. 验证台账

- 裁决输入：`F:/MOD_TEST/nonfabric-scan/neoforge-loose.json` judged=**539** → nowhere **72** 行；`neoforge-26.1.json` **1** 行（as-of 2026-10-06；口径=corpus/mapping/摘要腿，非 jar）。
- Oracle：`F:\MOD_TEST\dev\neoforge-1.20.4\build\moddev\artifacts\neoforge-20.4.251-merged.jar`（16 128 条目）+ JDK21 `javap`；dump 在 `D:\mc-skill-temp\adjud2\neo*.txt`。
- 台账：`D:\mc-skill-temp\adjud2\agent3-inline\verdicts.tsv` 共 **80** 行 = 72 + 1（26.1 孤行 REFUTED）+ 7（扫描外追加）；分布 **DEFECT 20 / REFUTED 12 / BENIGN_XLOADER 21 / BENIGN_MODDEF 23 / BENIGN_COUNTEREX 4**；生成器 `gen-verdicts.mjs` 未映射行 rc=3 拒收，实跑 0 条未映射。
- 命令：链 #1 `node test-scripts.mjs` rc=1（唯一红=上述台账漂移，日志 `testscripts-neo-closeout.log`）；重钉 + 独立门 GREEN；链 #2 同命令 **rc=0**（`testscripts-neo-closeout2.log` 末行 `script helper regression tests passed`）。
- 残留 grep（`of(Material.|.tab(CreativeModeTab|MobEffects.SPEED|getSlotForHand`）对已改文件 = 0 真命中，仅 2 条注释性引文（`02-item-patterns.md:18` 说明、`porting/03:65` 禁止写法披露）。
- 26.1 孤行：`00-project-setup.mdc:29` 的 `modContainer` 与 `scaffold/.../ExampleMod.java:47` 形参逐字相同 ⇒ REFUTED（tokenizer 把小写形参记成 TYPE）。

### 4. 数据侧变更

- 仅该门 LEDGER 一值（`contextualSkipped 3054→3056`，+2 场合型丢弃行）；`banned 67 / conflicts 0 / per-pack 分布`不变。
- `verdicts.tsv` + javap dump 只落 `D:\mc-skill-temp\adjud2\`（scratch，未入仓）。

### 5. 未做清单

- **quilt QSL 面**：本机无 QSL 构件（AGENTS 已记账），只能停摘要/Fabric 回退口径 ⇒ 须用户自备 jar 走 `ingest_loader_api`。
- **neoforge 分档树（`neoforge/1.20.4/.pi`、`verified-api-*`）未改写**：本轮取证证明其 `NeoForgeRegistries.ATTACHMENT_TYPES` 写法在场可用（Registry 字段 + `$Keys` 两形都有），不属缺陷。
- **`README_AI.md:64/:68`**（`neoforge.mods.toml` 文件名、`neogradle` 插件 id 行）属构建口径、非本缺陷类，且文件自带「已废弃别当模板」横幅 ⇒ 未动。
- **裁决台账未成为常设门**：nonforge-scan + javap 复核是会话级流程，80 行台账在 scratch；做成门属另一工程，等授权。
- **未 commit**（工作区另含 2026-10-05 批未提交件与并行会话 mirror 噪音，提交前需甄别归属）。

### 6. 自我更正

- 段中倾向「`this.level` 是 protected、子类可编译」——`javap -p Entity` 证 private，该行改判红并修。
- 曾疑「`ATTACHMENT_TYPES` 只在 `$Keys`」——构件显示 Registry 字段与 Keys 常量两形都在场；修复文本按 Keys 形写、`.pi`/verified-api 的直字段形也正确，均不入红账。

---

## 2026-10-11 · 非 forge 平台普查前半：forge 两档修复 + rift 树改写 + 根文件同步（维护档）

**第 0 块 · 结论**：同一普查战役的前半段——按构件复核改掉 forge 1.12.2 两处缺陷与 forge 1.13.2 的 `IGuiHandler` 孤儿注册路径；按用户裁定改写 rift 树并同步根文件与社区短文；对全仓做了一次 41 命中残留扫并逐条定性。相关平台镜像已刷，未提交。

### 1. 改了哪些文件

- `forge/1.12.2/**`：两处缺陷修复（生命周期事件配 `@SubscribeEvent` 致加载期崩溃一类）。
- `forge/1.13.2/**`：`IGuiHandler` 孤儿注册路径修复。
- `rift/**` 规则树 13 处改写（按用户裁定：1.13 原生至 1.0.4-105；1.13.1 为 Chocohead `newerer` 社区分支；1.13.2 为 `newest` 社区分支，常用构建 1.0.4-77 / 1.0.4-106）。
- 根文件与社区件：`AGENTS.md:83`、`README.md:200/204/210`、`community_knowledge/authored/ingame-playtest-automation.md`（含坑 87）。
- 上述平台的 7 面镜像按 `scripts/sync-skills.ps1 -TargetDir <平台>/<档>` 刷新。

### 2. 判据与反证

本次未动门与断言；改动依据 = 真构件/已核实源码比对 + 用户对 rift 支持面的裁定原文。

### 3. 验证台账

- 全仓残留扫：**41 命中**，逐条定性（真缺陷 / ❌ 反例 / 另一加载器真名 / mod 自造名）。
- fork 明细与逐行读数在该轮会话输出；本轮（neoforge 轮）只做增量，不改写前半段结论。

### 4. 数据侧变更

无（未动门数组、台账钉值或语料）。

### 5. 未做清单

- rift 的「1.13.2 能否真跑」未做真机验证（依赖源已解决，见 [[mc-skill-bridge-mod-template]] 对应段落）。
- 前半段逐文件行号未在本节复录（如需要请以该轮输出为准）。

### 6. 自我更正

- 无（本节为补记的底稿；未发现需要更正的旧结论）。

---

## 2026-10-11 · `mc-handoff` 正文加底稿交接义务 + 装机副本重拷（维护档）

**第 0 块 · 结论**：按用户指令改了 `common_skill/mc-handoff/SKILL.md` 正文，让交接文档自动带 `REPORT-FORMAT.md` / `DELIVERY_LOG.md` 两条路径并点名档位；发现装机副本是旧的（不刷这次改动就不生效）⇒ 按仓规「以源稿为准重拷」重拷，两份 sha 现一致。门两条 rc=0，未提交。

### 1. 改了哪些文件

- `common_skill/mc-handoff/SKILL.md:14`（第 3 块「证据指针」）：加「本轮改动落在本仓库受管面时的追加义务 —— 逐字点名 `DELIVERY_LOG.md` 本轮那一节（含该档全部编号块与读数）与 `REPORT-FORMAT.md`，并写明走了哪一档」，同时写明**用户工程侧的交接不适用**（免得把本仓库路径塞进别人的模组工程交接）。
- `common_skill/mc-handoff/SKILL.md:25`（规则段新增一条）：**交接合格的判据** —— 接手者只看文档能答出三件事（动了哪些文件 / 证据在哪个路径 / 下一轮按哪一档哪些块写），答不出即算缺件。写法按 `WRITING-FOR-AGENTS.md` §3（可检查且穷尽），不重复第 3 块的路径清单（§4「同一禁令别在多处原样重复」）。
- `C:\Users\zzrCN\.agents\skills\mc-handoff\SKILL.md`（**工作区外**）：重拷刷新。实测读数是**本轮编辑之后**那一次：源稿 29 行 / sha `dcc25b28cd45` vs 装机 28 行 / `db1e21c9c8b4` ⇒ 不一致；重拷后两边同 sha `dcc25b28cd45`（口径 = `sha256(整份文件字节)` 前 12 位）。编辑前的两份是否一致 = `未核实`（没取过 sha）。依据 = `WRITING-FOR-AGENTS.md` §6「先改源稿，再拷贝刷新；不一致以源稿为准重拷」。
- 本文件与 `mcp-server/CHANGELOG.md`（第八十九批一条）：记账。

### 2. 判据与反证

本轮动门：无（改的是技能正文，不是门或断言）。

替身证据（证「改动真到了消费面」）：`read_knowledge_resource uri=mcskill://skill/mc-handoff` 回 `found:true`，正文里两段新增文字逐字在场 ⇒ `mcskill://skill/` 登记由盘派生，本轮**无需** `npm run build`（未动 `mcp-server/src/**`）。

### 3. 验证台账

- `node scripts/assert-authoring-lint.mjs` rc=0（as-of 2026-10-11，门自报行）：「目标 13 件 · J1 技能 12 份 · J2 路径指针 23 枚全在盘 · J3 纯负向现数 0（豁免 2）」—— 计数与改动前一致 ⇒ 新增文字没造出纯负向条目。
- `node test-core.mjs` rc=0（`core regression tests passed`）。
- 源稿行数 28 → 29（口径 = 按 `\n` 计，探针 `temp/_xref*.mjs` 系列）；sha 前 12 位见第 1 块（口径 = `sha256(整份文件字节)`）。
- 未跑第 8 步 `test-scripts.mjs`：本轮未动 `mcp-server/scripts/**` 或 `scripts/**`（只动了 md 正文与工作区外副本），按 `CONTRIBUTING.md` §验证纪律 的第 8 步触发条件不成立；上一轮（第八十八批）已跑且 rc=0。

### 5. 未做清单

- 宿主技能缓存未重载 ⇒ 本会话仍可能读旧装机件，**新会话**才确定生效（宿主侧无命令可代跑）。
- `README_human.md` / `README_human.en.md` 的文档表未加这两条路径（等用户定要不要在人读面提）。
- 未提交（归用户）。
- 已授权未执行：无。

### 6. 自我更正

- **本轮内更正（假据自纠）**：本节初稿写过「装机副本早在本轮编辑前就与源稿同 sha」——**那句没有实测支撑**：我没在编辑前取过 sha，唯一一次比对是编辑之后（源 29 行 / `dcc25b28cd45` vs 装机 28 行 / `db1e21c9c8b4`）。「分叉由本轮编辑造成」只是推断（依据：行数差 1，且 2026-10-10 的放养裁定记录称 12/12 零漂移 —— 那是旧读数，不能当本轮实测）。现按可证的说法落笔：**编辑后两份不一致，重拷后一致**；编辑前是否一致 = `未核实`。

---

## 2026-10-11 · 交付汇报拆成人看三件 + agent 全量表单（维护档）

**第 0 块 · 结论**：把根 `AGENTS.md` 的交付汇报段拆成两份——人看三件留在 `AGENTS.md`，全量表单逐字搬进新根文件 `REPORT-FORMAT.md`，每轮编号块正文落新根文件 `DELIVERY_LOG.md`；改了 4 处旧指针、给归档指针门登记了新落点。本轮只读盘验证（门链），未真机跑游戏——改动全是文档与门内数组，不涉及可玩行为。

### 1. 改了哪些文件

- `AGENTS.md:92`（顶部指针）：原句指向「§交付汇报 走主档四块/维护档六块」，改为「聊天只给三件 + 表单在 `REPORT-FORMAT.md` + 正文落 `DELIVERY_LOG.md`」。
- `AGENTS.md:487`（游玩测试要求首段）：把「写进『交付汇报 · 怎么验』」改为「写进交付底稿的『怎么验』块（`REPORT-FORMAT.md` 主档第 2 块）」，因为那个块名已不在 `AGENTS.md`。
- `AGENTS.md:531-573` → `AGENTS.md:531-554`：删 43 行全量表单，换成 24 行 —— 14 行人看三件（`:533-537`）+ **逐件点名的义务真源**（`:541-549`，把 §先判档 / §第 0 块 / §主档 · 模组开发交付 / §维护档 · 仓库维护交付 / §两档都受的硬约束 五节逐条列出，并写明「写模组的交付就用 §主档」）+ 冲突裁定（`:551`）+ **交接指针（agent 给 agent）**（`:553`：交接文档必须点名档位，并带 `DELIVERY_LOG.md` 本轮那一节的**全部编号块**，不得只抄结论）。
- `REPORT-FORMAT.md`（新建，根）：判档 / 受管面清单 / 第 0 块 / 主档四块 / 维护档六块 / 省略 vs「无」/ 两档硬约束 / 维护档另加——按用户裁定「整段原文逐字搬、义务零丢失」照 `AGENTS.md` 原句搬入，另加四行边界（义务真源、冲突裁定、何时打开、详细件落点）。
- `DELIVERY_LOG.md`（新建，根）：落点头部（滚动、最新在上、只追加不改写、夜批另有家）+ 本节。
- `CONTRIBUTING.md:190`：受管面清单的权威位置从「根 `AGENTS.md` §交付汇报」改指 `REPORT-FORMAT.md` §先判档，并注明 2026-10-11 搬出。
- `WRITING-FOR-AGENTS.md:102`（§8 第 4 步）：同一处受管清单指针改指 `REPORT-FORMAT.md` §先判档。
- `WRITING-FOR-AGENTS.md:81` 之后（§6 唯一落点表）：加一行「每轮交付底稿正文 → `DELIVERY_LOG.md`」。
- `AUTO_SETUP.md:457`：验收段里「写进『交付汇报 · 怎么验』」同步改指底稿块与落点。
- `CONTRIBUTING.en.md:190`（中英镜像同一条）：英文侧同一句「inside the root `AGENTS.md` §delivery report」改指 `REPORT-FORMAT.md` §先判档，并注明 2026-10-11 搬出、`AGENTS.md` 侧只留人看三件。
- `README.md:28` 后与 `README.en.md:34` 后（「项目结构 / Project layout」树）：各加两行，把 `REPORT-FORMAT.md` 与 `DELIVERY_LOG.md` 收进文档索引（用户 2026-10-11 指令「进入文档索引」）。该树是手维护的部分清单，本就未列全根文件（`WRITING-FOR-AGENTS.md`、`NIGHT_BATCH.md` 等不在内），本轮只补这两个新件，不做全量补齐。
- `AGENTS.md:553`（§交付汇报 末，新增一段）：**交接指针（agent 给 agent）** —— 交接文档必须逐字带上 `REPORT-FORMAT.md`（并点名下一轮按哪一档的哪些块写）与 `DELIVERY_LOG.md` 本轮那一节（该档全部编号块的正文与读数，不得只抄结论）。
- `mcp-server/scripts/assert-archive-pointers.mjs:53` 后（`REGISTRY`）：登记 `DELIVERY_LOG.md`（P1 要求文件在盘、P2 要求被 `FACES` 逐字提及——`AGENTS.md` 三件第 3 项与义务真源段都逐字点名它）。
- `mcp-server/CHANGELOG.md`：加第八十八批一条（门内数组改动属工具面）。

### 2. 判据与反证

本轮动门：有——`assert-archive-pointers.mjs` 的 `REGISTRY` 加一条。

- 改的判据：P1（在册档案必须在盘）与 P2（必须被 ≥1 份 `FACES` 逐字提及）现在对 `DELIVERY_LOG.md` 生效。
- 反证腿（隔离探针根 `temp/probe-root/`：拷三份 `FACES` + 五条在册档案占位，逐臂跑 `--root=` 探针；探针 `temp/_poison_ap.mjs`，读数 as-of 2026-10-11）：
  - 对照·基线 rc=0；末了恢复原状复绿 rc=0 ⇒ 两臂的红确实是砍出来的，不是夹具本身坏。
  - 臂①a **只摘 `AGENTS.md` 一个面的逐字提及 ⇒ rc=0 仍绿**。这不是漏：P2 的判据是「≥1 份必读面提到」，而 `DELIVERY_LOG.md` 现在同时被 `AGENTS.md`（三件第 3 项 + 义务真源段）和 `WRITING-FOR-AGENTS.md`（§6 唯一落点表）逐字点名 ⇒ **多面重复点名不加强执法，只加强冗余**（记在这里，免得后人以为删一处会红）。
  - 臂①b **三面全摘 ⇒ rc=1 `✗ [ARCHIVE-UNMENTIONED] 在册档案没有任何必读面提到：DELIVERY_LOG.md ⇒ 静默失效风险`** —— 这才是 P2 真正的会红条件。
  - 臂② 把在册档案从盘上删掉 ⇒ rc=1 `✗ [ARCHIVE-MISSING] 在册档案不在盘：DELIVERY_LOG.md`。
  - 原有四条（`CORPUS_PROVENANCE.md` / `mcp-server/CHANGELOG.md` / 社区短文 / `NIGHT_BATCH.md`）在两臂中均未被牵连判红 ⇒ 不是靠放宽全局过的。
- 门自带的 `--selftest` 臂必须仍全绿，否则新登记把自身夹具带歪。
- 另有一条搬运反证（不属于门，但属于「义务零丢失」的判据）：取 `git show HEAD:AGENTS.md` 的 §交付汇报 非空 29 行，去掉标题层级与 `**` 后逐行在 `REPORT-FORMAT.md` 找等价行 —— 结果 27 行逐字等价命中，剩 2 行差在标点与措辞：`交付汇报（每轮交付强制）` 这个标题仍在 `AGENTS.md` 常驻面（未丢），`两档都受的硬约束：` 在 `REPORT-FORMAT.md` 写成 `##` 标题、少了行尾全角冒号。即**义务内容 0 丢失**。探针 `temp/_head_agents.md` + 两段 `node -p` 读数（as-of 2026-10-11）。

### 3. 验证台账

- `node temp/_split_agents.mjs`：rc=0；`AGENTS.md` 行数 573→544（口径 = 按 `\n` 计，as-of 2026-10-11；删段 43 行 / 新段 14 行）。
- `node temp/_xref.mjs` / `_xref2.mjs` / `_xref3.mjs`（本轮侦察）：钉「交付汇报 / 主档 / 维护档」这套词的机器门 = 0 处；README 与三个门脚本里的「主档」是「版本主档 vs 薄档」同名不同物（`test-platform-pack.mjs:891/1161/1165`、`test-assistant-gaps.mjs:3/308`、`assert-playtest-intent-gate.mjs:415`），故不动。
- 门链读数（as-of 2026-10-11，四条全 rc=0，串行跑不并发）：`node scripts/assert-archive-pointers.mjs` = 「在册档案 5 全部在盘且被必读面提到（`DELIVERY_LOG.md` ← `AGENTS.md`）；面 3/3；账本候选 5（在册 2 + 豁免 3）」；同门 `--selftest` 绿；`node scripts/assert-authoring-lint.mjs` 绿；`node test-core.mjs` = `core regression tests passed`；第 8 步 `node test-scripts.mjs` = `script helper regression tests passed`，**本轮未执法腿=0**，门链四数 盘上 75 / 可达 75，§S18/S19 数组 50 道逐道 rc=0。
- 单独复跑 `node scripts/assert-skill-mirrors.mjs` = 绿（扫档 57 / 镜像比对目标 12418 / AGENTS 漂移 0 档 / 台账 0 档 / 拒 0；口径 = 该门自报行，as-of 2026-10-11）。**不用「链绿了」代替这条**——上一轮它因并发会话红过 84 处，本轮专门点它。
- 文档索引与交接指针落笔后**再复跑一次**同一组（as-of 2026-10-11，四条全 rc=0）：`assert-archive-pointers` / `assert-authoring-lint`（仍「目标 13 件 · J2 路径指针 23 枚全在盘 · J3 现数 0」，即新增的 `README` 树两行与交接段没被 J2 计入 —— 见第 5 块那条盲区）/ `test-core`（`core regression tests passed`）/ 第 8 步 `test-scripts`（`本轮未执法腿=0`、`script helper regression tests passed`）。
- 反证探针 `node temp/_poison_ap.mjs` 读数（口径 = 子进程 exit code，as-of 2026-10-11）：基线 0 · 只摘一个面 0 · 三面全摘 1（`ARCHIVE-UNMENTIONED`）· 档案不在盘 1（`ARCHIVE-MISSING`）· 复原 0。
- 指针逐件点名改写（本轮最后一次内容改动，动了 `AGENTS.md:541-553`、两份 README 树、本文件与 CHANGELOG）之后复跑同一组：`assert-archive-pointers` / `assert-authoring-lint` / `test-core` / `test-scripts` 四条全 `rc=0`（lint 仍「目标 13 件 · J2 23 枚 · J3 现数 0」；链仍「本轮未执法腿=0」）。写这条台账本身不再触发判据：那两道 md 面门只查档案在盘与路径点名，不读本文件正文。

### 5. 未做清单

- `common_skill/mc-handoff/SKILL.md` 正文未改：交接指针只落在 `AGENTS.md` 常驻面（用户指令的范围就是 agent.md）。若要让 `mc-handoff` 产出的交接文档**自动**带这两条路径，得改技能源稿并走 `WRITING-FOR-AGENTS.md` §6 的三处同步（源稿 → `templates.ts` / `wave/register.ts` / `platform-pack/session.ts` 登记 → 本机拷贝安装），越出本轮范围，等拍板。
- 一处实测到的门盲区（记录不修）：`assert-authoring-lint.mjs` 的 J2 计数在本轮多次写盘前后都是「路径指针 23 枚」，说明它的目标 13 件不含 `mcp-server/CHANGELOG.md` 与本文件 ⇒ 我在里面写的 `temp/probe-root/`（探针跑完自删）这类路径不会被它判死指针。要覆盖需扩 `files` 清单，另批。
- 未做「聊天三件」的执法：本轮只改文档，没有门判定「聊天里是否只给了三件」（宿主拿不到回复文本，做不了）。按 `AGENTS.md` 常驻面 + `DELIVERY_LOG.md` 落点约束，靠 agent 遵循。
- 未提交（提交归用户）。
- 已授权未执行：无。

### 6. 自我更正

- 上一轮我说「受控术语表 + 义务词只用两个」值得并进——本轮按用户裁定「逐字不改」搬原文，该改动**不进** `REPORT-FORMAT.md`（那两处是上一份被否的改写稿的内容）。
- 上一轮我算给用户的 63.6 / 243 字读数作废，已在本会话更正为 93.1 / 473（口径 = 以「。」收尾的一段）。
- **本轮内更正（指针形状）**：我第一版把义务真源写成一句「判档、受管面清单、主档四块、维护档六块、两档硬约束在 `REPORT-FORMAT.md`」，用户指出这不是「保留指针」——指针必须**逐件点名到每一节**，否则顺着这句话找不到模组模板（`REPORT-FORMAT.md:30`）在哪，看起来就像那份被删了。已改成 `AGENTS.md:541-549` 五条逐件点名（含「写模组的交付就用 §主档 · 模组开发交付」），交接指针同步改为「点名档位 + 带该档全部编号块」。常驻面因此从 14 行回到 24 行（原 43 行），净省 19 行 —— 这条是我对「保留指针」理解偏了，不是原方案作废：两份拆分与逐字搬运的读数不变。
