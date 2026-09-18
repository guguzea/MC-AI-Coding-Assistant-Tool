---
title: "MinecraftForgeClient"
description: "Release the stencil bit for other use"
package: "net/minecraftforge/client"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/MinecraftForgeClient.html"
sourceType: javadoc
---

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
- `public static int reserveStencilBit()`
- `public static void releaseStencilBit(int bit)`
- `public static void onRebuildChunk( World world, BlockPos position, ChunkCache cache)`
- `public static ChunkCache getRegionRenderCache( World world, BlockPos pos)`

## Description

Release the stencil bit for other use
