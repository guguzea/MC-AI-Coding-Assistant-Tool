---
name: mc-registry
description: Quilt 1.21.1 mc-registry（QSL 本档无可用构件，maven 实证）。注册走 Vanilla Registry.register。
platform: quilt
version: "1.21.1"
dependencies: []
docsTool: search_docs
---

# mc-registry（Quilt 1.21.1）

> ⚠️ **QSL 已于 2025-12 停更（`// TODO(未核实)`：原引官方 FAQ 已 404，无法复核），本版本不存在任何已发布 QSL/QFAPI 构件。** `knowledge/common/qsl-verified.md` 是源码树考据，非可编译 API。

注册一律用 **Vanilla `Registry.register`**（Registries.ITEM / Registries.BLOCK 等，与 Fabric 共享）。qsl-verified.md 中的 RegistryEvents#getEntryAddEvent / RegistryMonitor#create **仅为源码考据，禁止生成代码**。

必须 search_docs({platform:"quilt"}) 且 version=1.21.1。02–10 仍读 fabric/1.21.1 overlay。

入口：org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer)。quilt.mod.json entrypoints.init。

禁止 QuiltRegistry.register()。禁止把 net.fabricmc.fabric.api.event.registry 当 QSL。
