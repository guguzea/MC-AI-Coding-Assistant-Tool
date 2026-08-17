---
description: 05 — 事件
---

# 05 — 事件

`26.1.2/develop_events`：`net.fabricmc.fabric.api.event.Event`，回调 `register()`。
示例：`AttackBlockCallback`、`LootTableEvents.MODIFY`。
不要用 Forge `@SubscribeEvent`。

## Decision Flow

```
→ Fabric 事件 → Event.register
→ 不要 @SubscribeEvent / IEventBus
→ 核不到 → search_fabric_docs version=26.1.2
```
