---
description: 00 — 项目结构（NeoForge 26.1）
---

# 00 — 项目结构（NeoForge 26.1）

来源：https://docs.neoforged.net/docs/gettingstarted/ 与官方 MDK（26.1.1/26.1.2 均同时提供 ModDevGradle 与 NeoGradle，必须传 buildPlugin。不为 26.1.1 单造规则树。）。不要用 ForgeGradle / Yarn 冒充。

## 构建插件

官方模组生成器对多个 MC 版本**同时**提供 ModDevGradle（`net.neoforged.moddev`）与 NeoGradle（`net.neoforged.gradle.userdev`）。**禁止按版本硬绑**。从零工程调用 `download_official_mdk` 时必须传 `buildPlugin`。

版本锚点（26.1 线）：`neo_version` **以 maven 26.1 线最新为准**，本文件**不钉具体构建号**。取数法：实读 `maven.neoforged.net/releases/net/neoforged/neoforge/maven-metadata.xml`，记下**你的读取日期**与该文件的 `lastUpdated`，再在其 `<version>` 列表里按 `26.1` 前缀自行取最大者；该读数按周浮动，每次开工重读，且 `download_official_mdk` 的 pin 表优先。取数陷阱：该文件的 `<release>` 标签指向**当前 promoted 线，可能不是 26.1**，**不要**拿它当 26.1 线最新版。Gradle / wrapper 版本以 `download_official_mdk` 实际产物（`gradle.properties` + `gradle/wrapper/gradle-wrapper.properties`）为准，不要把任何 Gradle 小版本当硬门。ModDevGradle / NeoGradle 版本同上，取自实际产物的 `gradle.properties`。本句复核日期 **2026-09-13**（此前的 2026-09-02 读数与本规则内的具体构建号已移除）。

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
