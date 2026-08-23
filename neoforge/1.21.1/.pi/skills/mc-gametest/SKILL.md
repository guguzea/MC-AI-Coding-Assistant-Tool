---
name: mc-gametest
description: NeoForge 1.21.1 mc-gametest。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.1"
dependencies: []
mappings: mojmap
---

# mc-gametest（NeoForge 1.21.1）

> 本档为**主档 neoforge 根下的子档**；差异以本档 `search_neoforge_docs`（platform=neoforge, version=1.21.1）为准。**1.21.1 树（data/neoforge_1.21.1）没有 GameTest 独立文档页**：以下为机制路线 + Forge 1.20.1 语义基线（页 id `misc_gametest`），NeoForge 侧类/事件/属性名一律**先复核**，核不到不输出签名。禁止从扁平 neoforge/.agents/skills 或邻档复制旧 API。

## 入口（机制路线 + Forge 语义基线）

1. **写方法**：`@GameTest` 标注，`public static void`，入参 `GameTestHelper`（无返回值、非静态不被识别——Forge 1.20.1 已核实）。
2. **登记类**：`@GameTestHolder(MODID)`（value 必须是 mod id）或 `RegisterGameTestsEvent`（mod event bus）——NeoForge 侧注解/事件包名以 `search_neoforge_docs` 复核。
3. **准备模板**：`.nbt` 放 `data/<modid>/structures/`；结构方块保存场景；`/test pos` 导出相对坐标（命令细节以复核为准）。
4. **运行**：游戏内 `/test run <name>`；批量 `gradlew runGameTestServer`（Forge 名；NeoForge 的 run 配置属性名——如 `enabledGameTestNamespaces` 的加载器前缀——**未在本档核实，不要照抄 `forge.` 前缀**）。

## 语义基线（Forge 1.20.1 `misc_gametest`；NeoForge 沿用与否以复核为准）

- 测试类三件套：`@GameTestHolder(MODID)` + `@GameTest` + 方法体；模板名缺省 = 类名小写 + 方法名。
- 成功态：`succeed` / `succeedIf` / `succeedWhen` / `succeedOnTickWhen`；调度：`runAtTickTime` / `runAfterDelay` / `onEachTick`。
- 动态生成：`@GameTestGenerator`（无参、返回 `Collection<TestFunction>`）；批次：`@BeforeBatch` / `@AfterBatch`（`batch` 字符串一致；方法是 `Consumer<ServerLevel>`）。
- 模板回退：`GameTest#templateNamespace` → `GameTestHolder#value` → `minecraft`；`@PrefixGameTestTemplate(false)` 关前缀。

## 本档差异与边界

- Java 21、`ResourceLocation`、mojmap；GameTest 在 NeoForge 仍是 vanilla 体系 + 加载器登记，但**登记事件、run 配置名以本档 `search_neoforge_docs` 为准**，不照搬 Forge。
- Forge 专属 run 配置（`forge.enabledGameTestNamespaces` / `forge.enableGameTest`）不照搬；写进本档前必须先核实。
- 主档同题 skill 为语义基线的展开版（Forge 1.20.1 核实表 + 常见错误清单）。

## 官网链接

- 文档根：https://docs.neoforged.net/docs/1.21.1/ ；检索：`search_neoforge_docs`（platform=neoforge, version=1.21.1）。
- Forge 语义基线页：https://docs.minecraftforge.net/en/1.20.1/misc/gametest/
