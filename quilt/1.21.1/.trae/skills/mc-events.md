---
name: mc-events
description: Quilt 1.21.1 mc-events（QSL 1.21 线仅 alpha、无正式版）。事件走同版 Fabric API。
platform: quilt
version: "1.21.1"
dependencies: []
docsTool: search_docs
---

# mc-events（Quilt 1.21.1）

> ⚠️ **QSL 已于 2025-12 停更（`// TODO(未核实)`：原引官方 FAQ 已 404，无法复核）；本档 1.21 线只有 alpha 构件（`10.0.0-alpha.5+1.21.1`），无正式版。** `knowledge/common/qsl-verified.md` 的 lifecycle / registry 符号已由该 alpha 构件 javap 逐字实证；仍无正式版 ⇒ 默认不生成（要用须用户显式确认接受 alpha 依赖）。

事件一律用**同版 Fabric API**（02–10 读 fabric/1.21.1 overlay）：`net.fabricmc.fabric.api.event.lifecycle` 的 `ServerLifecycleEvents` / `ClientLifecycleEvents` 等，签名以 `fabric/1.21.1` 档为准。

必须 search_docs({platform:"quilt"}) 且 version=1.21.1。qsl-verified.md 中的 ServerLifecycleEvents / ClientLifecycleEvents 等条目已构件实证（alpha 构件逐字在场），但**默认不生成代码**（要用须用户显式确认接受 alpha 依赖）；无方法签名则只作方向，禁止默写 FAPI AttackBlockCallback 当 QSL。
