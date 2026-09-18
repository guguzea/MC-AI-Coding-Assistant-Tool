---
title: "IChunkGenerator"
description: "public interface IChunkGenerator"
package: "net/minecraft/world/chunk"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/chunk/IChunkGenerator.html"
sourceType: javadoc
---

# IChunkGenerator

## Class signature

```java
public interface IChunkGenerator
```

## Methods

- `Chunk provideChunk(int x, int z)`
- `void populate(int x, int z)`
- `boolean generateStructures( Chunk chunkIn, int x, int z)`
- `java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `@Nullable BlockPos getStrongholdGen( World worldIn, java.lang.String structureName, BlockPos position)`
- `void recreateStructures( Chunk chunkIn, int x, int z)`
