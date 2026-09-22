---
title: "ChunkCache"
description: "public class ChunkCache extends java.lang.Object implements IBlockAccess"
package: "net/minecraft/world"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/ChunkCache.html"
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

- `Biome getBiome(BlockPos pos)`
- `IBlockState getBlockState(BlockPos pos)`
- `int getCombinedLight(BlockPos pos, int lightValue)`
- `int getLightFor(EnumSkyBlock type, BlockPos pos)`
- `int getStrongPower(BlockPos pos, EnumFacing direction)`
- `TileEntity getTileEntity(BlockPos pos)`
- `TileEntity getTileEntity(BlockPos pos, Chunk.EnumCreateEntityType p_190300_2_)`
- `WorldType getWorldType()`
- `boolean isAirBlock(BlockPos pos)`
- `boolean isEmpty()`
- `boolean isSideSolid(BlockPos pos, EnumFacing side, boolean _default)` — FORGE: isSideSolid, pulled up from World

## Fields

- `protected Chunk [][] chunkArray`
- `protected int chunkX`
- `protected int chunkZ`
- `protected boolean empty`
- `protected World world`
