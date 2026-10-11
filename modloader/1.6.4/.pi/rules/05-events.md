---
description: 05 — 钩子
---

# 05 — 钩子

| 方法 | 用途 |
|------|------|
| `ModLoader.setInGameHook(BaseMod, boolean, boolean)` | 游戏内 tick |
| `ModLoader.setInGUIHook(BaseMod, boolean, boolean)` | GUI 钩子 |
| `BaseMod.onTickInGame(float, Minecraft)` / `onTickInGUI(float, Minecraft, GuiScreen)` | **回调实名**（构件复核；返回 boolean，语义未核） |

不要编造 Forge `@SubscribeEvent`。
