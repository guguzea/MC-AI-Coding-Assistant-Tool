---
name: mc-events
description: Quilt 1.21.1 mc-events（QSL 已停更，本档无可用构件）。事件走同版 Fabric API。
platform: quilt
version: "1.21.1"
dependencies: []
docsTool: search_docs
---

# mc-events（Quilt 1.21.1）

> ⚠️ **QSL 已于 2025-12 停更（官方 FAQ 实证），本版本不存在任何已发布 QSL/QFAPI 构件。** `knowledge/common/qsl-verified.md` 是源码树考据，非可编译 API。

事件一律用**同版 Fabric API**（02–10 读 fabric/1.21.1 overlay）：`net.fabricmc.fabric.api.event.lifecycle` 的 `ServerLifecycleEvents` / `ClientLifecycleEvents` 等，签名以 `fabric/1.21.1` 档为准。

必须 search_docs({platform:"quilt"}) 且 version=1.21.1。qsl-verified.md 中的 ServerLifecycleEvents / ClientLifecycleEvents 等条目**仅为考据，禁止生成代码**；无方法签名则只作方向，禁止默写 FAPI AttackBlockCallback 当 QSL。
