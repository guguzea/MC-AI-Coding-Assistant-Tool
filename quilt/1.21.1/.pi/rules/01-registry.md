---
description: 01 — Quilt 注册（QSL ≠ FAPI Registry）
---

# 01 — Quilt 注册（QSL ≠ FAPI Registry）

> ⚠️ **QSL 停更（2025-12 说法 `// TODO(未核实)`：原引官方 FAQ 已 404，无法复核）**：本版本无任何已发布 QSL/QFAPI 构件。本文件中的 QSL API 全部是**源码树考据，非可编译 API**——禁止生成。注册一律走 Vanilla `Registry.register` 或同版 Fabric API。
>
> 适用：Quilt 1.21.1。**禁止编造 `QuiltRegistry.register()`。** 未核实的 QSL 方法名：停止生成，改 `search_docs({platform:"quilt"})` 或 QSL 源码 / loader-api-summaries。

## 核心事实（已核实）

- **maven 实证（截至 2026-09-04）：`org.quiltmc:qsl` 的 1.21 线只有 4 个 alpha 构件（`10.0.0-alpha.1+1.21`、`10.0.0-alpha.2/3/5+1.21.1`），无正式版；1.21.1 零可用正式版构件**——下述 QSL 差异仅为考据背景（「2025-12 停更」原引的 `quiltmc.org/en/faq/` 已 404 → `// TODO(未核实)`）
- 简单物品/方块/事件：用 **Vanilla** `Registry.register(Registries.*, id, value)` 与同版 Fabric API（与 Fabric 共享，不是 FAPI 专属）
- ~~需要监听条目添加：`RegistryEvents#getEntryAddEvent` / `RegistryMonitor#create`~~——**源码树考据，无已发布构件，禁止生成**（见 `qsl-verified.md` 降级声明）
- **不要**生成 `net.fabricmc.fabric.api.event.registry` / `FabricRegistryBuilder` / `RegistrySyncManager` 当作 QSL

## Decision Flow

```
Decision: 注册方式
→ 简单 Item/Block/BlockEntity → Vanilla Registry.register（在 org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer) 中）
→ 事件/生命周期 → 同版 Fabric API（fabric/1.21.1 overlay 的 05-events.mdc）
→ QSL 专属 API → 本版本不存在可用构件：拒绝生成，向用户说明本版本无可用构件（maven 实证）
→ 禁止：把 Fabric Registry 教程改名交差
```

对照：https://wiki.quiltmc.org/en/concepts/qsl-qfapi
已核实表：`quilt/1.21.1/knowledge/common/qsl-verified.md`（02–10 仍读 fabric/1.21.1）。
