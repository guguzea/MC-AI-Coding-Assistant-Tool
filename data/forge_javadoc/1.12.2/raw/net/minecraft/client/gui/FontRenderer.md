---
title: "FontRenderer"
description: "public class FontRenderer extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/gui"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/FontRenderer.html"
sourceType: javadoc
---

# FontRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.gui.FontRenderer

## Class signature

```java
public class FontRenderer extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `FontRenderer(GameSettings gameSettingsIn, ResourceLocation location, TextureManager textureManagerIn, boolean unicode)`

## Methods

- `protected void bindTexture(ResourceLocation location)`
- `protected void doDraw(float f)`
- `void drawSplitString(java.lang.String str, int x, int y, int wrapWidth, int textColor)`
- `int drawString(java.lang.String text, float x, float y, int color, boolean dropShadow)`
- `int drawString(java.lang.String text, int x, int y, int color)`
- `int drawStringWithShadow(java.lang.String text, float x, float y, int color)`
- `protected void enableAlpha()`
- `boolean getBidiFlag()`
- `int getCharWidth(char character)`
- `int getColorCode(char character)`
- `static java.lang.String getFormatFromString(java.lang.String text)`
- `protected IResource getResource(ResourceLocation location)`
- `int getStringWidth(java.lang.String text)`
- `boolean getUnicodeFlag()`
- `int getWordWrappedHeight(java.lang.String str, int maxLength)`
- `java.util.List<java.lang.String> listFormattedStringToWidth(java.lang.String str, int wrapWidth)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `protected float renderDefaultChar(int ch, boolean italic)`
- `protected float renderUnicodeChar(char ch, boolean italic)`
- `void setBidiFlag(boolean bidiFlagIn)`
- `protected void setColor(float r, float g, float b, float a)`
- `void setUnicodeFlag(boolean unicodeFlagIn)`
- `java.lang.String trimStringToWidth(java.lang.String text, int width)`
- `java.lang.String trimStringToWidth(java.lang.String text, int width, boolean reverse)`

## Fields

- `protected int[] charWidth`
- `int FONT_HEIGHT`
- `java.util.Random fontRandom`
- `protected byte[] glyphWidth`
- `protected ResourceLocation locationFontTexture`
- `protected float posX`
- `protected float posY`
