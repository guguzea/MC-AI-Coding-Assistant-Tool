# TextureMap

## Class signature

```java
public class TextureMap extends AbstractTexture implements ITickableTextureObject
```

## Constructors

- `public TextureMap(java.lang.String p_i46099_1_)`
- `public TextureMap(java.lang.String p_i46100_1_, IIconCreator iconCreatorIn)`
- `public TextureMap(java.lang.String p_i46100_1_, boolean skipFirst)`
- `public TextureMap(java.lang.String p_i46100_1_, IIconCreator iconCreatorIn, boolean skipFirst)`

## Methods

- `public void loadTexture( IResourceManager resourceManager) throws java.io.IOException`
- `public void loadSprites( IResourceManager resourceManager, IIconCreator p_174943_2_)`
- `public void loadTextureAtlas( IResourceManager resourceManager)`
- `public TextureAtlasSprite getAtlasSprite(java.lang.String iconName)`
- `public void updateAnimations()`
- `public TextureAtlasSprite registerSprite( ResourceLocation location)`
- `public void tick()`
- `public void setMipmapLevels(int mipmapLevelsIn)`
- `public TextureAtlasSprite getMissingSprite()`
- `public TextureAtlasSprite getTextureExtry(java.lang.String name)`
- `public boolean setTextureEntry(java.lang.String name, TextureAtlasSprite entry)`

## Description

Grabs the registered entry for the specified name, returning null if there was not a entry.