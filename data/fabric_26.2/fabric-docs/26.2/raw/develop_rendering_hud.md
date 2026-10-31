# Rendering in the HUD

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/238533d819fcb5ec9405acb58fb0ac7655df63b1/develop/rendering/hud.md
> 版本：26.2
> GitHub 路径：develop/rendering/hud.md
> 抓取源：github_latest_pinned
> 抓取时间：2026-10-30T17:15:12.606Z
> SHA256：bbe68dd10bbf048986084a5d656fcae7f21452a3ced9b92d702547d2db8fa59a
> 分支：main@238533d819fcb5ec9405acb58fb0ac7655df63b1

---
title: Rendering in the HUD
description: Learn how to use the Fabric Hud API to render to the HUD.
authors:
  - IMB11
  - kevinthegreat1
---

We already briefly touched on rendering things to the HUD in the [Basic Rendering Concepts](./basic-concepts) page and [Drawing to the GUI](./gui-graphics), so on this page we'll stick to the Hud API and the `DeltaTracker` parameter.

## `HudElementRegistry` {#hudelementregistry}

Fabric provides the Hud API to render and layer elements on the HUD.

To start, we need to register a listener to `HudElementRegistry` which registers your elements. Each element is a `HudElement`. A `HudElement` instance is usually a lambda that takes a `GuiGraphicsExtractor` and a `DeltaTracker` instance as parameters. See `HudElementRegistry` and related Javadocs for more details on how to use the API.

The GUI graphics can be used to access the various rendering utilities provided by the game, and access the raw matrix stack. You should check out the [Drawing to the GUI](./gui-graphics) page to learn more about them.

### Delta Tracker {#delta-tracker}

The `DeltaTracker` class allows you to retrieve the current `gameTimeDeltaPartialTick` value. `gameTimeDeltaPartialTick` is the "progress" between the last game tick and the next game tick.

For example, if we assume a 200 FPS scenario, the game runs a new tick roughly every 10 frames. Each frame, `gameTimeDeltaPartialTick` represents how far we are between the last tick and the next. Over 11 frames, you might see:

| Frame | `gameTimeDeltaPartialTick` |
| :---: | -------------------------- |
|  `1`  | `1`: New tick              |
|  `2`  | `1/10 = 0.1`               |
|  `3`  | `2/10 = 0.2`               |
|  `4`  | `3/10 = 0.3`               |
|  `5`  | `4/10 = 0.4`               |
|  `6`  | `5/10 = 0.5`               |
|  `7`  | `6/10 = 0.6`               |
|  `8`  | `7/10 = 0.7`               |
|  `9`  | `8/10 = 0.8`               |
| `10`  | `9/10 = 0.9`               |
| `11`  | `1`: New tick              |

You can retrieve `gameTimeDeltaPartialTick` by calling `deltaTracker.getGameTimeDeltaPartialTick(false)`, where the boolean parameter is `ignoreFreeze`, which essentially just allows you to ignore whenever players use the `/tick freeze` command.

In practice, you should only use `gameTimeDeltaPartialTick` when your animations depend on Minecraft's ticks. For time-based animations, use `Util.getMillis()`, which measures real-world time.

In this example, we'll use `Util.getMillis()` to linearly interpolate the color of a square that is being rendered to the HUD.

<<< @/reference/latest/src/client/java/com/example/docs/rendering/HudRenderingEntrypoint.java#hud

![Lerping a color over time](/assets/develop/rendering/hud-rendering-deltatick.webp)

Why don't you try use `gameTimeDeltaPartialTick` and see what happens to the animation when you run the `/tick freeze` command? You should see the animation freeze in place as `gameTimeDeltaPartialTick` becomes constant, assuming you have passed `false` as the parameter to `DeltaTracker#getGameTimeDeltaPartialTick`.
