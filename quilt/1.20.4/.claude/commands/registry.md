---
name: mc-registry
description: Quilt 1.20.4 mc-registry（QSL 差异）。名字只来自本档 qsl-verified.md。
platform: quilt
version: "1.20.4"
dependencies: []
docsTool: search_docs
---

# mc-registry（Quilt 1.20.4）

> ⚠️ **QSL 停更（2025-12 说法 `// TODO(未核实)`：原引官方 FAQ 已 404，无法复核）**：本档 maven 上有 QSL 构件 8.0.0-alpha.13+1.20.4（alpha 线，2026-10-01 实测）。本文件中的 QSL API 全部是**源码树考据，非可编译 API**——禁止生成。

核实表：knowledge/common/qsl-verified.md。
必须 search_docs({platform:"quilt"}) 且 version=1.20.4。02–10 仍读 fabric/1.20.4 overlay。

Vanilla Registry.register(Registries.*, id, value)。QSL RegistryEvents 未打开。

入口：net.fabricmc.api.ModInitializer#onInitialize()（quilt.mod.json entrypoints.main；quilt-loader 自带 @Deprecated 兼容接口，无需额外依赖）。QSL 写法（有该档构件时）：org.quiltmc.qsl.base.api.entrypoint.ModInitializer#onInitialize(ModContainer) + entrypoints.init + 依赖 org.quiltmc.qsl.core:qsl_base。

禁止 QuiltRegistry.register()。禁止把 net.fabricmc.fabric.api.event.registry 当 QSL。
简单物品/方块可用 Vanilla Registry.register（不是 FAPI 专属）。
