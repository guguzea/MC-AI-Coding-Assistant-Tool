# TextureAtlasSprite

## Class signature

```java
public class TextureAtlasSprite extends java.lang.Object
```

## Constructors

- `protected TextureAtlasSprite(java.lang.String spriteName)`

## Methods

- `protected static TextureAtlasSprite makeAtlasSprite( ResourceLocation spriteResourceLocation)`
- `public static void setLocationNameClock(java.lang.String clockName)`
- `public static void setLocationNameCompass(java.lang.String compassName)`
- `public void initSprite(int inX, int inY, int originInX, int originInY, boolean rotatedIn)`
- `public void copyFrom( TextureAtlasSprite atlasSpirit)`
- `public int getOriginX()`
- `public int getOriginY()`
- `public int getIconWidth()`
- `public int getIconHeight()`
- `public float getMinU()`
- `public float getMaxU()`
- `public float getInterpolatedU(double u)`
- `public float getMinV()`
- `public float getMaxV()`
- `public float getInterpolatedV(double v)`
- `public java.lang.String getIconName()`
- `public void updateAnimation()`
- `public int[][] getFrameTextureData(int index)`
- `public int getFrameCount()`
- `public void setIconWidth(int newWidth)`
- `public void setIconHeight(int newHeight)`
- `public void loadSprite(java.awt.image.BufferedImage[] images, AnimationMetadataSection meta) throws java.io.IOException`
- `public void generateMipmaps(int level)`
- `public void clearFramesTextureData()`
- `public boolean hasAnimationMetadata()`
- `public void setFramesTextureData(java.util.List<int[][]> newFramesTextureData)`
- `public java.lang.String toString()`
- `public boolean hasCustomLoader( IResourceManager manager, ResourceLocation location)`
- `public boolean load( IResourceManager manager, ResourceLocation location)`

## Description

Returns the height of the icon, in pixels.