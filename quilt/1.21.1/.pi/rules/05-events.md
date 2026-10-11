---
description: 05 — Quilt 事件差异
---

# 05 — Quilt 事件差异

> ⚠️ **QSL 停更（2025-12 说法 `// TODO(未核实)`：原引官方 FAQ 已 404，无法复核）**：本版本**无 QSL/QFAPI 正式版构件**（1.21 线只到 alpha；实证数据见 quilt/1.21.1/AGENTS.md 顶部横幅）。下表 QSL 符号已由 alpha 构件 javap **逐字实证**（见本文件:26 勘误与 `knowledge/common/qsl-verified.md`），但**默认不生成 QSL**——事件一律走同版 Fabric API（`fabric/1.21.1/.cursor/rules/05-events.mdc`）；要用须用户显式确认接受 alpha 依赖。
>
> 默认读 `fabric/1.21.1/.cursor/rules/05-events.mdc`。仅当用户要 **QSL 事件** 或 QFAPI 弃用提示时用本文件。
> 方法名来自本档 `knowledge/common/qsl-verified.md`（QSL 1.21 源码 `871ca7abf109`；**构件复核：alpha 构件逐字在场**）。**禁止跨档抄**——1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 各自已有自己的构件实证表，引用走对应档的表。

- **本版本无可用 QSL/QFAPI 正式版构件（maven 实证）**；生命周期/注册事件用 `net.fabricmc.fabric.api.event.lifecycle`
- 不清楚方法名 → `search_docs({platform:"quilt", version:"1.21.1"})`；实测本版 `ok:true` + `fallback:null` + `resolvedVersion:"1.21.1"` + `semantic:true` + `total:4`（命中本版 QSL 语料 `qsl-readme` / `qsl-verified` / `qsl-qfapi` / `quilt-mod-json`，本档无跨平台回退）。**quilt 检索不存在 `PLATFORM_DATA_MISSING` 路径**：本仓完全无语料的空洞档（如 1.21.2）返回 `ok:false` + `VERSION_NOT_FOUND` + `fallback:null`（载荷无 `total`），有树但本版缺 quilt-docs 页的档位则返回 `fallback:"quilt"`（同线语料）或 `fallback:"fabric"` + `sourcePlatform:"fabric"`（同版 Fabric 正文）⇒ 三条路径不得混写成一句「不回退」禁令。QSL 方法名一律 `query_loader_api`（先 `ingest_loader_api`）
- 通用 Mixin / 数据包问题可回退 Fabric 文档（已过滤 FAPI 专属类）
- **禁止** `QuiltRegistry.register()`；不要把 `net.fabricmc.fabric.api.event.registry` / `FabricRegistryBuilder` 当 QSL

## QSL 符号表（⚠️ alpha 构件逐字实证；仍无正式版 ⇒ 默认不生成，要用须用户确认接受 alpha）

入口：`quilt.mod.json` → `entrypoints.main`，实现 `net.fabricmc.api.ModInitializer#onInitialize()`（quilt-loader 自带兼容接口）。⚠️ Quilt 原生 `org.quiltmc.loader.api.entrypoint.ModInitializer` 在 quilt-loader 0.31 已删除（javap 实测）；QSL 替代 `org.quiltmc.qsl.base.api.entrypoint.ModInitializer#onInitialize(ModContainer)` 需 `org.quiltmc.qsl.core:qsl_base` 构件（本档只有 alpha，未采用）。

简单 Item/Block 用 Vanilla `Registry.register(Registries.*, id, value)`（不是 FAPI 专属）；事件用同版 Fabric API。

| API（仅源码考据） | 考据内容 |
|-----|---------|
| `org.quiltmc.qsl.registry.api.event.RegistryEvents#getEntryAddEvent(Registry)` | 条目添加后回调 `EntryAdded#onAdded(RegistryEntryContext)`。字段 `DYNAMIC_REGISTRY_SETUP` / `DYNAMIC_REGISTRY_LOADED`（**构件复核：`registry-10.0.0-alpha.5+1.21.1.jar` 逐字在场**） |
| `org.quiltmc.qsl.registry.api.event.RegistryMonitor#create(Registry)` | 高层监视：`filter` / `forAll` / `forUpcoming`（同构件在场） |
| `org.quiltmc.qsl.lifecycle.api.event.ServerLifecycleEvents` | 字段 `STARTING` / `READY` / `STOPPING` / `STOPPED`。回调 `startingServer` / `readyServer` / `stoppingServer` / `exitServer`（`lifecycle_events-10.0.0-alpha.5+1.21.1.jar` 逐字在场） |
| `org.quiltmc.qsl.lifecycle.api.client.event.ClientLifecycleEvents` | `@ClientOnly`。字段 `READY` / `STOPPING` / `STOPPED`（**无 STARTING**）。回调 `readyClient` / `stoppingClient` / `stoppedClient`（同构件在场） |

**勘误**：旧文写「以上符号在已发布构件中**不存在**」——**不成立，已删**：这些符号在 `10.0.0-alpha.5+1.21.1` 的模块构件里逐字在场（上表已逐项复核）。仍成立的是：**1.21.1 线只有 alpha、没有正式版**（maven `<release>` 同为 `10.0.0-alpha.5+1.21.1`）⇒ 默认路径仍建议 Fabric API（`ServerLifecycleEvents` / `ClientLifecycleEvents` / `RegistryEntryAddCallback`）；要改用 QSL 先与用户确认接受 alpha 依赖。

QFAPI 历史背景：有 QSL 替代的 FAPI 曾被弃用（wiki `qsl-qfapi`）；该生态在 maven 上已无 1.21.x 正式版构件；「已终结」无官方来源可复核 → `// TODO(未核实)`。
