---
description: 01 — Quilt 注册（QSL ≠ FAPI Registry）
---

# 01 — Quilt 注册（QSL ≠ FAPI Registry）

> ⚠️ **QSL 停更（2025-12 说法 `// TODO(未核实)`：原引官方 FAQ 已 404，无法复核）**：本版本**无 QSL/QFAPI 正式版构件**（maven 只到 alpha，见本文件「maven 实证」段）。本文件中的 QSL API 全部是**源码树考据，非可编译 API**——禁止生成。注册一律走 Vanilla `Registry.register` 或同版 Fabric API。

> 适用：Quilt 1.21.10。**禁止编造 `QuiltRegistry.register()`。** 未核实的 QSL 方法名：停止生成，改 `search_docs({platform:"quilt"})`。
> ⚠️ **离线数据**：`data/quilt_1.21.10/` 无 quilt-docs 树（本版本无已发布 QSL/QFAPI 构件，属上游真实状态）。`search_docs({platform:"quilt", version:"1.21.10"})` **两种查询都不会**返回 `PLATFORM_DATA_MISSING`（2026-09-13 逐档实跑 CLI）：① QSL 措辞查询（`query="QSL registry key"`）→ `ok:true` + `fallback:"quilt"` + `resolvedVersion:"1.21.11"` + `semantic:true` + `total:3`——同线已建档语料，不是本版专属正文；`source_version` 与 `resolvedVersion` 在该路径**同为顶层键**（实测 13 键，另含 `requestedVersion` / `query`），二者都是 1.21.11；② 那条路径无此键、只有 `sourcePlatform`。② 普通词查询（`query="registry"`）→ `ok:true` + `fallback:"fabric"` + `sourcePlatform:"fabric"` + `resolvedVersion:"1.21.10"` + `semantic:true` + `total:15`（命中 `1.21.10/develop_*` 等同版 Fabric 正文，**不能**当 QSL 证据）。⇒ 必须逐字读 `fallback` / `sourcePlatform`（仅 ②）/ `source_version`（仅 ①）/ `resolvedVersion` / `semantic` / `total` 再下结论；`total:0` / `found:false` 只说明本仓索引未覆盖，**不代表本版没有该 API**。本版改口线 `1.21.11` 的语料树没有 `qsl-verified` 页 ⇒ 不触及 F115 语料侧旧断言。需要同版 Fabric API 写法时改用 `search_docs({platform:"fabric", version:"1.21.10"})`。禁止补抓或从邻版克隆 quilt-docs。

## 核心事实

- QSL Core Registry 与 Fabric API Registry **不完全相同**
- 简单物品/方块仍可用 **Vanilla** `Registry.register(Registries.*, id, value)`
- **不要**生成 `net.fabricmc.fabric.api.event.registry` / `FabricRegistryBuilder` 当作 QSL
- **禁止**把 Quilt 1.21.1 `qsl-verified.md` 的 RegistryEvents 签名当本档可编译 API

## Decision Flow

```
→ 简单 Item/Block → Vanilla Registry.register（ModInitializer#onInitialize(ModContainer)）
→ QSL 专属 → 只使用 org.quiltmc.qsl.* 已核实 API；不清楚就拒绝臆造
→ 禁止：把 Fabric Registry 教程改名交差
```
