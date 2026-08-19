---
description: 05 — Quilt 事件差异
---

# 05 — Quilt 事件差异

> 默认读 `fabric/1.19.4/.cursor/rules/05-events.mdc`。仅当用户要 **QSL 事件** 或 QFAPI 弃用提示时用本文件。

- QSL 生命周期/注册事件 ≠ `net.fabricmc.fabric.api.event.lifecycle`
- **禁止** `QuiltRegistry.register()`；不要把 FAPI Registry 事件当 QSL
- **禁止**把 `quilt/1.21.1/knowledge/common/qsl-verified.md` 的 `getEntryAddEvent` / `startingServer` 等 1.21 源码名抄进本档（本档未打开对应 QSL 源码）
- 不清楚方法名 → `search_docs({platform:"quilt"})`；无独立树时 QSL 查询会 `PLATFORM_DATA_MISSING`，**不会**回退 Fabric Registry 页
- 通用 Mixin / 数据包问题可回退 Fabric 文档（已过滤 FAPI 专属类）
