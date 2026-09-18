---
title: "TextureManager"
description: "public class TextureManager extends java.lang.Object implements ITickable , IResourceManagerReloadListener"
package: "net/minecraft/client/renderer/texture"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/renderer/texture/TextureManager.html"
sourceType: javadoc
---

# TextureManager

## Class signature

```java
public class TextureManager extends java.lang.Object implements ITickable , IResourceManagerReloadListener
```

## Constructors

- `public TextureManager( IResourceManager p_i1284_1_)`

## Methods

- `public void bindTexture( ResourceLocation p_110577_1_)`
- `public ResourceLocation getResourceLocation(int p_130087_1_)`
- `public boolean loadTextureMap( ResourceLocation p_130088_1_, TextureMap p_130088_2_)`
- `public boolean loadTickableTexture( ResourceLocation p_110580_1_, ITickableTextureObject p_110580_2_)`
- `public boolean loadTexture( ResourceLocation p_110579_1_, ITextureObject p_110579_2_)`
- `public ITextureObject getTexture( ResourceLocation p_110581_1_)`
- `public ResourceLocation getDynamicTextureLocation(java.lang.String p_110578_1_, DynamicTexture p_110578_2_)`
- `public void tick()`
- `public void deleteTexture( ResourceLocation p_147645_1_)`
- `public void onResourceManagerReload( IResourceManager p_110549_1_)`
