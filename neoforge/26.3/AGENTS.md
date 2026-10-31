# NeoForge 26.3 — 11 条齐（证据 = 官方 MDK + sources jar）

> 本档 `00–10` **11 条齐**，但**证据是官方 MDK 模板 + NeoForge 26.3.0.99 sources jar**，不是 docs 正文（上游 `/docs/26.3/` 仍 404，`version_labels.json` 的 `current.label="26.1"`，仓库全树 898 文件 0 个 `26.x`）。
> 每条规则头部都标了证据类型；未核处逐条写在文内（04 的实体属性事件签名、06 的挂载方式、07 的 `DataGenerator` 方法名、10 的自定义 Screen）。**禁止**把 26.1 的 01–10 当 26.3，也**禁止**把这些当官方文档结论抄给用户。

## 事实面（2026-10-31 实测）

| 项 | 值 |
|---|---|
| 构件 | `net.neoforged:neoforge:26.3.0.99`（maven `releases`；26.3.0.76 起脱离 `-beta`） |
| 官方 MDK | `MDK-26.3-ModDevGradle@f31f90e7`、`MDK-26.3-NeoGradle@8c9049d0`（`mcp-server/data/mdk-checksums.json` 已 pin，含 archive sha256） |
| 主文档 | **无**（`/docs/26.3/` 404；`current.label="26.1"`） |
| primer | `data/neoforge_primers/26.3.md`（26.2→26.3，只讲 vanilla 类改动） |
| 本机验证 | pinned MDK 归档 `gradle build --no-daemon` → **BUILD SUCCESSFUL in 24s**（Gradle 9.8.1 + JDK 25） |
| 工具链 | Java 25 · Gradle wrapper 9.2.1 · MDG 2.0.148 / NeoGradle userdev 7.1.39 · `neo_version=26.3.0.99` |

## 规则里的 Java 调用已真编译验证（2026-10-31）

把 04/06/07/10 的调用原样写进官方 MDK 工程（`MDK-26.3-ModDevGradle@f31f90e7`）的 `probe/Probe.java`，`gradle compileJava` → **BUILD SUCCESSFUL in 5s**（Gradle 9.8.1 + JDK 25）。覆盖：`registerEntityType(Pig::new, …)`、`EntityAttributeCreationEvent.put`、`registrar("1").optional()`、`GatherDataEvent.addProvider`、`Screen#extractRenderState(GuiGraphicsExtractor, …)`、`gui.setScreen` / `setScreenAndShow`。

## 配置 / 工作流

同根纲：`mc-config` 走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`，本档不新写。
`get_workflow_template` 只在完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布）时调；改已有代码走 00 + `search_neoforge_docs`。
