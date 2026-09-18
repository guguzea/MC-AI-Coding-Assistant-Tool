---
title: "ChunkCache"
description: "FORGE: isSideSolid, pulled up from World"
package: "net/minecraft/world"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/ChunkCache.html"
sourceType: javadoc
---

# ChunkCache

## Class signature

```java
public class ChunkCache extends java.lang.Object implements IBlockAccess
```

## Constructors

- `public ChunkCache( World worldIn, BlockPos posFromIn, BlockPos posToIn, int subIn)`

## Methods

- `public boolean isEmpty()`
- `public TileEntity getTileEntity( BlockPos pos)`
- `public TileEntity getTileEntity( BlockPos pos, Chunk.EnumCreateEntityType p_190300_2_)`
- `public int getCombinedLight( BlockPos pos, int lightValue)`
- `public IBlockState getBlockState( BlockPos pos)`
- `public Biome getBiome( BlockPos pos)`
- `public boolean isAirBlock( BlockPos pos)`
- `public int getLightFor( EnumSkyBlock type, BlockPos pos)`
- `public int getStrongPower( BlockPos pos, EnumFacing direction)`
- `public WorldType getWorldType()`
- `public boolean isSideSolid( BlockPos pos, EnumFacing side, boolean _default)`

## Description

FORGE: isSideSolid, pulled up from World
