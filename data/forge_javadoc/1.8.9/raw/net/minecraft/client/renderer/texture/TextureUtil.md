---
title: "TextureUtil"
description: "public class TextureUtil extends java.lang.Object"
package: "net/minecraft/client/renderer/texture"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/texture/TextureUtil.html"
sourceType: javadoc
---

# TextureUtil

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.texture.TextureUtil

## Class signature

```java
public class TextureUtil extends java.lang.Object
```

## Constructors

- `TextureUtil()`

## Methods

- `static void allocateTexture(int p_110991_0_, int p_110991_1_, int p_110991_2_)`
- `static void allocateTextureImpl(int p_180600_0_, int p_180600_1_, int p_180600_2_, int p_180600_3_)`
- `static int anaglyphColor(int p_177054_0_)`
- `static void deleteTexture(int textureId)`
- `static int[][] generateMipmapData(int p_147949_0_, int p_147949_1_, int[][] p_147949_2_)`
- `static int glGenTextures()`
- `static void processPixelValues(int[] p_147953_0_, int p_147953_1_, int p_147953_2_)`
- `static java.awt.image.BufferedImage readBufferedImage(java.io.InputStream imageStream)`
- `static int[] readImageData(IResourceManager resourceManager, ResourceLocation imageLocation)`
- `static int[] updateAnaglyph(int[] p_110985_0_)`
- `static void uploadTexture(int textureId, int[] p_110988_1_, int p_110988_2_, int p_110988_3_)`
- `static int uploadTextureImage(int p_110987_0_, java.awt.image.BufferedImage p_110987_1_)`
- `static int uploadTextureImageAllocate(int p_110989_0_, java.awt.image.BufferedImage p_110989_1_, boolean p_110989_2_, boolean p_110989_3_)`
- `static int uploadTextureImageSub(int textureId, java.awt.image.BufferedImage p_110995_1_, int p_110995_2_, int p_110995_3_, boolean p_110995_4_, boolean p_110995_5_)`
- `static void uploadTextureMipmap(int[][] p_147955_0_, int p_147955_1_, int p_147955_2_, int p_147955_3_, int p_147955_4_, boolean p_147955_5_, boolean p_147955_6_)`

## Fields

- `static DynamicTexture missingTexture`
- `static int[] missingTextureData`
