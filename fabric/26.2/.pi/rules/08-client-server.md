---
description: 08 — 物理端（26.2）
---

# 08 — 物理端（26.2）

入口分 main / client（`fabric.mod.json` 的 entrypoints）。按键 `26.2/develop_key-mappings`。Mixin `26.2/develop_mixins_bytecode`。
客户端渲染 `26.2/develop_rendering_basic-concepts`、`26.2/develop_rendering_world`、HUD `26.2/develop_rendering_hud`。不要在服务端调 `Minecraft.getInstance()`。

**26.2 客户端三处硬变更**（都不是「惯例」，是删了）：

1. 开屏：`Minecraft.getInstance().gui.setScreen(...)`（语料 `26.2/develop_rendering_gui_custom-screens:43`）
2. 截图：`Screenshot.grab(Minecraft, boolean)` 取代 `Minecraft.getMainRenderTarget()`（javap 实测，`mcp-server/src/generators/playtest-driver.ts:565-570`）
3. 点击：`mouseClicked(MouseButtonEvent, boolean)`（同上 `:584-589`）

渲染后端：26.2 起有 Vulkan，**由玩家在 options 菜单里切换**（NeoForge Primer 26.2 原文）；raw OpenGL 不受支持，mod 只写 `Blaze3D` 通用层（`26.2/develop_rendering_basic-concepts:15`）。
`com.mojang.blaze3d.opengl` 与 `blaze3d.vulkan` 是**功能平行**的两套实现（`GlDevice`↔`VulkanDevice`、`GlCommandEncoder`↔`VulkanCommandEncoder`、`GlRenderPipeline`↔`VulkanRenderPipeline`…；本机 `jar tf` 实测 28 vs 40 类，同名只有 `package-info`）—— **禁止**在业务代码里直接调 `VulkanDevice` / `GlDevice` 这类后端类，那是引擎内部实现。

## Decision Flow

```
→ 逻辑 → main entrypoint
→ 渲染/按键/Screen → client entrypoint（Screen 用 gui.setScreen）
→ Mixin → mixins_bytecode；deep 校验用 mixin_analyze
→ 渲染 → Blaze3D abstraction，不要直接 GL
```
