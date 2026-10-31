---
description: 10 — GUI（26.2）
---

# 10 — GUI（26.2）

`26.2/develop_rendering_gui_custom-screens`：extends `Screen`，override `init`；`extractRenderState` 可选，**必须调 super**，否则背景与 widget 不渲染（该页正文逐字要求）。

- 打开（语料 `:43`）：`Minecraft.getInstance().gui.setScreen(new CustomScreen(Component.empty()))`
- 关闭（语料 `:53`）：`Minecraft.getInstance().gui.setScreen(null)`
- 读当前屏：`Minecraft.getInstance().gui.screen()`
  —— **javap 已核**（`net.minecraft.client.gui.Gui`：`public Screen screen()` / `public void setScreen(Screen)`；`Minecraft`：`public final Gui gui`，**没有** `setScreen` / `currentScreen`）。语料正文没写这句，但类签名有；详见 `knowledge/common/verified-api-26.2.md` 表 B。
- 要「切屏后**立刻刷一帧**」（加载屏 / 阻塞式界面）用 `Minecraft.getInstance().setScreenAndShow(screen)` —— `javap -c` 实测它就是 `gui.setScreen(screen)` + `renderFrame(false)`，**不是** `gui.setScreen` 的替代品（表 F1）。普通开屏仍用 `gui.setScreen`。

## Decision Flow

```
→ 自定义屏 → Screen + Minecraft.getInstance().gui.setScreen(...)
→ 禁止 Minecraft.getInstance().setScreen(...)：26.2 已删（26.1.2 规则里的旧写法）
→ 26.1.2 规则说「gui.setScreen 只是博客旁路、不是本档」——**该断言在 26.2 已失效**，语料正文就是 gui.setScreen
→ widget 在 init 里 addRenderableWidget；构造器里拿不到 width/height
```
