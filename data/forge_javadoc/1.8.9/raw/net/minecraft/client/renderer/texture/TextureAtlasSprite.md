---
title: "TextureAtlasSprite"
description: "public class TextureAtlasSprite extends java.lang.Object"
package: "net/minecraft/client/renderer/texture"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/texture/TextureAtlasSprite.html"
sourceType: javadoc
---

# TextureAtlasSprite

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.texture.TextureAtlasSprite

## Class signature

```java
public class TextureAtlasSprite extends java.lang.Object
```

## Constructors

- `TextureAtlasSprite(java.lang.String spriteName)`

## Methods

- `void clearFramesTextureData()`
- `void copyFrom(TextureAtlasSprite atlasSpirit)`
- `void generateMipmaps(int level)`
- `int getFrameCount()`
- `int[][] getFrameTextureData(int index)`
- `int getIconHeight()` — Returns the height of the icon, in pixels.
- `java.lang.String getIconName()`
- `int getIconWidth()` — Returns the width of the icon, in pixels.
- `float getInterpolatedU(double u)` — Gets a U coordinate on the icon. 0 returns uMin and 16 returns uMax.
- `float getInterpolatedV(double v)` — Gets a V coordinate on the icon. 0 returns vMin and 16 returns vMax.
- `float getMaxU()` — Returns the maximum U coordinate to use when rendering with this icon.
- `float getMaxV()` — Returns the maximum V coordinate to use when rendering with this icon.
- `float getMinU()` — Returns the minimum U coordinate to use when rendering with this icon.
- `float getMinV()` — Returns the minimum V coordinate to use when rendering with this icon.
- `int getOriginX()` — Returns the X position of this icon on its texture sheet, in pixels.
- `int getOriginY()` — Returns the Y position of this icon on its texture sheet, in pixels.
- `boolean hasAnimationMetadata()`
- `boolean hasCustomLoader(IResourceManager manager, ResourceLocation location)` — The result of this function determines is the below 'load' function is called, and the default vanilla loading code is bypassed completely.
- `void initSprite(int inX, int inY, int originInX, int originInY, boolean rotatedIn)`
- `boolean load(IResourceManager manager, ResourceLocation location)` — Load the specified resource as this sprite's data.
- `void loadSprite(java.awt.image.BufferedImage[] images, AnimationMetadataSection meta)`
- `protected static TextureAtlasSprite makeAtlasSprite(ResourceLocation spriteResourceLocation)`
- `void setFramesTextureData(java.util.List<int[][]> newFramesTextureData)`
- `void setIconHeight(int newHeight)`
- `void setIconWidth(int newWidth)`
- `static void setLocationNameClock(java.lang.String clockName)`
- `static void setLocationNameCompass(java.lang.String compassName)`
- `java.lang.String toString()`
- `void updateAnimation()`

## Fields

- `protected int frameCounter`
- `protected java.util.List<int[][]> framesTextureData`
- `protected int height`
- `protected int[][] interpolatedFrameData`
- `protected int originX`
- `protected int originY`
- `protected boolean rotated`
- `protected int tickCounter`
- `protected int width`
