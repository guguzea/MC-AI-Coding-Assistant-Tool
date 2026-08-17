---
description: 10 — GUI
---

# 10 — GUI

`26.1.2/develop_rendering_gui_custom-screens`：extends `Screen`，override `init`（可选 `extractRenderState` 且必须 super）。
打开：`Minecraft.getInstance().setScreen(new CustomScreen(...))`；关闭 `setScreen(null)`。
当前屏：`Minecraft.getInstance().currentScreen`。
这是 **26.1.2 入库页**；不要用 26.2 博客的 `gui.setScreen` 覆盖本页。

## Decision Flow

```
→ 自定义屏 → Screen + Minecraft.getInstance().setScreen
→ 禁止 gui.setScreen（那是 26.2 旁路，不是本档）
```
