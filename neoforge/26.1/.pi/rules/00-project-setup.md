---
description: 00 — 项目结构（NeoForge 26.1）
---

# 00 — 项目结构（NeoForge 26.1）

来源：https://docs.neoforged.net/docs/gettingstarted/ 与官方 MDK（26.1.1/26.1.2 均同时提供 ModDevGradle 与 NeoGradle，必须传 buildPlugin。不为 26.1.1 单造规则树。）。不要用 ForgeGradle / Yarn 冒充。

## 构建插件

官方模组生成器对多个 MC 版本**同时**提供 ModDevGradle（`net.neoforged.moddev`）与 NeoGradle（`net.neoforged.gradle.userdev`）。**禁止按版本硬绑**。从零工程调用 `download_official_mdk` 时必须传 `buildPlugin`。

版本锚点（26.1 线）：`neo_version` **以 maven 26.1 线最新为准**（示例曾见 `26.1.0.19-beta`，会过期）。官方 README 写 Gradle **8.8+**，wrapper 常见 **8.14.x**（不要把「≥9.1」当硬门）。ModDevGradle / NeoGradle 版本以 `download_official_mdk` 实际产物的 `gradle.properties` 为准。

入库官方页原文可能残留 `minecraft_version=1.20.6` / `neo_version=20.6.62`，**禁止照抄**。

**Parchment：本版无需配置。** 26.1 的 MDG 与 NeoGradle 双 MDK 均无 parchment 键——游戏 jar 已去混淆（Mojang 名），不要自行添加 parchment 依赖或 mappings 块。

## Java / mappings

- Java **25**
- mojmap-unobfuscated（游戏 jar 已是 Mojang 名）
- 26.1 去混淆 + Identifier。禁止 Yarn。query_api 无本版索引。

## 入口

```java
@Mod(ExampleMod.MODID)
public class ExampleMod {
    public static final String MODID = "examplemod";
    public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(MODID);
    public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(MODID);
    public ExampleMod(IEventBus modEventBus, ModContainer modContainer) {
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);
    }
}
```

官方 MDK-26.1.2-ModDevGradle @ 1fd0f4d9… 使用 ModContainer.registerConfig，不再用 ModLoadingContext.get()。

元数据：neoforge.mods.toml。modId 全小写、无 `-`。

## 禁止

- `NeoForgeAddonPlugin`、`getBootstrapContext().getEventBus`
- 用 Forge `mods.toml` + `net.minecraftforge` 包当 NeoForge 26.1
- 把邻版 MDK zip 当本版
- 官方 MDK 404 / 无 pin 时返回 MDK_NOT_PINNED，禁止邻版 MDK
