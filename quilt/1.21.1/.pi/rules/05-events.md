---
description: 05 — Quilt 事件差异
---

# 05 — Quilt 事件差异

> ⚠️ **QSL 停更（2025-12，官方 FAQ 实证）**：本版本无任何已发布 QSL/QFAPI 构件。下表 API 是**源码树考据，非可编译 API**——禁止生成。事件一律走同版 Fabric API（`fabric/1.21.1/.cursor/rules/05-events.mdc`）。
>
> 默认读 `fabric/1.21.1/.cursor/rules/05-events.mdc`。仅当用户要 **QSL 事件** 或 QFAPI 弃用提示时用本文件。
> 方法名来自本档 `knowledge/common/qsl-verified.md`（QSL 1.21 源码 `871ca7abf109`，抓取日 2026-08-16）。**禁止**把这些名字抄进 Quilt 1.18.2 / 1.20.1。

- **QSL 已停更且本版本无可用构件**；生命周期/注册事件用 `net.fabricmc.fabric.api.event.lifecycle`
- 不清楚方法名 → `search_docs({platform:"quilt"})`；无独立树时 QSL 查询会 `PLATFORM_DATA_MISSING`，**不会**回退 Fabric Registry 页
- 通用 Mixin / 数据包问题可回退 Fabric 文档（已过滤 FAPI 专属类）
- **禁止** `QuiltRegistry.register()`；不要把 `net.fabricmc.fabric.api.event.registry` / `FabricRegistryBuilder` 当 QSL

## QSL 符号考据表（⚠️ 源码树考据，非可编译 API，禁止生成）

入口：`org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer)`（`quilt.mod.json` → `entrypoints.init`）。禁止用 Fabric 无参 `onInitialize()` 记忆冒充。

简单 Item/Block 用 Vanilla `Registry.register(Registries.*, id, value)`（不是 FAPI 专属）；事件用同版 Fabric API。

| API（仅源码考据） | 考据内容 |
|-----|---------|
| ~~`org.quiltmc.qsl.registry.api.event.RegistryEvents#getEntryAddEvent(Registry)`~~ | 条目添加后回调 `EntryAdded#onAdded(RegistryEntryContext)`。字段 `DYNAMIC_REGISTRY_SETUP` / `DYNAMIC_REGISTRY_LOADED` |
| ~~`org.quiltmc.qsl.registry.api.event.RegistryMonitor#create(Registry)`~~ | 高层监视：`filter` / `forAll` / `forUpcoming` |
| ~~`org.quiltmc.qsl.lifecycle.api.event.ServerLifecycleEvents`~~ | 字段 `STARTING` / `READY` / `STOPPING` / `STOPPED`。回调 `startingServer` / `readyServer` / `stoppingServer` / `exitServer` |
| ~~`org.quiltmc.qsl.lifecycle.api.client.event.ClientLifecycleEvents`~~ | `@ClientOnly`。字段 `READY` / `STOPPING` / `STOPPED`（**无 STARTING**）。回调 `readyClient` / `stoppingClient` / `stoppedClient` |

以上符号在已发布构件中**不存在**（该分支从未随可用 QSL 发布）。替代：Fabric API 的 `ServerLifecycleEvents` / `ClientLifecycleEvents` / `RegistryEntryAddCallback`（见 fabric overlay）。

QFAPI 历史背景：有 QSL 替代的 FAPI 曾被弃用（wiki `qsl-qfapi`）；该生态已随 QSL 停更终结。
