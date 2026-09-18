---
description: 05 — Quilt 事件差异
---

# 05 — Quilt 事件差异

> ⚠️ **QSL 停更（2025-12 说法 `// TODO(未核实)`：原引官方 FAQ 已 404，无法复核）**：本版本**无 QSL/QFAPI 正式版构件**（maven 只到 alpha，见本文件「maven 实证」段）。下表 API 是**源码树考据，非可编译 API**——禁止生成。事件一律走同版 Fabric API。

> 默认读 `fabric/1.21.3/.cursor/rules/05-events.mdc`。仅当用户要 **QSL 事件** 或 QFAPI 弃用提示时用本文件。
> ⚠️ **离线数据**：`data/quilt_1.21.3/` 无 quilt-docs 树（本版本无已发布 QSL/QFAPI 构件，属上游真实状态）。`search_docs({platform:"quilt", version:"1.21.3"})` **两种查询都不会**返回 `PLATFORM_DATA_MISSING`（2026-09-13 逐档实跑 CLI）：① QSL 措辞查询（`query="QSL registry key"`）→ `ok:true` + `fallback:"quilt"` + `resolvedVersion:"1.21.1"` + `semantic:true` + `total:4`——同线已建档语料，不是本版专属正文；`source_version` 与 `resolvedVersion` 在该路径**同为顶层键**（实测 13 键，另含 `requestedVersion` / `query`），二者都是 1.21.1；② 那条路径无此键、只有 `sourcePlatform`。② 普通词查询（`query="registry"`）→ `ok:true` + `fallback:"fabric"` + `sourcePlatform:"fabric"` + `resolvedVersion:"1.21.3"` + `semantic:false` + `total:0`，命中面是同版 Fabric 正文，**不能**当 QSL 证据（本版这条路径的 `warning` 另含「语义索引缺库，本次已回退 L0 关键词检索」⇒ 本次实际 0 命中）。⇒ 必须逐字读 `fallback` / `sourcePlatform`（仅 ②）/ `source_version`（仅 ①）/ `resolvedVersion` / `semantic` / `total` 再下结论；`total:0` 只说明本仓索引未覆盖，**不代表本版没有该 API**。⚠️ ① 的改口命中含 `1.21.1/qsl-verified`，其**语料正文** `data/quilt_1.21.1/quilt-docs/1.21.1/processed/qsl-verified.md:3` 仍端出已撤回断言（「QSL 已于 2025-12 停更」/ `11.0.0-alpha.3`）——语料受「上游原样」原则保护、不改写 ⇒ 只当背景，QSL 状态结论以源稿 `quilt/1.21.1/knowledge/common/qsl-verified.md:3` 为准。需要同版 Fabric API 写法时改用 `search_docs({platform:"fabric", version:"1.21.3"})`。禁止补抓或从邻版克隆 quilt-docs。

- QSL 生命周期/注册事件 ≠ `net.fabricmc.fabric.api.event.lifecycle`
- **禁止** `QuiltRegistry.register()`；不要把 FAPI Registry 事件当 QSL
- **禁止**把 Quilt 1.21.1 `qsl-verified.md` 的字段名直接当 1.21.3 QSL。本档方法名以 `search_docs({platform:"quilt"})` / 已打开 QSL 源码为准
- 不清楚方法名 → `search_docs({platform:"quilt", version:"1.21.3"})`；实测本版检索**两条路径都有回退面**（逐字段见顶部「离线数据」条）：`fallback:"fabric"` + `sourcePlatform:"fabric"` 命中的是同版 Fabric 正文，**不得**当 QSL 证据；`fallback:"quilt"` + `resolvedVersion:"1.21.1"` 命中的是同线已建档正文而非本版正文。QSL 方法名一律 `query_loader_api`（先 `ingest_loader_api` 入库用户自备 jar）
