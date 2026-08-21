---
name: mc-registry
description: Quilt 1.21.1 mc-registry（QSL 差异）。名字只来自本档 qsl-verified.md。
platform: quilt
version: "1.21.1"
dependencies: []
docsTool: search_docs
---

# mc-registry（Quilt 1.21.1）

核实表：knowledge/common/qsl-verified.md。
必须 search_docs({platform:"quilt"}) 且 version=1.21.1。02–10 仍读 fabric/1.21.1 overlay。

已核实 org.quiltmc.qsl.registry.api.event.RegistryEvents#getEntryAddEvent(Registry) 与 RegistryMonitor#create(Registry)。禁止 QuiltRegistry.register()。

入口：org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer)。quilt.mod.json entrypoints.init。

禁止 QuiltRegistry.register()。禁止把 net.fabricmc.fabric.api.event.registry 当 QSL。
简单物品/方块可用 Vanilla Registry.register（不是 FAPI 专属）。
