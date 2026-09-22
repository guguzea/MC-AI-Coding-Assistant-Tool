---
title: "RenderTooltipEvent"
description: "public abstract class RenderTooltipEvent extends Event"
package: "net/minecraftforge/client/event"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/event/RenderTooltipEvent.html"
sourceType: javadoc
---

# RenderTooltipEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.RenderTooltipEvent

## Class signature

```java
public abstract class RenderTooltipEvent extends Event
```

## Constructors

- `RenderTooltipEvent(ItemStack stack, java.util.List<java.lang.String> lines, int x, int y, FontRenderer fr)`

## Methods

- `FontRenderer getFontRenderer()`
- `java.util.List<java.lang.String> getLines()` — The lines to be drawn.
- `ItemStack getStack()`
- `int getX()`
- `int getY()`

## Fields

- `protected FontRenderer fr`
- `protected java.util.List<java.lang.String> lines`
- `protected ItemStack stack`
- `protected int x`
- `protected int y`
