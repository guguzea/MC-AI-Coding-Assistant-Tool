---
name: mc-registry
description: Quilt 1.21.11 mc-registry（QSL 差异）。名字只来自本档 qsl-verified.md。
platform: quilt
version: "1.21.11"
dependencies: []
docsTool: search_docs
---

# mc-registry（Quilt 1.21.11）

> ⚠️ **QSL 已于 2025-12 停更（`// TODO(未核实)`：`quiltmc.org/en/faq/` 已 404，无法复核），本版本无任何可用 QSL/QFAPI 构件**；本档内容仅为考据/stub，禁止当可编译 API。注册/事件走 Vanilla Registry.register 或同版 Fabric API。


核实表：knowledge/common/qsl-verified.md。
`data/quilt_1.21.11` 已入库；禁止编造未核实的 QSL 名。Vanilla/FAPI 用 `search_fabric_docs` version=1.21.11。02–10 仍读 fabric/1.21.11 overlay。

禁止把 1.21.1 RegistryEvents 冒充本档。Loader 入口仍是 ModInitializer#onInitialize(ModContainer)。

入口：org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer)。quilt.mod.json entrypoints.init。

禁止 QuiltRegistry.register()。禁止把 net.fabricmc.fabric.api.event.registry 当 QSL。
简单物品/方块可用 Vanilla Registry.register（不是 FAPI 专属）。
