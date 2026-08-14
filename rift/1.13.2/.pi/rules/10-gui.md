---
description: 10 — GUI（逐步）
---

# 10 — GUI（逐步）

已打开：`GameGuiAdder.displayGui(EntityPlayerSP, String id, IInteractionObject)` 与 `displayContainerGui(..., IInventory)`。
HUD 叠加：`OverlayRenderer.renderOverlay()`。
按键：`KeyBindingAdder.getKeyBindings()` + `KeybindHandler.processKeybinds()`。

## 逐步

1. 容器 GUI：实现 `GameGuiAdder`，用 **String id** 打开（不是 1.16 `MenuType` / `AbstractContainerScreen`）。
2. 纯 HUD：`OverlayRenderer`。
3. 具体 `GuiScreen` 子类名以 1.13 客户端源码为准；表外禁止输出。
