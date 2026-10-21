---
name: mc-registry
description: Quilt 1.20.4 mc-registry（QSL 差异）。名字只来自本档 qsl-verified.md。
platform: quilt
version: "1.20.4"
dependencies: []
docsTool: search_docs
---

# mc-registry（Quilt 1.20.4）

> ⚠️ **「2025-12 停更」原引官方 FAQ 已 404，属 `// TODO(未核实)`，不作依据。** 本档 maven 上有 QSL 构件 8.0.0-alpha.13+1.20.4（alpha 线，实测）。本档 registry / lifecycle 符号已由该构件 javap 逐字实证（`knowledge/common/qsl-verified.md`）；仍无正式版 ⇒ **默认不生成 QSL**（要用须用户显式确认接受 alpha 依赖）。

核实表：knowledge/common/qsl-verified.md。
必须 search_docs({platform:"quilt"}) 且 version=1.20.4。02–10 仍读 fabric/1.20.4 overlay。

Vanilla Registry.register(Registries.*, id, value)。QSL RegistryEvents 未打开。

入口：net.fabricmc.api.ModInitializer#onInitialize()（quilt.mod.json entrypoints.main；quilt-loader 自带 @Deprecated 兼容接口，无需额外依赖）。QSL 写法（有该档构件时）：org.quiltmc.qsl.base.api.entrypoint.ModInitializer#onInitialize(ModContainer) + entrypoints.init + 依赖 org.quiltmc.qsl.core:qsl_base。

禁止 QuiltRegistry.register()。禁止把 net.fabricmc.fabric.api.event.registry 当 QSL。
简单物品/方块可用 Vanilla Registry.register（不是 FAPI 专属）。
