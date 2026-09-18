---
title: "RenderTooltipEvent.Pre"
description: "This event is fired before any tooltip calculations are done. It provides setters for all aspects of the tooltip, so the final render can be modified. This event is Cancelable ."
package: "net/minecraftforge/client/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/event/RenderTooltipEvent.Pre.html"
sourceType: javadoc
---

# RenderTooltipEvent.Pre

## Constructors

- `public Pre(@Nullable ItemStack stack, @Nonnull java.util.List<java.lang.String> lines, int x, int y, int screenWidth, int screenHeight, int maxWidth, @Nonnull FontRenderer fr)`

## Methods

- `public int getScreenWidth()`
- `public void setScreenWidth(int screenWidth)`
- `public int getScreenHeight()`
- `public void setScreenHeight(int screenHeight)`
- `public int getMaxWidth()`
- `public void setMaxWidth(int maxWidth)`
- `public void setFontRenderer(@Nonnull FontRenderer fr)`
- `public void setX(int x)`
- `public void setY(int y)`

## Description

This event is fired before any tooltip calculations are done. It provides setters for all aspects of the tooltip, so the final render can be modified. This event is Cancelable .
