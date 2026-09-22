---
title: "GuiUtils"
description: "public class GuiUtils extends java.lang.Object"
package: "net/minecraftforge/fml/client/config"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/client/config/GuiUtils.html"
sourceType: javadoc
---

# GuiUtils

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.config.GuiUtils

## Class signature

```java
public class GuiUtils extends java.lang.Object
```

## Constructors

- `GuiUtils()`

## Methods

- `static void drawContinuousTexturedBox(int x, int y, int u, int v, int width, int height, int textureWidth, int textureHeight, int borderSize, float zLevel)` — Draws a textured box of any size (smallest size is borderSize * 2 square) based on a fixed size textured box with continuous borders and filler.
- `static void drawContinuousTexturedBox(int x, int y, int u, int v, int width, int height, int textureWidth, int textureHeight, int topBorder, int bottomBorder, int leftBorder, int rightBorder, float zLevel)` — Draws a textured box of any size (smallest size is borderSize * 2 square) based on a fixed size textured box with continuous borders and filler.
- `static void drawContinuousTexturedBox(ResourceLocation res, int x, int y, int u, int v, int width, int height, int textureWidth, int textureHeight, int borderSize, float zLevel)` — Draws a textured box of any size (smallest size is borderSize * 2 square) based on a fixed size textured box with continuous borders and filler.
- `static void drawContinuousTexturedBox(ResourceLocation res, int x, int y, int u, int v, int width, int height, int textureWidth, int textureHeight, int topBorder, int bottomBorder, int leftBorder, int rightBorder, float zLevel)` — Draws a textured box of any size (smallest size is borderSize * 2 square) based on a fixed size textured box with continuous borders and filler.
- `static void drawGradientRect(int zLevel, int left, int top, int right, int bottom, int startColor, int endColor)`
- `static void drawHoveringText(java.util.List<java.lang.String> textLines, int mouseX, int mouseY, int screenWidth, int screenHeight, int maxTextWidth, FontRenderer font)` — Draws a tooltip box on the screen with text in it.
- `static void drawTexturedModalRect(int x, int y, int u, int v, int width, int height, float zLevel)`
- `static int getColorCode(char c, boolean isLighter)`

## Fields

- `static int[] colorCodes`
- `static java.lang.String INVALID`
- `static java.lang.String RESET_CHAR`
- `static java.lang.String UNDO_CHAR`
- `static java.lang.String VALID`
