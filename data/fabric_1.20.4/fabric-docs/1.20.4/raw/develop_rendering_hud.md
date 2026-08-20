# Rendering in the Hud

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/1.20.4/develop/rendering/hud.md
> 版本：1.20.4
> GitHub 路径：develop/rendering/hud.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:42:41.613Z
> SHA256：79c63fd0f78517d272a350b7c1dad219abb575ae1bdfcddceafe6479b3d39d3c
> 分支：main

---
title: Rendering in the Hud
description: Learn how to use the HudRenderCallback event to render to the hud.
authors:
  - IMB11

search: false
---

We already briefly touched on rendering things to the hud in the [Basic Rendering Concepts](./basic-concepts) page and [Drawing to the GUI](./gui-graphics), so on this page we'll stick to the `HudRenderCallback` event and the `deltaTick` parameter.

## HudRenderCallback {#hudrendercallback}

The `HudRenderCallback` event - provided by Fabric API - is called every frame, and is used to render things to the HUD.

To register to this event, you can simply call `HudRenderCallback.EVENT.register` and pass in a lambda that takes a `GuiGraphics` and a `float` (deltaTick) as parameters.

The GUI graphics can be used to access the various rendering utilities provided by the game, and access the raw matrix stack. You should check out the [Drawing to the GUI](./gui-graphics) page to learn more about them.

### DeltaTick {#deltatick}

The `deltaTick` parameter is the time since the last frame, in seconds. This can be used to make animations and other time-based effects.

For example, let's say you want to lerp a color over time. You can use the `deltaTick` parameter to do this:

@[code lang=java transcludeWith=:::1](@/reference/1.20.4/src/client/java/com/example/docs/rendering/HudRenderingEntrypoint.java)

![Lerping a color over time](/assets/develop/rendering/hud-rendering-deltatick.webp)
