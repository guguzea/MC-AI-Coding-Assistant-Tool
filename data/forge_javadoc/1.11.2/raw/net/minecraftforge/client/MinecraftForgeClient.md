---
title: "MinecraftForgeClient"
description: "returns the Locale set by the player in Minecraft."
package: "net/minecraftforge/client"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/MinecraftForgeClient.html"
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
- `public static java.util.Locale getLocale()`
- `public static int reserveStencilBit()`
- `public static void releaseStencilBit(int bit)`
- `public static void onRebuildChunk( World world, BlockPos position, ChunkCache cache)`
- `public static ChunkCache getRegionRenderCache( World world, BlockPos pos)`

## Description

returns the Locale set by the player in Minecraft.
