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
- `java.util.Collection<ResourceLocation> getDependencies()`
- `int getFrameCount()`
- `int[][] getFrameTextureData(int index)`
- `int getIconHeight()`
- `java.lang.String getIconName()`
- `int getIconWidth()`
- `float getInterpolatedU(double u)`
- `float getInterpolatedV(double v)`
- `float getMaxU()`
- `float getMaxV()`
- `float getMinU()`
- `float getMinV()`
- `int getOriginX()`
- `int getOriginY()`
- `float getUnInterpolatedU(float u)`
- `float getUnInterpolatedV(float p_188536_1_)`
- `boolean hasAnimationMetadata()`
- `boolean hasCustomLoader(IResourceManager manager, ResourceLocation location)` — The result of this function determines is the below 'load' function is called, and the default vanilla loading code is bypassed completely.
- `void initSprite(int inX, int inY, int originInX, int originInY, boolean rotatedIn)`
- `boolean load(IResourceManager manager, ResourceLocation location, java.util.function.Function<ResourceLocation, TextureAtlasSprite> textureGetter)` — Load the specified resource as this sprite's data.
- `void loadSprite(PngSizeInfo sizeInfo, boolean p_188538_2_)`
- `void loadSpriteFrames(IResource resource, int mipmaplevels)`
- `protected static TextureAtlasSprite makeAtlasSprite(ResourceLocation spriteResourceLocation)`
- `void setFramesTextureData(java.util.List<int[][]> newFramesTextureData)`
- `void setIconHeight(int newHeight)`
- `void setIconWidth(int newWidth)`
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