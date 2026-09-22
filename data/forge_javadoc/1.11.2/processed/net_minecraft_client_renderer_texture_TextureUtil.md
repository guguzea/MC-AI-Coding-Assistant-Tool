# TextureUtil

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.texture.TextureUtil

## Class signature

```java
public class TextureUtil extends java.lang.Object
```

## Constructors

- `TextureUtil()`

## Methods

- `static void allocateTexture(int textureId, int width, int height)`
- `static void allocateTextureImpl(int glTextureId, int mipmapLevels, int width, int height)`
- `static int anaglyphColor(int p_177054_0_)`
- `static void deleteTexture(int textureId)`
- `static int[][] generateMipmapData(int p_147949_0_, int p_147949_1_, int[][] p_147949_2_)`
- `static int glGenTextures()`
- `static void processPixelValues(int[] p_147953_0_, int p_147953_1_, int p_147953_2_)`
- `static java.awt.image.BufferedImage readBufferedImage(java.io.InputStream imageStream)`
- `static int[] readImageData(IResourceManager resourceManager, ResourceLocation imageLocation)`
- `static int[] updateAnaglyph(int[] p_110985_0_)`
- `static void uploadTexture(int textureId, int[] p_110988_1_, int p_110988_2_, int p_110988_3_)`
- `static int uploadTextureImage(int textureId, java.awt.image.BufferedImage texture)`
- `static int uploadTextureImageAllocate(int textureId, java.awt.image.BufferedImage texture, boolean blur, boolean clamp)`
- `static int uploadTextureImageSub(int textureId, java.awt.image.BufferedImage p_110995_1_, int p_110995_2_, int p_110995_3_, boolean p_110995_4_, boolean p_110995_5_)`
- `static void uploadTextureMipmap(int[][] p_147955_0_, int p_147955_1_, int p_147955_2_, int p_147955_3_, int p_147955_4_, boolean p_147955_5_, boolean p_147955_6_)`

## Fields

- `static DynamicTexture MISSING_TEXTURE`
- `static int[] MISSING_TEXTURE_DATA`