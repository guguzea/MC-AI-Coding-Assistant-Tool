# Quilt / QSL 已核实表（差异层）

- search_docs({platform:"quilt"}) 当前无独立 1.21.11 文档树（已入库 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 / 1.21.1）。
- **禁止**编 `QuiltRegistry.register()`。
- **02–10 仍读** `fabric/1.21.11`。

## 入口（与其它 Quilt 档一致的 Loader 口径）

| API | 说明 |
|-----|------|
| `org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer)` | `quilt.mod.json` → `entrypoints.init`。禁止 Fabric 无参 `onInitialize()` 冒充 QSL |

## 注册

| 做法 | 说明 |
|------|------|
| Vanilla `Registry.register` | 简单 Item/Block **可用** |
| QSL RegistryEvents | **未在本档打开源码。禁止把 1.21.1 RegistryEvents#getEntryAddEvent 冒充本档。** |
| 禁止 | `QuiltRegistry.register()`；`net.fabricmc.fabric.api.event.registry` 当 QSL |
