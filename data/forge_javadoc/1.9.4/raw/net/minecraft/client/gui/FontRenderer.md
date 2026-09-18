---
title: "FontRenderer"
description: "public class FontRenderer extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/gui"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/gui/FontRenderer.html"
sourceType: javadoc
---

# FontRenderer

## Class signature

```java
public class FontRenderer extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `public FontRenderer( GameSettings gameSettingsIn, ResourceLocation location, TextureManager textureManagerIn, boolean unicode)`

## Methods

- `public void onResourceManagerReload( IResourceManager resourceManager)`
- `protected float renderDefaultChar(int ch, boolean italic)`
- `protected float renderUnicodeChar(char ch, boolean italic)`
- `public int drawStringWithShadow(java.lang.String text, float x, float y, int color)`
- `public int drawString(java.lang.String text, int x, int y, int color)`
- `public int drawString(java.lang.String text, float x, float y, int color, boolean dropShadow)`
- `protected void doDraw(float f)`
- `public int getStringWidth(java.lang.String text)`
- `public int getCharWidth(char character)`
- `public java.lang.String trimStringToWidth(java.lang.String text, int width)`
- `public java.lang.String trimStringToWidth(java.lang.String text, int width, boolean reverse)`
- `public void drawSplitString(java.lang.String str, int x, int y, int wrapWidth, int textColor)`
- `public int splitStringWidth(java.lang.String str, int maxLength)`
- `public void setUnicodeFlag(boolean unicodeFlagIn)`
- `public boolean getUnicodeFlag()`
- `public void setBidiFlag(boolean bidiFlagIn)`
- `public java.util.List<java.lang.String> listFormattedStringToWidth(java.lang.String str, int wrapWidth)`
- `public static java.lang.String getFormatFromString(java.lang.String text)`
- `public boolean getBidiFlag()`
- `protected void setColor(float r, float g, float b, float a)`
- `protected void enableAlpha()`
- `protected void bindTexture( ResourceLocation location)`
- `protected IResource getResource( ResourceLocation location) throws java.io.IOException`
- `public int getColorCode(char character)`
