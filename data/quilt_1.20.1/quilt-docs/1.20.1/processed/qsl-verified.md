# Quilt / QSL 已核实表（差异层）

- **抓取日**：
- **源**：`data/quilt_<ver>/quilt-docs/<ver>/processed/qsl-readme.md`（QSL README）+ wiki 概念页 `qsl-qfapi`（该 wiki 为 SPA，入库正文可能只有导航壳，**方法名以 README 图表为准**）
- **禁止**编 `QuiltRegistry.register()`。
- **02–10 仍读** `fabric/<同一 MC 版本>`。本表不是完整模组教程。本计划不写 Quilt 26.x。

## 入口（已核实口径）

| API | 说明 |
|-----|------|
| `net.fabricmc.api.ModInitializer#onInitialize()` | `quilt.mod.json` → `entrypoints.main`（quilt-loader 自带 Fabric 兼容接口，`@Deprecated`）。⚠️ 旧行的 `org.quiltmc.loader.api.entrypoint.ModInitializer` 在 quilt-loader 0.31.0-beta.4 **已删除**（javap 实测）；QSL 替代 = `org.quiltmc.qsl.base.api.entrypoint.ModInitializer#onInitialize(ModContainer)`（构件 `org.quiltmc.qsl.core:qsl_base`，javap 实测；本档 maven 有构件 6.3.0+1.20.1（实测；**复测并下载入库** `F:\MC_GAME\_oracle-jars\qsl\`）） |

## 注册

| 做法 | 说明 |
|------|------|
| Vanilla `Registry.register(Registries.*, id, value)` | 简单 Item/Block/BlockEntity **可用**（不是 FAPI 专属） |
| QSL Core Registry | **构件实证**（`org.quiltmc.qsl.core:registry:6.3.0+1.20.1` javap；本机 `F:\MC_GAME\_oracle-jars\qsl\`）：`RegistryEvents#getEntryAddEvent(Registry)` + 字段 `DYNAMIC_REGISTRY_SETUP` / `DYNAMIC_REGISTRY_LOADED` 逐字在场；`RegistryMonitor#create(Registry)` 的 `filter` / `forAll` / `forUpcoming` 逐字在场。引用只许来自本表与构件 |
| 禁止 | `QuiltRegistry.register()`；`net.fabricmc.fabric.api.event.registry` 当 QSL |

## 生命周期（构件实证）

| API | 说明 |
|-----|------|
| `org.quiltmc.qsl.lifecycle.api.event.ServerLifecycleEvents` | 字段 `STARTING` / `READY` / `STOPPING` / `STOPPED`；回调 `startingServer` / `readyServer` / `stoppingServer` / `exitServer`（`org.quiltmc.qsl.core:lifecycle_events:6.3.0+1.20.1` javap 逐字） |
| `org.quiltmc.qsl.lifecycle.api.client.event.ClientLifecycleEvents` | 字段 `READY` / `STOPPING` / `STOPPED`（**无 STARTING**）；回调 `readyClient` / `stoppingClient` / `stoppedClient`（同构件） |

## README 标明 QSL 有、不要用 FAPI 名顶上的能力（无方法签名则只作方向）

Core：Event API（含 Phases、Events as Entrypoints）、Networking API、Lifecycle（Client/Server tick 等；README 写明若干 ❌ 相对 FAPI）。
Resource Loader：mod resources、built-in resource pack API 等。

QFAPI：有 QSL 替代的 FAPI **弃用**；item groups 等 README/wiki 写明仍可能走 QFAPI。

不清楚方法名 → 停。不要把 Fabric Registry 教程改名交差。
