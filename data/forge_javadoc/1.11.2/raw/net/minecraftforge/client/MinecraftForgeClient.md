---
title: "MinecraftForgeClient"
description: "public class MinecraftForgeClient extends java.lang.Object"
package: "net/minecraftforge/client"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/MinecraftForgeClient.html"
sourceType: javadoc
---

# MinecraftForgeClient

**Inheritance:** java.lang.Object → net.minecraftforge.client.MinecraftForgeClient

## Class signature

```java
public class MinecraftForgeClient extends java.lang.Object
```

## Constructors

- `MinecraftForgeClient()`

## Methods

- `static java.util.Locale getLocale()` — returns the Locale set by the player in Minecraft.
- `static ChunkCache getRegionRenderCache(World world, BlockPos pos)`
- `static BlockRenderLayer getRenderLayer()`
- `static int getRenderPass()`
- `static void onRebuildChunk(World world, BlockPos position, ChunkCache cache)`
- `static void releaseStencilBit(int bit)` — Release the stencil bit for other use
- `static int reserveStencilBit()` — Reserve a stencil bit for use in rendering Note: you must check the Framebuffer you are working with to determine if stencil bits are enabled on it before use.
