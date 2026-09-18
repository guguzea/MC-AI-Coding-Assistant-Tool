# MinecraftForgeClient

## Class signature

```java
public class MinecraftForgeClient extends java.lang.Object
```

## Constructors

- `public MinecraftForgeClient()`

## Methods

- `public static int getRenderPass()`
- `public static BlockRenderLayer getRenderLayer()`
- `public static java.util.Locale getLocale()`
- `public static int reserveStencilBit()`
- `public static void releaseStencilBit(int bit)`
- `public static void onRebuildChunk( World world, BlockPos position, ChunkCache cache)`
- `public static ChunkCache getRegionRenderCache( World world, BlockPos pos)`
- `public static void clearRenderCache()`
- `public static void registerImageLayerSupplier( ResourceLocation resourceLocation, java.util.function.Supplier<java.awt.image.BufferedImage> supplier)`
- `public static java.awt.image.BufferedImage getImageLayer( ResourceLocation resourceLocation, IResourceManager resourceManager) throws java.io.IOException`

## Description

returns the Locale set by the player in Minecraft.