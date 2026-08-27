---
name: mc-registry
description: Quilt 1.20.4 mc-registry（QSL 差异）。名字只来自本档 qsl-verified.md。
platform: quilt
version: "1.20.4"
dependencies: []
docsTool: search_docs
---

# mc-registry（Quilt 1.20.4）

> ⚠️ **QSL 停更（2025-12，官方 FAQ 实证）**：本版本无任何已发布 QSL/QFAPI 构件。本文件中的 QSL API 全部是**源码树考据，非可编译 API**——禁止生成。

核实表：knowledge/common/qsl-verified.md。
必须 search_docs({platform:"quilt"}) 且 version=1.20.4。02–10 仍读 fabric/1.20.4 overlay。

Vanilla Registry.register(Registries.*, id, value)。QSL RegistryEvents 未打开。

入口：org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer)。quilt.mod.json entrypoints.init。

禁止 QuiltRegistry.register()。禁止把 net.fabricmc.fabric.api.event.registry 当 QSL。
简单物品/方块可用 Vanilla Registry.register（不是 FAPI 专属）。
