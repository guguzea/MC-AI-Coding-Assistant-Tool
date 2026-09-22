---
title: "TextureMap"
description: "public class TextureMap extends AbstractTexture implements ITickableTextureObject"
package: "net/minecraft/client/renderer/texture"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/texture/TextureMap.html"
sourceType: javadoc
---

# TextureMap

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.texture.AbstractTexture → net.minecraft.client.renderer.texture.TextureMap

## Class signature

```java
public class TextureMap extends AbstractTexture implements ITickableTextureObject
```

## Constructors

- `TextureMap(java.lang.String basePathIn)`
- `TextureMap(java.lang.String basePathIn, boolean skipFirst)`
- `TextureMap(java.lang.String basePathIn, ITextureMapPopulator iconCreatorIn)`
- `TextureMap(java.lang.String basePathIn, ITextureMapPopulator iconCreatorIn, boolean skipFirst)`

## Methods

- `TextureAtlasSprite getAtlasSprite(java.lang.String iconName)`
- `java.lang.String getBasePath()`
- `int getMipmapLevels()`
- `TextureAtlasSprite getMissingSprite()`
- `TextureAtlasSprite getTextureExtry(java.lang.String name)` — Grabs the registered entry for the specified name, returning null if there was not a entry.
- `void loadSprites(IResourceManager resourceManager, ITextureMapPopulator iconCreatorIn)`
- `void loadTexture(IResourceManager resourceManager)`
- `void loadTextureAtlas(IResourceManager resourceManager)`
- `TextureAtlasSprite registerSprite(ResourceLocation location)`
- `void setMipmapLevels(int mipmapLevelsIn)`
- `boolean setTextureEntry(TextureAtlasSprite entry)` — Adds a texture registry entry to this map for the specified name if one does not already exist.
- `void tick()`
- `void updateAnimations()`

## Fields

- `static ResourceLocation LOCATION_BLOCKS_TEXTURE`
- `static ResourceLocation LOCATION_MISSING_TEXTURE`
