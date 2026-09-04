---
description: 05 — Quilt 事件差异
---

# 05 — Quilt 事件差异

> ⚠️ **QSL 停更（2025-12 说法 `// TODO(未核实)`：原引官方 FAQ 已 404，无法复核）**：本版本无任何已发布 QSL/QFAPI 构件。下表 API 是**源码树考据，非可编译 API**——禁止生成。事件一律走同版 Fabric API。

> 默认读 `fabric/1.20.4/.cursor/rules/05-events.mdc`。仅当用户要 **QSL 事件** 或 QFAPI 弃用提示时用本文件。

- QSL 生命周期/注册事件 ≠ `net.fabricmc.fabric.api.event.lifecycle`
- **禁止** `QuiltRegistry.register()`；不要把 FAPI Registry 事件当 QSL
- **禁止**把 Quilt 1.21.1 已核的 `RegistryEvents#getEntryAddEvent` / `ServerLifecycleEvents.STARTING` 抄进本档
- 不清楚方法名 → `search_docs({platform:"quilt"})`；无独立树时 QSL 查询会 `PLATFORM_DATA_MISSING`，**不会**回退 Fabric Registry 页
- 通用 Mixin / 数据包问题可回退 Fabric 文档（已过滤 FAPI 专属类）
