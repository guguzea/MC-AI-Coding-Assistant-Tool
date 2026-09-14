---
description: 06-networking Quilt
globs:
alwaysApply: false
---

# 06 — 网络
> ⚠️ **离线数据**：`data/quilt_1.21.10/` 无 quilt-docs 树（本版本无已发布 QSL/QFAPI 构件，属上游真实状态）。`search_docs({platform:"quilt", version:"1.21.10"})` **两种查询都不会**返回 `PLATFORM_DATA_MISSING`（2026-09-13 逐档实跑 CLI）：① QSL 措辞查询（`query="QSL registry key"`）→ `ok:true` + `fallback:"quilt"` + `resolvedVersion:"1.21.11"` + `semantic:true` + `total:3`——同线已建档语料，不是本版专属正文；`source_version` 与 `resolvedVersion` 在该路径**同为顶层键**（实测 13 键，另含 `requestedVersion` / `query`），二者都是 1.21.11；② 那条路径无此键、只有 `sourcePlatform`。② 普通词查询（`query="registry"`）→ `ok:true` + `fallback:"fabric"` + `sourcePlatform:"fabric"` + `resolvedVersion:"1.21.10"` + `semantic:true` + `total:15`（命中 `1.21.10/develop_*` 等同版 Fabric 正文，**不能**当 QSL 证据）。⇒ 必须逐字读 `fallback` / `sourcePlatform`（仅 ②）/ `source_version`（仅 ①）/ `resolvedVersion` / `semantic` / `total` 再下结论；`total:0` / `found:false` 只说明本仓索引未覆盖，**不代表本版没有该 API**。本版改口线 `1.21.11` 的语料树没有 `qsl-verified` 页 ⇒ 不触及 F115 语料侧旧断言。需要同版 Fabric API 写法时改用 `search_docs({platform:"fabric", version:"1.21.10"})`。禁止补抓或从邻版克隆 quilt-docs。

QSL ≠ FAPI。禁止把同版 Fabric 06 当 QSL 网络教程。

- 工程声明了 **QFAPI**（Quilted Fabric API）依赖时，才可对照 FAPI 网络 API（仍须核工程 mappings 与 `search_docs(platform=quilt)`）。
- 无 QFAPI：只许 `search_docs(platform=quilt)`，不要 overlay Fabric 网络全文。
