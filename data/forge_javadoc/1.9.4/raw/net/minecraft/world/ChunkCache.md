---
title: "ChunkCache"
description: "FORGE: isSideSolid, pulled up from World"
package: "net/minecraft/world"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/ChunkCache.html"
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

- `public boolean extendedLevelsInChunkCache()`
- `@Nullable public TileEntity getTileEntity( BlockPos pos)`
- `public int getCombinedLight( BlockPos pos, int lightValue)`
- `public IBlockState getBlockState( BlockPos pos)`
- `public Biome getBiomeGenForCoords( BlockPos pos)`
- `public boolean isAirBlock( BlockPos pos)`
- `public int getLightFor( EnumSkyBlock p_175628_1_, BlockPos pos)`
- `public int getStrongPower( BlockPos pos, EnumFacing direction)`
- `public WorldType getWorldType()`
- `public boolean isSideSolid( BlockPos pos, EnumFacing side, boolean _default)`

## Description

FORGE: isSideSolid, pulled up from World
