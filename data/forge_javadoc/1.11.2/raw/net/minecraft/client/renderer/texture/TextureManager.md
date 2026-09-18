---
title: "TextureManager"
description: "public class TextureManager extends java.lang.Object implements ITickable , IResourceManagerReloadListener"
package: "net/minecraft/client/renderer/texture"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/texture/TextureManager.html"
sourceType: javadoc
---

# TextureManager

## Class signature

```java
public class TextureManager extends java.lang.Object implements ITickable , IResourceManagerReloadListener
```

## Constructors

- `public TextureManager( IResourceManager resourceManager)`

## Methods

- `public void bindTexture( ResourceLocation resource)`
- `public boolean loadTickableTexture( ResourceLocation textureLocation, ITickableTextureObject textureObj)`
- `public boolean loadTexture( ResourceLocation textureLocation, ITextureObject textureObj)`
- `public ITextureObject getTexture( ResourceLocation textureLocation)`
- `public ResourceLocation getDynamicTextureLocation(java.lang.String name, DynamicTexture texture)`
- `public void tick()`
- `public void deleteTexture( ResourceLocation textureLocation)`
- `public void onResourceManagerReload( IResourceManager resourceManager)`
