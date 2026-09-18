---
title: "RenderTooltipEvent"
description: "A set of events which are fired at various points during tooltip rendering. Can be used to change the rendering parameters, draw something extra, etc. Do not use this event directly, use one of the su"
package: "net/minecraftforge/client/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/event/RenderTooltipEvent.html"
sourceType: javadoc
---

# RenderTooltipEvent

## Class signature

```java
public abstract class RenderTooltipEvent extends Event
```

## Constructors

- `public RenderTooltipEvent(@Nullable ItemStack stack, @Nonnull java.util.List<java.lang.String> lines, int x, int y, @Nonnull FontRenderer fr)`

## Methods

- `@Nullable public ItemStack getStack()`
- `@Nonnull public java.util.List<java.lang.String> getLines()`
- `public int getX()`
- `public int getY()`
- `@Nonnull public FontRenderer getFontRenderer()`

## Description

A set of events which are fired at various points during tooltip rendering. Can be used to change the rendering parameters, draw something extra, etc. Do not use this event directly, use one of the su
