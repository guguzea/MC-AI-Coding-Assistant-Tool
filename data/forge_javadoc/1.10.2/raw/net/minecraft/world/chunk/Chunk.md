---
title: "Chunk"
description: "Removes the tile entity at the specified position, only if it's marked as invalid."
package: "net/minecraft/world/chunk"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/chunk/Chunk.html"
sourceType: javadoc
---

# Chunk

## Class signature

```java
public class Chunk extends java.lang.Object
```

## Constructors

- `public Chunk( World worldIn, int x, int z)`
- `public Chunk( World worldIn, ChunkPrimer primer, int x, int z)`

## Methods

- `public boolean isAtLocation(int x, int z)`
- `public int getHeight( BlockPos pos)`
- `public int getHeightValue(int x, int z)`
- `public int getTopFilledSegment()`
- `public ExtendedBlockStorage [] getBlockStorageArray()`
- `protected void generateHeightMap()`
- `public void generateSkylightMap()`
- `public int getBlockLightOpacity( BlockPos pos)`
- `public IBlockState getBlockState( BlockPos pos)`
- `public IBlockState getBlockState(int x, int y, int z)`
- `@Nullable public IBlockState setBlockState( BlockPos pos, IBlockState state)`
- `public int getLightFor( EnumSkyBlock p_177413_1_, BlockPos pos)`
- `public void setLightFor( EnumSkyBlock p_177431_1_, BlockPos pos, int value)`
- `public int getLightSubtracted( BlockPos pos, int amount)`
- `public void addEntity( Entity entityIn)`
- `public void removeEntity( Entity entityIn)`
- `public void removeEntityAtIndex( Entity entityIn, int index)`
- `public boolean canSeeSky( BlockPos pos)`
- `@Nullable public TileEntity getTileEntity( BlockPos pos, Chunk.EnumCreateEntityType p_177424_2_)`
- `public void addTileEntity( TileEntity tileEntityIn)`
- `public void addTileEntity( BlockPos pos, TileEntity tileEntityIn)`
- `public void removeTileEntity( BlockPos pos)`
- `public void onChunkLoad()`
- `public void onChunkUnload()`
- `public void setChunkModified()`
- `public void getEntitiesWithinAABBForEntity(@Nullable Entity entityIn, AxisAlignedBB aabb, java.util.List< Entity > listToFill, com.google.common.base.Predicate<? super Entity > p_177414_4_)`
- `public <T extends Entity > void getEntitiesOfTypeWithinAAAB(java.lang.Class<? extends T> entityClass, AxisAlignedBB aabb, java.util.List<T> listToFill, com.google.common.base.Predicate<? super T> filter)`
- `public boolean needsSaving(boolean p_76601_1_)`
- `public java.util.Random getRandomWithSeed(long seed)`
- `public boolean isEmpty()`
- `public void populateChunk( IChunkProvider chunkProvider, IChunkGenerator chunkGenrator)`
- `protected void populateChunk( IChunkGenerator generator)`
- `public BlockPos getPrecipitationHeight( BlockPos pos)`
- `public void onTick(boolean p_150804_1_)`
- `public boolean isPopulated()`
- `public boolean isChunkTicked()`
- `public ChunkPos getChunkCoordIntPair()`
- `public boolean getAreLevelsEmpty(int startY, int endY)`
- `public void setStorageArrays( ExtendedBlockStorage [] newStorageArrays)`
- `public void fillChunk( PacketBuffer buf, int p_186033_2_, boolean p_186033_3_)`
- `public Biome getBiome( BlockPos pos, BiomeProvider provider)`
- `public byte[] getBiomeArray()`
- `public void setBiomeArray(byte[] biomeArray)`
- `public void resetRelightChecks()`
- `public void enqueueRelightChecks()`
- `public void checkLight()`
- `public boolean isLoaded()`
- `public void setChunkLoaded(boolean loaded)`
- `public World getWorld()`
- `public int[] getHeightMap()`
- `public void setHeightMap(int[] newHeightMap)`
- `public java.util.Map< BlockPos , TileEntity > getTileEntityMap()`
- `public ClassInheritanceMultiMap < Entity >[] getEntityLists()`
- `public boolean isTerrainPopulated()`
- `public void setTerrainPopulated(boolean terrainPopulated)`
- `public boolean isLightPopulated()`
- `public void setLightPopulated(boolean lightPopulated)`
- `public void setModified(boolean modified)`
- `public void setHasEntities(boolean hasEntitiesIn)`
- `public void setLastSaveTime(long saveTime)`
- `public int getLowestHeight()`
- `public long getInhabitedTime()`
- `public void setInhabitedTime(long newInhabitedTime)`
- `public void removeInvalidTileEntity( BlockPos pos)`

## Description

Removes the tile entity at the specified position, only if it's marked as invalid.
