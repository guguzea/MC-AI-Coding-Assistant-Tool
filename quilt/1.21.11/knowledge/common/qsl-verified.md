# Quilt / QSL 已核实表（差异层）

- search_docs({platform:"quilt", version:"1.21.11"})：`data/quilt_1.21.11` 已入库（quilt-docs/1.21.11 + L0–L2）。
- **禁止**编 `QuiltRegistry.register()`。
- **02–10 仍读** `fabric/1.21.11`。

## 入口（与其它 Quilt 档一致的 Loader 口径）

| API | 说明 |
|-----|------|
| `net.fabricmc.api.ModInitializer#onInitialize()` | `quilt.mod.json` → `entrypoints.main`（quilt-loader 自带 Fabric 兼容接口，`@Deprecated`）。⚠️ 旧行的 `org.quiltmc.loader.api.entrypoint.ModInitializer` 在 quilt-loader 0.31.0-beta.4 **已删除**（javap 实测 2026-10-01）；QSL 替代 = `org.quiltmc.qsl.base.api.entrypoint.ModInitializer#onInitialize(ModContainer)`（构件 `org.quiltmc.qsl.core:qsl_base`，javap 实测；本档 MC 版本 maven 上无构件（+1.21.11 后缀 0 命中，2026-10-01 实测）） |

## 注册

| 做法 | 说明 |
|------|------|
| Vanilla `Registry.register` | 简单 Item/Block **可用** |
| QSL RegistryEvents | **未在本档打开源码。禁止把 1.21.1 RegistryEvents#getEntryAddEvent 冒充本档。** |
| 禁止 | `QuiltRegistry.register()`；`net.fabricmc.fabric.api.event.registry` 当 QSL |
