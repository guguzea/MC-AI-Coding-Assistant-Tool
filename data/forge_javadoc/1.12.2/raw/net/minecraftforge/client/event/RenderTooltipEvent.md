---
title: "RenderTooltipEvent"
description: "A set of events which are fired at various points during tooltip rendering. Can be used to change the rendering parameters, draw something extra, etc. Do not use this event directly, use one of the su"
package: "net/minecraftforge/client/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/event/RenderTooltipEvent.html"
sourceType: javadoc
---

# RenderTooltipEvent

## Class signature

```java
public abstract class RenderTooltipEvent extends Event
```

## Constructors

- `public RenderTooltipEvent( ItemStack stack, java.util.List<java.lang.String> lines, int x, int y, FontRenderer fr)`

## Methods

- `public ItemStack getStack()`
- `public java.util.List<java.lang.String> getLines()`
- `public int getX()`
- `public int getY()`
- `public FontRenderer getFontRenderer()`

## Description

A set of events which are fired at various points during tooltip rendering. Can be used to change the rendering parameters, draw something extra, etc. Do not use this event directly, use one of the su
