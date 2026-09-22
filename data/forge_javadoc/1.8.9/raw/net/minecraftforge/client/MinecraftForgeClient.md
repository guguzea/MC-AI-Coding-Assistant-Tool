---
title: "MinecraftForgeClient"
description: "public class MinecraftForgeClient extends java.lang.Object"
package: "net/minecraftforge/client"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/MinecraftForgeClient.html"
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

- `static RegionRenderCache getRegionRenderCache(World world, BlockPos pos)`
- `static EnumWorldBlockLayer getRenderLayer()`
- `static int getRenderPass()`
- `static void onRebuildChunk(World world, BlockPos position, RegionRenderCache cache)`
- `static void releaseStencilBit(int bit)` — Release the stencil bit for other use
- `static int reserveStencilBit()` — Reserve a stencil bit for use in rendering Note: you must check the Framebuffer you are working with to determine if stencil bits are enabled on it before use.
