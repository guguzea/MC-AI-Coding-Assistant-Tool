---
title: "Gui"
description: "public class Gui extends java.lang.Object"
package: "net/minecraft/client/gui"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/Gui.html"
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

- `void drawCenteredString(FontRenderer fontRendererIn, java.lang.String text, int x, int y, int color)` — Renders the specified text to the screen, center-aligned.
- `protected void drawGradientRect(int left, int top, int right, int bottom, int startColor, int endColor)` — Draws a rectangle with a vertical gradient between the specified colors (ARGB format).
- `protected void drawHorizontalLine(int startX, int endX, int y, int color)` — Draw a 1 pixel wide horizontal line.
- `static void drawModalRectWithCustomSizedTexture(int x, int y, float u, float v, int width, int height, float textureWidth, float textureHeight)` — Draws a textured rectangle at z = 0.
- `static void drawRect(int left, int top, int right, int bottom, int color)` — Draws a solid color rectangle with the specified coordinates and color (ARGB format).
- `static void drawScaledCustomSizeModalRect(int x, int y, float u, float v, int uWidth, int vHeight, int width, int height, float tileWidth, float tileHeight)` — Draws a scaled, textured, tiled modal rect at z = 0.
- `void drawString(FontRenderer fontRendererIn, java.lang.String text, int x, int y, int color)` — Renders the specified text to the screen.
- `void drawTexturedModalRect(float xCoord, float yCoord, int minU, int minV, int maxU, int maxV)` — Draws a textured rectangle using the texture currently bound to the TextureManager
- `void drawTexturedModalRect(int x, int y, int textureX, int textureY, int width, int height)` — Draws a textured rectangle at the stored z-value.
- `void drawTexturedModalRect(int xCoord, int yCoord, TextureAtlasSprite textureSprite, int widthIn, int heightIn)` — Draws a texture rectangle using the texture currently bound to the TextureManager
- `protected void drawVerticalLine(int x, int startY, int endY, int color)` — Draw a 1 pixel wide vertical line.

## Fields

- `static ResourceLocation icons`
- `static ResourceLocation optionsBackground`
- `static ResourceLocation statIcons`
- `protected float zLevel`
