# GuiUtils

## Class signature

```java
public class GuiUtils extends java.lang.Object
```

## Constructors

- `public GuiUtils()`

## Methods

- `public static int getColorCode(char c, boolean isLighter)`
- `public static void drawContinuousTexturedBox(int x, int y, int u, int v, int width, int height, int textureWidth, int textureHeight, int borderSize, float zLevel)`
- `public static void drawContinuousTexturedBox( ResourceLocation res, int x, int y, int u, int v, int width, int height, int textureWidth, int textureHeight, int borderSize, float zLevel)`
- `public static void drawContinuousTexturedBox( ResourceLocation res, int x, int y, int u, int v, int width, int height, int textureWidth, int textureHeight, int topBorder, int bottomBorder, int leftBorder, int rightBorder, float zLevel)`
- `public static void drawContinuousTexturedBox(int x, int y, int u, int v, int width, int height, int textureWidth, int textureHeight, int topBorder, int bottomBorder, int leftBorder, int rightBorder, float zLevel)`
- `public static void drawTexturedModalRect(int x, int y, int u, int v, int width, int height, float zLevel)`
- `public static void preItemToolTip( ItemStack stack)`
- `public static void postItemToolTip()`
- `public static void drawHoveringText(java.util.List<java.lang.String> textLines, int mouseX, int mouseY, int screenWidth, int screenHeight, int maxTextWidth, FontRenderer font)`
- `public static void drawHoveringText( ItemStack stack, java.util.List<java.lang.String> textLines, int mouseX, int mouseY, int screenWidth, int screenHeight, int maxTextWidth, FontRenderer font)`
- `public static void drawGradientRect(int zLevel, int left, int top, int right, int bottom, int startColor, int endColor)`

## Description

This class provides several methods and constants used by the Config GUI classes.