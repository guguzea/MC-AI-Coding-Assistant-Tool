# TextureMap

## Class signature

```java
public class TextureMap extends AbstractTexture implements ITickableTextureObject
```

## Constructors

- `public TextureMap(java.lang.String basePathIn)`
- `public TextureMap(java.lang.String basePathIn, @Nullable ITextureMapPopulator iconCreatorIn)`
- `public TextureMap(java.lang.String basePathIn, boolean skipFirst)`
- `public TextureMap(java.lang.String basePathIn, ITextureMapPopulator iconCreatorIn, boolean skipFirst)`

## Methods

- `public void loadTexture( IResourceManager resourceManager) throws java.io.IOException`
- `public void loadSprites( IResourceManager resourceManager, ITextureMapPopulator iconCreatorIn)`
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