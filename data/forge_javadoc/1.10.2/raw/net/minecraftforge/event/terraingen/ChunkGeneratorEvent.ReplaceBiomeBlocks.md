---
title: "ChunkGeneratorEvent.ReplaceBiomeBlocks"
description: "This event is fired when a chunks blocks are replaced by a biomes top and filler blocks. You can set the result to DENY to prevent the default replacement."
package: "net/minecraftforge/event/terraingen"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/terraingen/ChunkGeneratorEvent.ReplaceBiomeBlocks.html"
sourceType: javadoc
---

# ChunkGeneratorEvent.ReplaceBiomeBlocks

## Constructors

- `public ReplaceBiomeBlocks( IChunkGenerator chunkProvider, int x, int z, ChunkPrimer primer, World world)`

## Methods

- `public int getX()`
- `public int getZ()`
- `public ChunkPrimer getPrimer()`
- `public World getWorld()`

## Description

This event is fired when a chunks blocks are replaced by a biomes top and filler blocks. You can set the result to DENY to prevent the default replacement.
