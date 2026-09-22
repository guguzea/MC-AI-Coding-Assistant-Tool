# MinecraftForgeClient

**Inheritance:** java.lang.Object → net.minecraftforge.client.MinecraftForgeClient

## Class signature

```java
public class MinecraftForgeClient extends java.lang.Object
```

## Constructors

- `MinecraftForgeClient()`

## Methods

- `static ChunkCache getRegionRenderCache(World world, BlockPos pos)`
- `static BlockRenderLayer getRenderLayer()`
- `static int getRenderPass()`
- `static void onRebuildChunk(World world, BlockPos position, ChunkCache cache)`
- `static void releaseStencilBit(int bit)` — Release the stencil bit for other use
- `static int reserveStencilBit()` — Reserve a stencil bit for use in rendering Note: you must check the Framebuffer you are working with to determine if stencil bits are enabled on it before use.