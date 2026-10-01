# Quilt / QSL 已核实表（差异层）

- 无独立 QSL 历史快照。必须 `search_docs({platform:"quilt"})` version=1.21.10；无树则改口 `list_doc_versions`。
- **禁止**编 `QuiltRegistry.register()`。
- **禁止**把 1.21.1 RegistryEvents / Lifecycle 字段冒充本档。
- **02–10 仍读** `fabric/1.21.10`。

## 入口（Loader 口径）

| API | 说明 |
|-----|------|
| `net.fabricmc.api.ModInitializer#onInitialize()` | `quilt.mod.json` → `entrypoints.main`（quilt-loader 自带 Fabric 兼容接口，`@Deprecated`）。⚠️ 旧行的 `org.quiltmc.loader.api.entrypoint.ModInitializer` 在 quilt-loader 0.31.0-beta.4 **已删除**（javap 实测 2026-10-01）；QSL 替代 = `org.quiltmc.qsl.base.api.entrypoint.ModInitializer#onInitialize(ModContainer)`（构件 `org.quiltmc.qsl.core:qsl_base`，javap 实测；本档 MC 版本 maven 上无构件（+1.21.10 后缀 0 命中，2026-10-01 实测）） |

## 注册

| 做法 | 说明 |
|------|------|
| Vanilla `Registry.register` | 简单 Item/Block **可用** |
| QSL RegistryEvents | **未在本档打开源码。禁止把 1.21.1 签名冒充本档。** |
| 禁止 | `QuiltRegistry.register()`；`net.fabricmc.fabric.api.event.registry` 当 QSL |
