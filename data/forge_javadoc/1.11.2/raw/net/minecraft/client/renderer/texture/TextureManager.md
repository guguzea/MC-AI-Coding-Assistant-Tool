---
title: "TextureManager"
description: "public class TextureManager extends java.lang.Object implements ITickable, IResourceManagerReloadListener"
package: "net/minecraft/client/renderer/texture"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/texture/TextureManager.html"
sourceType: javadoc
---

# TextureManager

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.texture.TextureManager

## Class signature

```java
public class TextureManager extends java.lang.Object implements ITickable, IResourceManagerReloadListener
```

## Constructors

- `TextureManager(IResourceManager resourceManager)`

## Methods

- `void bindTexture(ResourceLocation resource)`
- `void deleteTexture(ResourceLocation textureLocation)`
- `ResourceLocation getDynamicTextureLocation(java.lang.String name, DynamicTexture texture)`
- `ITextureObject getTexture(ResourceLocation textureLocation)`
- `boolean loadTexture(ResourceLocation textureLocation, ITextureObject textureObj)`
- `boolean loadTickableTexture(ResourceLocation textureLocation, ITickableTextureObject textureObj)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `void tick()`
