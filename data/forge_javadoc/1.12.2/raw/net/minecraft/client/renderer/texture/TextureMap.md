---
title: "TextureMap"
description: "Grabs the registered entry for the specified name, returning null if there was not a entry."
package: "net/minecraft/client/renderer/texture"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/texture/TextureMap.html"
sourceType: javadoc
---

# TextureMap

## Class signature

```java
public class TextureMap extends AbstractTexture implements ITickableTextureObject
```

## Constructors

- `public TextureMap(java.lang.String basePathIn)`
- `public TextureMap(java.lang.String basePathIn, ITextureMapPopulator iconCreatorIn)`
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
- `public boolean setTextureEntry( TextureAtlasSprite entry)`
- `public java.lang.String getBasePath()`
- `public int getMipmapLevels()`

## Description

Grabs the registered entry for the specified name, returning null if there was not a entry.
