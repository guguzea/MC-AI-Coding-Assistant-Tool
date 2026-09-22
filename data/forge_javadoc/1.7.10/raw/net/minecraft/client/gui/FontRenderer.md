---
title: "FontRenderer"
description: "public class FontRenderer extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/gui"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/gui/FontRenderer.html"
sourceType: javadoc
---

# FontRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.gui.FontRenderer

## Class signature

```java
public class FontRenderer extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `FontRenderer(GameSettings p_i1035_1_, ResourceLocation p_i1035_2_, TextureManager p_i1035_3_, boolean p_i1035_4_)`

## Methods

- `protected void bindTexture(ResourceLocation location)`
- `protected void doDraw(float f)`
- `void drawSplitString(java.lang.String p_78279_1_, int p_78279_2_, int p_78279_3_, int p_78279_4_, int p_78279_5_)`
- `int drawString(java.lang.String p_78276_1_, int p_78276_2_, int p_78276_3_, int p_78276_4_)`
- `int drawString(java.lang.String p_85187_1_, int p_85187_2_, int p_85187_3_, int p_85187_4_, boolean p_85187_5_)`
- `int drawStringWithShadow(java.lang.String p_78261_1_, int p_78261_2_, int p_78261_3_, int p_78261_4_)`
- `protected void enableAlpha()`
- `boolean getBidiFlag()`
- `int getCharWidth(char p_78263_1_)`
- `protected java.io.InputStream getResourceInputStream(ResourceLocation location)`
- `int getStringWidth(java.lang.String p_78256_1_)`
- `boolean getUnicodeFlag()`
- `java.util.List listFormattedStringToWidth(java.lang.String p_78271_1_, int p_78271_2_)`
- `void onResourceManagerReload(IResourceManager p_110549_1_)`
- `protected float renderDefaultChar(int p_78266_1_, boolean p_78266_2_)`
- `protected float renderUnicodeChar(char p_78277_1_, boolean p_78277_2_)`
- `void setBidiFlag(boolean p_78275_1_)`
- `protected void setColor(float r, float g, float b, float a)`
- `void setUnicodeFlag(boolean p_78264_1_)`
- `int splitStringWidth(java.lang.String p_78267_1_, int p_78267_2_)`
- `java.lang.String trimStringToWidth(java.lang.String p_78269_1_, int p_78269_2_)`
- `java.lang.String trimStringToWidth(java.lang.String p_78262_1_, int p_78262_2_, boolean p_78262_3_)`

## Fields

- `protected int[] charWidth`
- `int FONT_HEIGHT`
- `java.util.Random fontRandom`
- `protected byte[] glyphWidth`
- `protected ResourceLocation locationFontTexture`
- `protected float posX`
- `protected float posY`
