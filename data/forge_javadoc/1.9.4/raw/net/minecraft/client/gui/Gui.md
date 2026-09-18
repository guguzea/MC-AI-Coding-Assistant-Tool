---
title: "Gui"
description: "public class Gui extends java.lang.Object"
package: "net/minecraft/client/gui"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/gui/Gui.html"
sourceType: javadoc
---

# Gui

## Class signature

```java
public class Gui extends java.lang.Object
```

## Constructors

- `public Gui()`

## Methods

- `protected void drawHorizontalLine(int startX, int endX, int y, int color)`
- `protected void drawVerticalLine(int x, int startY, int endY, int color)`
- `public static void drawRect(int left, int top, int right, int bottom, int color)`
- `protected void drawGradientRect(int left, int top, int right, int bottom, int startColor, int endColor)`
- `public void drawCenteredString( FontRenderer fontRendererIn, java.lang.String text, int x, int y, int color)`
- `public void drawString( FontRenderer fontRendererIn, java.lang.String text, int x, int y, int color)`
- `public void drawTexturedModalRect(int x, int y, int textureX, int textureY, int width, int height)`
- `public void drawTexturedModalRect(float xCoord, float yCoord, int minU, int minV, int maxU, int maxV)`
- `public void drawTexturedModalRect(int xCoord, int yCoord, TextureAtlasSprite textureSprite, int widthIn, int heightIn)`
- `public static void drawModalRectWithCustomSizedTexture(int x, int y, float u, float v, int width, int height, float textureWidth, float textureHeight)`
- `public static void drawScaledCustomSizeModalRect(int x, int y, float u, float v, int uWidth, int vHeight, int width, int height, float tileWidth, float tileHeight)`
