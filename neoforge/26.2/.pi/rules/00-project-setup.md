---
description: 00 — 项目结构（NeoForge 26.2）
---

# 00 — 项目结构（NeoForge 26.2）

来源：官方 MDK 实读（`NeoForgeMDKs/MDK-26.2-ModDevGradle@d1c748fd`、`MDK-26.2-NeoGradle@15955d03`，2026-10-31）。
**本档 11 条齐（00–10），但证据是官方 MDK + sources jar，不是 docs 正文**：上游主文档 `docs.neoforged.net` 仍只到 26.1（`/docs/26.2/` 实测 404，manifest 里 `versions["26.2"].available=false` / `httpStatus=404`）。00 取自 26.2 MDK 的 `gradle.properties` / `build.gradle`；01–10 的证据与未核处写在各条内 —— **禁止拿 26.1 的 01–10 顶替**。

## 构建插件（两套 MDK，按需二选一）

| 插件 | 26.2 MDK 实值 |
|---|---|
| ModDevGradle | MDK 模板 `2.0.143`；**本档 scaffold 2026-10-31 已统一到 `2.0.148`**（照抄用 2.0.148） |
| NeoGradle | `id 'net.neoforged.gradle.userdev'`（26.2 线；依赖 `implementation "net.neoforged:neoforge:${neo_version}"`） |

从零工程调用 `download_official_mdk` 时必须传 `buildPlugin`。pin 见 `mcp-server/data/mdk-checksums.json` 的 `neoforge-26.2-*`。

## 版本锚点（本档 scaffold 实钉；2026-10-31 已对齐 maven 26.2 线最新非 beta）

```
minecraft_version=26.2
minecraft_version_range=[26.2]
neo_version=26.2.0.93
```

- 本档 scaffold 钉 **`26.2.0.93`**（= maven `releases` 的 26.2 线最新非 beta；`26.2.0.57` 起脱离 `-beta`）。**上游 MDK 模板当时钉 `26.2.0.59`**（as-of 2026-10-31）⇒ **照抄用 `26.2.0.93`**，不要把模板值当上限
- Java **25**（`java.toolchain.languageVersion = JavaLanguageVersion.of(25)`）
- Gradle wrapper **9.2.1**（MDK 自带）
- 游戏 jar 已去混淆（Mojang 名）⇒ **不需要** parchment / mappings 块

## runs 与 modMetadata

同 26.3 线：`neoForge { runs { client / server（`--nogui`）/ gameTestServer } }`；`generateModMetadata` 从 `src/main/templates` 展开到 `build/generated/sources/modMetadata`；元数据文件名 **`META-INF/neoforge.mods.toml`**。

## 入口（MDK-26.2 实读）

```java
@Mod(ExampleMod.MODID)
public class ExampleMod {
    public ExampleMod(IEventBus modEventBus, ModContainer modContainer) { }
}

@Mod(value = ExampleMod.MODID, dist = Dist.CLIENT)
public class ExampleModClient { }
```

## 禁止

- 用 Forge `mods.toml` + `net.minecraftforge` 包当 26.2
- Yarn / parchment
- 把 26.1 的 MDK 或 26.1 的 `01–10` 当 26.2（本档 01–10 有自己的 MDK/sources 证据）
- 官方 MDK 404 / 无 pin 时返回 `MDK_NOT_PINNED`，禁止邻版 MDK
