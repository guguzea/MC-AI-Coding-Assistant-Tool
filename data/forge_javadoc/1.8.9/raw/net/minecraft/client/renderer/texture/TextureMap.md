---
title: "TextureMap"
description: "public class TextureMap extends AbstractTexture implements ITickableTextureObject"
package: "net/minecraft/client/renderer/texture"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/texture/TextureMap.html"
sourceType: javadoc
---

# TextureMap

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.texture.AbstractTexture → net.minecraft.client.renderer.texture.TextureMap

## Class signature

```java
public class TextureMap extends AbstractTexture implements ITickableTextureObject
```

## Constructors

- `TextureMap(java.lang.String p_i46099_1_)`
- `TextureMap(java.lang.String p_i46100_1_, boolean skipFirst)`
- `TextureMap(java.lang.String p_i46100_1_, IIconCreator iconCreatorIn)`
- `TextureMap(java.lang.String p_i46100_1_, IIconCreator iconCreatorIn, boolean skipFirst)`

## Methods

- `TextureAtlasSprite getAtlasSprite(java.lang.String iconName)`
- `TextureAtlasSprite getMissingSprite()`
- `TextureAtlasSprite getTextureExtry(java.lang.String name)` — Grabs the registered entry for the specified name, returning null if there was not a entry.
- `void loadSprites(IResourceManager resourceManager, IIconCreator p_174943_2_)`
- `void loadTexture(IResourceManager resourceManager)`
- `void loadTextureAtlas(IResourceManager resourceManager)`
- `TextureAtlasSprite registerSprite(ResourceLocation location)`
- `void setMipmapLevels(int mipmapLevelsIn)`
- `boolean setTextureEntry(java.lang.String name, TextureAtlasSprite entry)` — Adds a texture registry entry to this map for the specified name if one does not already exist.
- `void tick()`
- `void updateAnimations()`

## Fields

- `static ResourceLocation LOCATION_MISSING_TEXTURE`
- `static ResourceLocation locationBlocksTexture`
