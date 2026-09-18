---
title: "MinecraftForgeClient"
description: "Release the stencil bit for other use"
package: "net/minecraftforge/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/MinecraftForgeClient.html"
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
- `public static EnumWorldBlockLayer getRenderLayer()`
- `public static int reserveStencilBit()`
- `public static void releaseStencilBit(int bit)`
- `public static void onRebuildChunk( World world, BlockPos position, RegionRenderCache cache)`
- `public static RegionRenderCache getRegionRenderCache( World world, BlockPos pos)`

## Description

Release the stencil bit for other use
