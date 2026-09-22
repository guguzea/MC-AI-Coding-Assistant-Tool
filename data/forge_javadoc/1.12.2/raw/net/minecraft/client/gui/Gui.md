---
title: "Gui"
description: "public class Gui extends java.lang.Object"
package: "net/minecraft/client/gui"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/Gui.html"
sourceType: javadoc
---

# Gui

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui

## Class signature

```java
public class Gui extends java.lang.Object
```

## Constructors

- `Gui()`

## Methods

- `void drawCenteredString(FontRenderer fontRendererIn, java.lang.String text, int x, int y, int color)`
- `protected void drawGradientRect(int left, int top, int right, int bottom, int startColor, int endColor)`
- `protected void drawHorizontalLine(int startX, int endX, int y, int color)`
- `static void drawModalRectWithCustomSizedTexture(int x, int y, float u, float v, int width, int height, float textureWidth, float textureHeight)`
- `static void drawRect(int left, int top, int right, int bottom, int color)`
- `static void drawScaledCustomSizeModalRect(int x, int y, float u, float v, int uWidth, int vHeight, int width, int height, float tileWidth, float tileHeight)`
- `void drawString(FontRenderer fontRendererIn, java.lang.String text, int x, int y, int color)`
- `void drawTexturedModalRect(float xCoord, float yCoord, int minU, int minV, int maxU, int maxV)`
- `void drawTexturedModalRect(int x, int y, int textureX, int textureY, int width, int height)`
- `void drawTexturedModalRect(int xCoord, int yCoord, TextureAtlasSprite textureSprite, int widthIn, int heightIn)`
- `protected void drawVerticalLine(int x, int startY, int endY, int color)`

## Fields

- `static ResourceLocation ICONS`
- `static ResourceLocation OPTIONS_BACKGROUND`
- `static ResourceLocation STAT_ICONS`
- `protected float zLevel`
