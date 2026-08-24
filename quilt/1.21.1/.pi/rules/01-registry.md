---
description: 01 — Quilt 注册（QSL ≠ FAPI Registry）
---

# 01 — Quilt 注册（QSL ≠ FAPI Registry）

> ⚠️ **QSL 停更（2025-12，官方 FAQ 实证）**：本版本无任何已发布 QSL/QFAPI 构件。本文件中的 QSL API 全部是**源码树考据，非可编译 API**——禁止生成。注册一律走 Vanilla `Registry.register` 或同版 Fabric API。
>
> 适用：Quilt 1.21.1。**禁止编造 `QuiltRegistry.register()`。** 未核实的 QSL 方法名：停止生成，改 `search_docs({platform:"quilt"})` 或 QSL 源码 / loader-api-summaries。

## 核心事实（已核实）

- **QSL 已于 2025-12 停更；1.21 线仅 4 个 QSL 11.0.0-alpha 构建（止 2024-08-12），1.21.1 零可用构件**——下述 QSL 差异仅为考据背景
- 简单物品/方块/事件：用 **Vanilla** `Registry.register(Registries.*, id, value)` 与同版 Fabric API（与 Fabric 共享，不是 FAPI 专属）
- ~~需要监听条目添加：`RegistryEvents#getEntryAddEvent` / `RegistryMonitor#create`~~——**源码树考据，无已发布构件，禁止生成**（见 `qsl-verified.md` 降级声明）
- **不要**生成 `net.fabricmc.fabric.api.event.registry` / `FabricRegistryBuilder` / `RegistrySyncManager` 当作 QSL

## Decision Flow

```
Decision: 注册方式
→ 简单 Item/Block/BlockEntity → Vanilla Registry.register（在 org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer) 中）
→ 事件/生命周期 → 同版 Fabric API（fabric/1.21.1 overlay 的 05-events.mdc）
→ QSL 专属 API → 本版本不存在可用构件：拒绝生成，向用户说明停更事实
→ 禁止：把 Fabric Registry 教程改名交差
```

对照：https://wiki.quiltmc.org/en/concepts/qsl-qfapi
已核实表：`quilt/1.21.1/knowledge/common/qsl-verified.md`（02–10 仍读 fabric/1.21.1）。
