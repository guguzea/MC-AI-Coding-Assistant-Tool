---
description: 08 — 客户端
---

# 08 — 客户端

LiteLoader 是客户端加载器。HUD/Render/Viewport 接口见 `verified-api.md`。
不要在所谓「服务端」线程调 `Minecraft.getMinecraft()` 记忆（1.12 客户端单例是 `Minecraft.getMinecraft()`，以 MCP 1.12.2 为准）。
混合工程服务端逻辑走 Forge 1.12.2。
