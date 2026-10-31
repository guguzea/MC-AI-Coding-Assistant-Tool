---
description: 00 — 项目结构（NeoForge 26.3）
---

# 00 — 项目结构（NeoForge 26.3）

来源：官方 MDK 实读（`NeoForgeMDKs/MDK-26.3-ModDevGradle@f31f90e7`、`MDK-26.3-NeoGradle@8c9049d0`，2026-10-31）。
**本档 11 条齐（00–10），但证据是官方 MDK + sources jar，不是 docs 正文**：上游主文档 `docs.neoforged.net` 仍只到 26.1（`version_labels.json` 的 `current.label="26.1"`、仓库全树 898 文件 0 个 `26.x`、`/docs/26.3/...` 404）。00 取自 MDK 的 `gradle.properties` / `build.gradle`；01–10 的同源证据与未核处写在各条内 —— **禁止拿 26.1 的 01–10 顶替**。

## 构建插件（两套 MDK，按需二选一，不要按版本硬绑）

| 插件 | 26.3 MDK 实值 |
|---|---|
| ModDevGradle | `id 'net.neoforged.moddev' version '2.0.148'` |
| NeoGradle | `id 'net.neoforged.gradle.userdev' version '7.1.39'`，依赖写 `implementation "net.neoforged:neoforge:${neo_version}"` |

从零工程调用 `download_official_mdk` 时必须传 `buildPlugin`（`moddevgradle` / `neogradle`）。pin 见 `mcp-server/data/mdk-checksums.json` 的 `neoforge-26.3-*`。

## 版本锚点（MDK-26.3 的 `gradle.properties` 实读）

```
minecraft_version=26.3
minecraft_version_range=[26.3]
neo_version=26.3.0.99
```

- 构件：`net.neoforged:neoforge:26.3.0.99`（maven `releases`；`26.3.0.76` 起脱离 `-beta`）
- Java **25** —— `build.gradle` 注释原文「Mojang ships Java 25 to end users in 26.3, so mods should target Java 25」，并有 `java.toolchain.languageVersion = JavaLanguageVersion.of(25)`
- Gradle wrapper **9.2.1**（MDK 自带 `gradle-wrapper.properties`）
- 游戏 jar 已去混淆（Mojang 名）⇒ **不需要** parchment / mappings 块

## runs 与 modMetadata（MDK-26.3 实读）

- `neoForge { runs { client() / server()（`programArgument '--nogui'`）/ gameTestServer（`type = "gameTestServer"`）} }`
- `generateModMetadata`：把 `src/main/templates` 里的 `${}` 占位符展开到 `build/generated/sources/modMetadata`，再 `sourceSets.main.resources.srcDir` 挂进资源；`neoForge.ideSyncTask generateModMetadata` 让 IDE 同步时自动跑
- 元数据文件名 **`META-INF/neoforge.mods.toml`**（模板在 `src/main/templates/META-INF/`），`mod_id` 全小写、无 `-`

## 入口（MDK-26.3 实读）

```java
@Mod(ExampleMod.MODID)
public class ExampleMod {
    public ExampleMod(IEventBus modEventBus, ModContainer modContainer) {
        // ...
    }
}
```

客户端入口是**独立的一个类**：

```java
@Mod(value = ExampleMod.MODID, dist = Dist.CLIENT)
public class ExampleModClient { }
```

## 禁止

- 用 Forge `mods.toml` + `net.minecraftforge` 包当 26.3
- Yarn / parchment（26.x 已去混淆）
- 把 26.1 / 26.2 的 MDK 当 26.3
- 把 26.1 的 `01–10` 当 26.3 规则（本档 01–10 有自己的 MDK/sources 证据，未核处已在条内标注）
- 官方 MDK 404 / 无 pin 时返回 `MDK_NOT_PINNED`，禁止邻版 MDK
