---
name: mc-registry
description: Quilt 1.18.2 mc-registry（QSL 差异）。名字只来自本档 qsl-verified.md。
platform: quilt
version: "1.18.2"
dependencies: []
docsTool: search_docs
---

# mc-registry（Quilt 1.18.2）

核实表：knowledge/common/qsl-verified.md。
必须 search_docs({platform:"quilt"}) 且 version=1.18.2。02–10 仍读 fabric/1.18.2 overlay。

1.18.2 用 Registry.ITEM/BLOCK，没有 Registries。QSL RegistryEvents 未打开，禁止把 1.21 getEntryAddEvent 冒充本档。

入口：org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer)。quilt.mod.json entrypoints.init。

禁止 QuiltRegistry.register()。禁止把 net.fabricmc.fabric.api.event.registry 当 QSL。
简单物品/方块可用 Vanilla Registry.register（不是 FAPI 专属）。
