---
title: "DecorateBiomeEvent"
description: "DecorateBiomeEvent is fired when a BiomeDecorator is created. This event is fired whenever a BiomeDecorator is created in DeferredBiomeDecorator.fireCreateEventAndReplace(Biome) . world contains the w"
package: "net/minecraftforge/event/terraingen"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/terraingen/DecorateBiomeEvent.html"
sourceType: javadoc
---

# DecorateBiomeEvent

## Class signature

```java
public class DecorateBiomeEvent extends Event
```

## Constructors

- `public DecorateBiomeEvent( World world, java.util.Random rand, ChunkPos chunkPos)`

## Methods

- `@Deprecated public DecorateBiomeEvent( World world, java.util.Random rand, BlockPos pos)`
- `public World getWorld()`
- `public java.util.Random getRand()`
- `@Deprecated public BlockPos getPos()`
- `public ChunkPos getChunkPos()`

## Description

DecorateBiomeEvent is fired when a BiomeDecorator is created. This event is fired whenever a BiomeDecorator is created in DeferredBiomeDecorator.fireCreateEventAndReplace(Biome) . world contains the w
