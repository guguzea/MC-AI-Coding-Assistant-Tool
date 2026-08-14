---
description: 09 — 反模式
---

# 09 — 反模式

- 写成 `rift.mod.json` 当唯一官方名（仅兼容误写）
- 用 Fabric `onInitialize` / `ServerPlayNetworking`
- 写死已死的 dimdev maven 且无 libs/ 备用
- 回退 Fabric 文档树或 1.16+ Screen
- 调用 `generate_datagen`
- 继续用已 Deprecated 的 `CustomPayloadHandler` 写新包（改 `MessageAdder`）
