# MinecraftForgeClient

**Inheritance:** java.lang.Object → net.minecraftforge.client.MinecraftForgeClient

## Class signature

```java
public class MinecraftForgeClient extends java.lang.Object
```

## Constructors

- `MinecraftForgeClient()`

## Methods

- `static void clearRenderCache()`
- `static java.awt.image.BufferedImage getImageLayer(ResourceLocation resourceLocation, IResourceManager resourceManager)`
- `static java.util.Locale getLocale()` — returns the Locale set by the player in Minecraft.
- `static ChunkCache getRegionRenderCache(World world, BlockPos pos)`
- `static BlockRenderLayer getRenderLayer()`
- `static int getRenderPass()`
- `static void onRebuildChunk(World world, BlockPos position, ChunkCache cache)`
- `static void registerImageLayerSupplier(ResourceLocation resourceLocation, java.util.function.Supplier<java.awt.image.BufferedImage> supplier)`
- `static void releaseStencilBit(int bit)` — Release the stencil bit for other use
- `static int reserveStencilBit()` — Reserve a stencil bit for use in rendering Note: you must check the Framebuffer you are working with to determine if stencil bits are enabled on it before use.