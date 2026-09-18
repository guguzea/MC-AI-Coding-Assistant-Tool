---
title: "Chunk"
description: "The x coordinate of the chunk."
package: "net/minecraft/world/chunk"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/Chunk.html"
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
- `public Block getBlock(int x, int y, int z)`
- `public Block getBlock( BlockPos pos)`
- `public IBlockState getBlockState( BlockPos pos)`
- `public int getBlockMetadata( BlockPos pos)`
- `public IBlockState setBlockState( BlockPos pos, IBlockState state)`
- `public int getLightFor( EnumSkyBlock p_177413_1_, BlockPos pos)`
- `public void setLightFor( EnumSkyBlock p_177431_1_, BlockPos pos, int value)`
- `public int getLightSubtracted( BlockPos pos, int amount)`
- `public void addEntity( Entity entityIn)`
- `public void removeEntity( Entity entityIn)`
- `public void removeEntityAtIndex( Entity entityIn, int p_76608_2_)`
- `public boolean canSeeSky( BlockPos pos)`
- `public TileEntity getTileEntity( BlockPos pos, Chunk.EnumCreateEntityType p_177424_2_)`
- `public void addTileEntity( TileEntity tileEntityIn)`
- `public void addTileEntity( BlockPos pos, TileEntity tileEntityIn)`
- `public void removeTileEntity( BlockPos pos)`
- `public void onChunkLoad()`
- `public void onChunkUnload()`
- `public void setChunkModified()`
- `public void getEntitiesWithinAABBForEntity( Entity entityIn, AxisAlignedBB aabb, java.util.List< Entity > listToFill, <any> p_177414_4_)`
- `public <T extends Entity > void getEntitiesOfTypeWithinAAAB(java.lang.Class<? extends T> entityClass, AxisAlignedBB aabb, java.util.List<T> listToFill, <any> p_177430_4_)`
- `public boolean needsSaving(boolean p_76601_1_)`
- `public java.util.Random getRandomWithSeed(long seed)`
- `public boolean isEmpty()`
- `public void populateChunk( IChunkProvider p_76624_1_, IChunkProvider p_76624_2_, int p_76624_3_, int p_76624_4_)`
- `public BlockPos getPrecipitationHeight( BlockPos pos)`
- `public void func_150804_b(boolean p_150804_1_)`
- `public boolean isPopulated()`
- `public ChunkCoordIntPair getChunkCoordIntPair()`
- `public boolean getAreLevelsEmpty(int startY, int endY)`
- `public void setStorageArrays( ExtendedBlockStorage [] newStorageArrays)`
- `public void fillChunk(byte[] p_177439_1_, int p_177439_2_, boolean p_177439_3_)`
- `public BiomeGenBase getBiome( BlockPos pos, WorldChunkManager chunkManager)`
- `public byte[] getBiomeArray()`
- `public void setBiomeArray(byte[] biomeArray)`
- `public void resetRelightChecks()`
- `public void enqueueRelightChecks()`
- `public void func_150809_p()`
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

The x coordinate of the chunk.
