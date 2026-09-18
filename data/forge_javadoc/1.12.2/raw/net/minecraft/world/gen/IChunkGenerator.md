---
title: "IChunkGenerator"
description: "public interface IChunkGenerator"
package: "net/minecraft/world/gen"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/gen/IChunkGenerator.html"
sourceType: javadoc
---

# IChunkGenerator

## Class signature

```java
public interface IChunkGenerator
```

## Methods

- `Chunk generateChunk(int x, int z)`
- `void populate(int x, int z)`
- `boolean generateStructures( Chunk chunkIn, int x, int z)`
- `java.util.List< Biome.SpawnListEntry > getPossibleCreatures( EnumCreatureType creatureType, BlockPos pos)`
- `BlockPos getNearestStructurePos( World worldIn, java.lang.String structureName, BlockPos position, boolean findUnexplored)`
- `void recreateStructures( Chunk chunkIn, int x, int z)`
- `boolean isInsideStructure( World worldIn, java.lang.String structureName, BlockPos pos)`
