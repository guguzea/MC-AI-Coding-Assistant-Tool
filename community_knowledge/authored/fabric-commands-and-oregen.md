---
id: authored/fabric-commands-and-oregen
title: Fabric 命令注册与矿物生成（FAPI 写法）
tags: [fabric, commands, CommandRegistrationCallback, BiomeModifications, worldgen, oregen, datagen]
summary: Fabric 侧与 Forge 系的差异点：CommandRegistrationCallback.EVENT 三参数注册；BiomeModifications.addFeature + BiomeSelectors 挂矿/树；ConfiguredFeature/PlacedFeature bootstrap 与 datagen（FabricDynamicRegistryProvider / DataGeneratorEntrypoint）。
mcHint: Fabric API 0.9x+/1.20+；文档核对于当前版
sourceKind: authored
---

# Fabric 命令注册与矿物生成

自写短文。依据 Fabric 官方文档 `commands/basics` 与 `data-generation/features` 原文（已核对）；命令树/摆放修饰器通用细节见 `authored/custom-commands-brigadier` 与 `authored/ore-generation-worldgen`，本篇只讲 **Fabric 差异**。

## 命令：CommandRegistrationCallback

Fabric 没有 RegisterCommandsEvent，用 FAPI 回调，在 `ModInitializer#onInitialize` 里注册：

```java
CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> {
    dispatcher.register(Commands.literal("test_command").executes(context -> {
        context.getSource().sendSuccess(() -> Component.literal("Called /test_command."), false);
        return 1;   // 或 Command.SINGLE_SUCCESS
    }));
});
```

- 三参数：`CommandDispatcher<CommandSourceStack>`、`CommandBuildContext registryAccess`（**参数类型敏感的 ArgumentType 要传它**）、`Commands.CommandSelection environment`（用 `environment.includeDedicated` 区分专用服是否注册）。
- 返回码语义、requires 权限、suggests 补全、`ClientCommandRegistrationCallback`（客户端命令配 `ClientCommands.literal()`）——通用 Brigadier 规则同 NeoForge/Forge，见命令总篇。
- 报错惯例是抛 `CommandSyntaxException` 让 Brigadier 处理，而不是返回 false。

## 矿物生成：三层不变，入口不同

CF/PF 的 bootstrap 写法与 NeoForge 完全一致（`BootstrapContext<ConfiguredFeature<?,?>>`、`TagMatchTest(BlockTags.STONE_ORE_REPLACEABLES)`、`OreConfiguration.target(...)`、`HeightRangePlacement.triangle(...)`），差异在**怎么挂进群系和怎么 datagen**：

### 挂群系：BiomeModifications（替代 BiomeModifier）

```java
BiomeModifications.addFeature(
    BiomeSelectors.foundInOverworld(),                    // 或 .tag(BiomeTags.IS_FOREST)
    GenerationStep.Decoration.UNDERGROUND_ORES,           // 树用 VEGETAL_DECORATION
    ModWorldGen.DIAMOND_ORE_PLACED_KEY);
```

- 这是 **运行时代码**（放 onInitialize），不是 JSON —— 没有 neoforge/biome_modifier JSON。
- `BiomeSelectors` 还有 `foundInTheNether/theEnd`、`excludeByKey` 等。

### Datagen 入口（1.21.x+）

- `DataGeneratorEntrypoint#buildRegistry(registryBuilder)` 里 `registryBuilder.add(Registries.CONFIGURED_FEATURE, MyWorldGen::configure)` 注册 bootstrap 方法；
- Provider 继承 **`FabricDynamicRegistryProvider`**，在 `configure(ExportableProvider registries)` 里把 CF/PF 条目拷进输出；
- `PackEmitters`/`onInitializeDataGenerator` 中 `pack.addProvider(MyWorldgenProvider::new)` 挂上。
- 产出仍是标准 `worldgen/configured_feature/*.json`、`placed_feature/*.json`（数据包格式，任何平台通用）。

### 手写 JSON 路线（不用 datagen）

直接把 CF/PF JSON 放进 `src/main/resources/data/<modid>/worldgen/...` 也合法——JSON 结构见 `authored/ore-generation-worldgen` 的样例。小 mod 常这么干。

## 反模式

- ❌ 把 NeoForge 的 biome_modifier JSON / `AddFeaturesBiomeModifier` 抄进 Fabric 工程。
- ❌ 忘记 `BiomeFilter.biome()`（CF/PF 层面）或选错 Decoration step。
- ❌ 用 Yarn 工程却抄 Mojmap 名（或反之）：先确认工程 mappings 再落名。

## 自检

- 新世界挖到矿（旧区块不回填）；森林限定矿只出现在森林。
- `/test_command` 单人 + 专用服都能跑；专用服不注册客户端命令。

## 不清楚时

- 命令原文：https://docs.fabricmc.net/develop/commands/basics
- Feature 原文：https://docs.fabricmc.net/develop/data-generation/features （版本下拉切到工程版本）
- API：`search_fabric_docs`
