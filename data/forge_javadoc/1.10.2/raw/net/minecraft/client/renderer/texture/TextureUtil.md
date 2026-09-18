---
title: "TextureUtil"
description: "public class TextureUtil extends java.lang.Object"
package: "net/minecraft/client/renderer/texture"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/texture/TextureUtil.html"
sourceType: javadoc
---

# TextureUtil

## Class signature

```java
public class TextureUtil extends java.lang.Object
```

## Constructors

- `public TextureUtil()`

## Methods

- `public static int glGenTextures()`
- `public static void deleteTexture(int textureId)`
- `public static int uploadTextureImage(int textureId, java.awt.image.BufferedImage texture)`
- `public static void uploadTexture(int textureId, int[] p_110988_1_, int p_110988_2_, int p_110988_3_)`
- `public static int[][] generateMipmapData(int p_147949_0_, int p_147949_1_, int[][] p_147949_2_)`
- `public static void uploadTextureMipmap(int[][] p_147955_0_, int p_147955_1_, int p_147955_2_, int p_147955_3_, int p_147955_4_, boolean p_147955_5_, boolean p_147955_6_)`
- `public static int uploadTextureImageAllocate(int textureId, java.awt.image.BufferedImage texture, boolean blur, boolean clamp)`
- `public static void allocateTexture(int textureId, int width, int height)`
- `public static void allocateTextureImpl(int glTextureId, int mipmapLevels, int width, int height)`
- `public static int uploadTextureImageSub(int textureId, java.awt.image.BufferedImage p_110995_1_, int p_110995_2_, int p_110995_3_, boolean p_110995_4_, boolean p_110995_5_)`
- `public static int[] readImageData( IResourceManager resourceManager, ResourceLocation imageLocation) throws java.io.IOException`
- `public static java.awt.image.BufferedImage readBufferedImage(java.io.InputStream imageStream) throws java.io.IOException`
- `public static int[] updateAnaglyph(int[] p_110985_0_)`
- `public static int anaglyphColor(int p_177054_0_)`
- `public static void processPixelValues(int[] p_147953_0_, int p_147953_1_, int p_147953_2_)`
