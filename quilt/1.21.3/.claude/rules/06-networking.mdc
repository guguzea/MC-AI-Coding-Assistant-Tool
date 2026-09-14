---
description: 06-networking Quilt
globs:
alwaysApply: false
---

# 06 — 网络
> ⚠️ **离线数据**：`data/quilt_1.21.3/` 无 quilt-docs 树（本版本无已发布 QSL/QFAPI 构件，属上游真实状态）。`search_docs({platform:"quilt", version:"1.21.3"})` **两种查询都不会**返回 `PLATFORM_DATA_MISSING`（2026-09-13 逐档实跑 CLI）：① QSL 措辞查询（`query="QSL registry key"`）→ `ok:true` + `fallback:"quilt"` + `resolvedVersion:"1.21.1"` + `semantic:true` + `total:4`——同线已建档语料，不是本版专属正文；`source_version` 与 `resolvedVersion` 在该路径**同为顶层键**（实测 13 键，另含 `requestedVersion` / `query`），二者都是 1.21.1；② 那条路径无此键、只有 `sourcePlatform`。② 普通词查询（`query="registry"`）→ `ok:true` + `fallback:"fabric"` + `sourcePlatform:"fabric"` + `resolvedVersion:"1.21.3"` + `semantic:false` + `total:0`（本版该路径 `warning` 含「语义索引缺库，本次已回退 L0 关键词检索」⇒ 0 命中只证明本仓索引未覆盖），命中面是同版 Fabric 正文，**不能**当 QSL 证据。⇒ 必须逐字读 `fallback` / `sourcePlatform`（仅 ②）/ `source_version`（仅 ①）/ `resolvedVersion` / `semantic` / `total` 再下结论。⚠️ ① 的改口命中含 `1.21.1/qsl-verified`，其**语料正文** `data/quilt_1.21.1/quilt-docs/1.21.1/processed/qsl-verified.md:3` 仍端出已撤回断言（「QSL 已于 2025-12 停更」/ `11.0.0-alpha.3`）——语料受「上游原样」原则保护、不改写 ⇒ 只当背景，QSL 状态结论以源稿 `quilt/1.21.1/knowledge/common/qsl-verified.md:3` 为准。需要同版 Fabric API 写法时改用 `search_docs({platform:"fabric", version:"1.21.3"})`。禁止补抓或从邻版克隆 quilt-docs。

QSL ≠ FAPI。禁止把同版 Fabric 06 当 QSL 网络教程。

- 工程声明了 **QFAPI**（Quilted Fabric API）依赖时，才可对照 FAPI 网络 API（仍须核工程 mappings 与 `search_docs(platform=quilt)`）。
- 无 QFAPI：只许 `search_docs(platform=quilt)`，不要 overlay Fabric 网络全文。
