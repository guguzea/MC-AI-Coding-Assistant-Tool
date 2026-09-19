---
description: 05 — Quilt 事件差异
---

# 05 — Quilt 事件差异

> ⚠️ **QSL 停更（2025-12 说法 `// TODO(未核实)`：原引官方 FAQ 已 404，无法复核）**：本版本**无 QSL/QFAPI 正式版构件**（maven 只到 alpha；实证数据见 quilt/1.21.8/AGENTS.md 顶部横幅）。下表 API 是**源码树考据，非可编译 API**——禁止生成。事件一律走同版 Fabric API。

> 默认读 `fabric/1.21.8/.cursor/rules/05-events.mdc`。仅当用户要 **QSL 事件** 或 QFAPI 弃用提示时用本文件。
> ⚠️ **离线数据**：`data/quilt_1.21.8/` 无 quilt-docs 树（本版本无已发布 QSL/QFAPI 构件，属上游真实状态）。`search_docs({platform:"quilt", version:"1.21.8"})` **两种查询都不会**返回 `PLATFORM_DATA_MISSING`（2026-09-13 逐档实跑 CLI）：① QSL 措辞查询（`query="QSL registry key"`）→ `ok:true` + `fallback:"quilt"` + `resolvedVersion:"1.21.11"` + `semantic:true` + `total:3`——同线已建档语料，不是本版专属正文；`source_version` 与 `resolvedVersion` 在该路径**同为顶层键**（实测 13 键，另含 `requestedVersion` / `query`），二者都是 1.21.11；② 那条路径无此键、只有 `sourcePlatform`。② 普通词查询（`query="registry"`）→ `ok:true` + `fallback:"fabric"` + `sourcePlatform:"fabric"` + `resolvedVersion:"1.21.8"` + `semantic:true` + `total:16`（命中 `1.21.8/develop_*` 等同版 Fabric 正文，**不能**当 QSL 证据）。⇒ 必须逐字读 `fallback` / `sourcePlatform`（仅 ②）/ `source_version`（仅 ①）/ `resolvedVersion` / `semantic` / `total` 再下结论；`total:0` / `found:false` 只说明本仓索引未覆盖，**不代表本版没有该 API**。本版改口线 `1.21.11` 的语料树没有 `qsl-verified` 页 ⇒ 不触及 F115 语料侧旧断言。需要同版 Fabric API 写法时改用 `search_docs({platform:"fabric", version:"1.21.8"})`。禁止补抓或从邻版克隆 quilt-docs。

- QSL 生命周期/注册事件 ≠ `net.fabricmc.fabric.api.event.lifecycle`
- **禁止** `QuiltRegistry.register()`；不要把 FAPI Registry 事件当 QSL
- **禁止**把 Quilt 1.21.1 `qsl-verified.md` 的字段名直接当 1.21.8 QSL。本档方法名以 `search_docs({platform:"quilt"})` / 已打开 QSL 源码为准
- 不清楚方法名 → `search_docs({platform:"quilt", version:"1.21.8"})`；实测本版检索**两条路径都有回退面**（逐字段见顶部「离线数据」条）：`fallback:"fabric"` + `sourcePlatform:"fabric"` 命中的是同版 Fabric 正文（本版 `total:16`），**不得**当 QSL 证据；`fallback:"quilt"` + `resolvedVersion:"1.21.11"` 命中的是同线已建档正文而非本版正文。QSL 方法名一律 `query_loader_api`（先 `ingest_loader_api` 入库用户自备 jar）
