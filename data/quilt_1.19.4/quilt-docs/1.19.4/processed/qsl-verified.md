# Quilt / QSL 已核实表（差异层）

- **抓取日**：2026-08-15
- **源**：`data/quilt_<ver>/quilt-docs/<ver>/processed/qsl-readme.md`（QSL README）+ wiki 概念页 `qsl-qfapi`（该 wiki 为 SPA，入库正文可能只有导航壳，**方法名以 README 图表为准**）
- **禁止**编 `QuiltRegistry.register()`。
- **02–10 仍读** `fabric/<同一 MC 版本>`。本表不是完整模组教程。本计划不写 Quilt 26.x。

## 入口（已核实口径）

| API | 说明 |
|-----|------|
| `net.fabricmc.api.ModInitializer#onInitialize()` | `quilt.mod.json` → `entrypoints.main`（quilt-loader 自带 Fabric 兼容接口，`@Deprecated`）。⚠️ 旧行的 `org.quiltmc.loader.api.entrypoint.ModInitializer` 在 quilt-loader 0.31.0-beta.4 **已删除**（javap 实测 2026-10-01）；QSL 替代 = `org.quiltmc.qsl.base.api.entrypoint.ModInitializer#onInitialize(ModContainer)`（构件 `org.quiltmc.qsl.core:qsl_base`，javap 实测；本档 maven 有构件 5.0.0-beta.11+1.19.4（2026-10-01 实测）） |

## 注册

| 做法 | 说明 |
|------|------|
| Vanilla `Registry.register(Registries.*, id, value)` | 简单 Item/Block/BlockEntity **可用**（不是 FAPI 专属） |
| QSL Core Registry | 本档对应 QSL 分支未在本收口打开到 `RegistryEvents.java`。**禁止**把 1.21 分支方法名冒充本档。已核实的 1.21 源见 `quilt/1.21.1/knowledge/common/qsl-verified.md`。 |
| 禁止 | `QuiltRegistry.register()`；`net.fabricmc.fabric.api.event.registry` 当 QSL |

## README 标明 QSL 有、不要用 FAPI 名顶上的能力（无方法签名则只作方向）

Core：Event API（含 Phases、Events as Entrypoints）、Networking API、Lifecycle（Client/Server tick 等；README 写明若干 ❌ 相对 FAPI）。
Resource Loader：mod resources、built-in resource pack API 等。

QFAPI：有 QSL 替代的 FAPI **弃用**；item groups 等 README/wiki 写明仍可能走 QFAPI。

不清楚方法名 → 停。不要把 Fabric Registry 教程改名交差。
