---
description: 06-networking Quilt
globs:
alwaysApply: false
---

# 06 — 网络

QSL ≠ FAPI。禁止把同版 Fabric 06 当 QSL 网络教程。

- 工程声明了 **QFAPI**（Quilted Fabric API）依赖时，才可对照 FAPI 网络 API（仍须核工程 mappings 与 `search_docs(platform=quilt)`）。
- 无 QFAPI：只许 `search_docs(platform=quilt)`，不要 overlay Fabric 网络全文。
- ⚠️ **本版无 QFAPI/QSL 构件**（release/snapshot 两线均无本版件，见 AGENTS 横幅）⇒ 上一条「无 QFAPI」的用意是**防把 QSL 旧表当本版 API**，不是禁 FAPI——本版的做法是**直接依赖 Fabric API 本体**（联网实证 1.21.11 线：`jade` / `owo-lib` 的 quilt 构建均声明 `fabric-api` required；Quilt Loader 加载 Fabric 模组）；名字与流程核 `search_docs({platform:"fabric", version:"1.21.11"})`，并**仍不得把 FAPI 名当 QSL**。
