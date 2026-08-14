---
description: 06 — 网络
---

# 06 — 网络

安全表未收录独立数据包 API → **禁止臆造 SimpleChannel / IMessage**。

## 该时代做法

用 tick 钩子同步表现：`ModLoader.setInGameHook(this, true, true)`（见 `safe-api.md`）。
需要真正自定义包时：停，补表或提供 1.6.4 MCP/`decompile_mod_jar`（摘要须含 `mappingsVersion`）。
