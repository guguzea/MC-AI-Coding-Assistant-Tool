---
description: 05 — Quilt 事件差异
---

# 05 — Quilt 事件差异

> 默认读 `fabric/1.21.10/.cursor/rules/05-events.mdc`。仅当用户要 **QSL 事件** 或 QFAPI 弃用提示时用本文件。

- QSL 生命周期/注册事件 ≠ `net.fabricmc.fabric.api.event.lifecycle`
- **禁止** `QuiltRegistry.register()`；不要把 FAPI Registry 事件当 QSL
- **禁止**把 Quilt 1.21.1 `qsl-verified.md` 的字段名直接当 1.21.10 QSL。本档方法名以 `search_docs({platform:"quilt"})` / 已打开 QSL 源码为准
- 不清楚方法名 → `search_docs({platform:"quilt"})`；**不会**回退 Fabric Registry 页当 QSL
