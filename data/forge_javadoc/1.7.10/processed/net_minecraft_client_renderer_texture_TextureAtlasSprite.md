# TextureAtlasSprite

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.texture.TextureAtlasSprite

## Class signature

```java
public class TextureAtlasSprite extends java.lang.Object implements IIcon
```

## Constructors

- `TextureAtlasSprite(java.lang.String p_i1282_1_)`

## Methods

- `void clearFramesTextureData()`
- `void copyFrom(TextureAtlasSprite p_94217_1_)`
- `void generateMipmaps(int p_147963_1_)`
- `int getFrameCount()`
- `int[][] getFrameTextureData(int p_147965_1_)`
- `int getIconHeight()`
- `java.lang.String getIconName()`
- `int getIconWidth()`
- `float getInterpolatedU(double p_94214_1_)`
- `float getInterpolatedV(double p_94207_1_)`
- `float getMaxU()`
- `float getMaxV()`
- `float getMinU()`
- `float getMinV()`
- `int getOriginX()`
- `int getOriginY()`
- `boolean hasAnimationMetadata()`
- `void initSprite(int p_110971_1_, int p_110971_2_, int p_110971_3_, int p_110971_4_, boolean p_110971_5_)`
- `void loadSprite(java.awt.image.BufferedImage[] p_147964_1_, AnimationMetadataSection p_147964_2_, boolean p_147964_3_)`
- `void setFramesTextureData(java.util.List p_110968_1_)`
- `void setIconHeight(int p_110969_1_)`
- `void setIconWidth(int p_110966_1_)`
- `java.lang.String toString()`
- `void updateAnimation()`

## Fields

- `protected int frameCounter`
- `protected java.util.List framesTextureData`
- `protected int height`
- `protected int originX`
- `protected int originY`
- `protected boolean rotated`
- `protected int tickCounter`
- `protected int width`