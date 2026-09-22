---
title: "ChunkCache"
description: "public class ChunkCache extends java.lang.Object implements IBlockAccess"
package: "net/minecraft/world"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/ChunkCache.html"
sourceType: javadoc
---

# ChunkCache

**Inheritance:** java.lang.Object → net.minecraft.world.ChunkCache

## Class signature

```java
public class ChunkCache extends java.lang.Object implements IBlockAccess
```

## Constructors

- `ChunkCache(World worldIn, BlockPos posFromIn, BlockPos posToIn, int subIn)`

## Methods

- `boolean extendedLevelsInChunkCache()`
- `Biome getBiome(BlockPos pos)`
- `IBlockState getBlockState(BlockPos pos)`
- `int getCombinedLight(BlockPos pos, int lightValue)`
- `int getLightFor(EnumSkyBlock p_175628_1_, BlockPos pos)`
- `int getStrongPower(BlockPos pos, EnumFacing direction)`
- `TileEntity getTileEntity(BlockPos pos)`
- `TileEntity getTileEntity(BlockPos pos, Chunk.EnumCreateEntityType p_190300_2_)`
- `WorldType getWorldType()`
- `boolean isAirBlock(BlockPos pos)`
- `boolean isSideSolid(BlockPos pos, EnumFacing side, boolean _default)` — FORGE: isSideSolid, pulled up from World

## Fields

- `protected Chunk [][] chunkArray`
- `protected int chunkX`
- `protected int chunkZ`
- `protected boolean hasExtendedLevels`
- `protected World world`
