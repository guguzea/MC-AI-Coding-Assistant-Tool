---
name: mc-events
description: Quilt 1.20.4 mc-events（QSL 差异）。名字只来自本档 qsl-verified.md。
platform: quilt
version: "1.20.4"
dependencies: []
docsTool: search_docs
---

# mc-events（Quilt 1.20.4）

> ⚠️ **QSL 停更（2025-12 说法 `// TODO(未核实)`：原引官方 FAQ 已 404，无法复核）**：本版本无任何已发布 QSL/QFAPI 构件。本文件中的 QSL API 全部是**源码树考据，非可编译 API**——禁止生成。

核实表：knowledge/common/qsl-verified.md。
必须 search_docs({platform:"quilt"}) 且 version=1.20.4。02–10 仍读 fabric/1.20.4 overlay。

QSL Event API / Lifecycle 以该档 qsl-verified.md 为准。search_docs({platform:"quilt"}) version=1.20.4。

无方法签名则只作方向，禁止默写 FAPI AttackBlockCallback 当 QSL。
1.21.1 已核实 ServerLifecycleEvents / ClientLifecycleEvents 的，只允许写进 1.21.1 档。
