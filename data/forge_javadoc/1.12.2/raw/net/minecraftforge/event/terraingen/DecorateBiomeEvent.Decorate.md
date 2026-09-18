---
title: "DecorateBiomeEvent.Decorate"
description: "This event is fired when a chunk is decorated with a biome feature. You can set the result to DENY to prevent the default biome decoration."
package: "net/minecraftforge/event/terraingen"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/terraingen/DecorateBiomeEvent.Decorate.html"
sourceType: javadoc
---

# DecorateBiomeEvent.Decorate

## Constructors

- `public Decorate( World world, java.util.Random rand, ChunkPos chunkPos, BlockPos placementPos, DecorateBiomeEvent.Decorate.EventType type)`

## Methods

- `@Deprecated public Decorate( World world, java.util.Random rand, BlockPos pos, DecorateBiomeEvent.Decorate.EventType type)`
- `public DecorateBiomeEvent.Decorate.EventType getType()`
- `public BlockPos getPlacementPos()`

## Description

This event is fired when a chunk is decorated with a biome feature. You can set the result to DENY to prevent the default biome decoration.
