---
name: mc-networking
description: Quilt 1.20.4 mc-networking（QSL 差异）。名字只来自本档 qsl-verified.md。
platform: quilt
version: "1.20.4"
dependencies: []
docsTool: search_docs
---

# mc-networking（Quilt 1.20.4）

> ⚠️ **QSL 停更（2025-12 说法 `// TODO(未核实)`：原引官方 FAQ 已 404，无法复核）**：本版本无任何已发布 QSL/QFAPI 构件。本文件中的 QSL API 全部是**源码树考据，非可编译 API**——禁止生成。

核实表：knowledge/common/qsl-verified.md。
必须 search_docs({platform:"quilt"}) 且 version=1.20.4。06 用本目录短规则；02–04/07–08/10 overlay Fabric 1.20.4。

QSL Networking API 以 README / qsl-verified 为准。search_docs({platform:"quilt"}) version=1.20.4。

禁止 ServerPlayNetworking / Fabric PayloadTypeRegistry 当 QSL。核不到通道 API 则禁止输出。
