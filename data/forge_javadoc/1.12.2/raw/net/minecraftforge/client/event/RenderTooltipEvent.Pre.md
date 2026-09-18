---
title: "RenderTooltipEvent.Pre"
description: "This event is fired before any tooltip calculations are done. It provides setters for all aspects of the tooltip, so the final render can be modified. This event is Cancelable ."
package: "net/minecraftforge/client/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/event/RenderTooltipEvent.Pre.html"
sourceType: javadoc
---

# RenderTooltipEvent.Pre

## Constructors

- `public Pre( ItemStack stack, java.util.List<java.lang.String> lines, int x, int y, int screenWidth, int screenHeight, int maxWidth, FontRenderer fr)`

## Methods

- `public int getScreenWidth()`
- `public void setScreenWidth(int screenWidth)`
- `public int getScreenHeight()`
- `public void setScreenHeight(int screenHeight)`
- `public int getMaxWidth()`
- `public void setMaxWidth(int maxWidth)`
- `public void setFontRenderer( FontRenderer fr)`
- `public void setX(int x)`
- `public void setY(int y)`

## Description

This event is fired before any tooltip calculations are done. It provides setters for all aspects of the tooltip, so the final render can be modified. This event is Cancelable .
