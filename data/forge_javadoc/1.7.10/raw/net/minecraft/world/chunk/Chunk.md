---
title: "Chunk"
description: "public class Chunk extends java.lang.Object"
package: "net/minecraft/world/chunk"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/chunk/Chunk.html"
sourceType: javadoc
---

# Chunk

## Class signature

```java
public class Chunk extends java.lang.Object
```

## Constructors

- `public Chunk( World p_i1995_1_, int p_i1995_2_, int p_i1995_3_)`
- `public Chunk( World p_i45446_1_, Block [] p_i45446_2_, int p_i45446_3_, int p_i45446_4_)`
- `public Chunk( World p_i45447_1_, Block [] p_i45447_2_, byte[] p_i45447_3_, int p_i45447_4_, int p_i45447_5_)`

## Methods

- `public boolean isAtLocation(int p_76600_1_, int p_76600_2_)`
- `public int getHeightValue(int p_76611_1_, int p_76611_2_)`
- `public int getTopFilledSegment()`
- `public ExtendedBlockStorage [] getBlockStorageArray()`
- `public void generateHeightMap()`
- `public void generateSkylightMap()`
- `public int func_150808_b(int p_150808_1_, int p_150808_2_, int p_150808_3_)`
- `public Block getBlock(int p_150810_1_, int p_150810_2_, int p_150810_3_)`
- `public int getBlockMetadata(int p_76628_1_, int p_76628_2_, int p_76628_3_)`
- `public boolean func_150807_a(int p_150807_1_, int p_150807_2_, int p_150807_3_, Block p_150807_4_, int p_150807_5_)`
- `public boolean setBlockMetadata(int p_76589_1_, int p_76589_2_, int p_76589_3_, int p_76589_4_)`
- `public int getSavedLightValue( EnumSkyBlock p_76614_1_, int p_76614_2_, int p_76614_3_, int p_76614_4_)`
- `public void setLightValue( EnumSkyBlock p_76633_1_, int p_76633_2_, int p_76633_3_, int p_76633_4_, int p_76633_5_)`
- `public int getBlockLightValue(int p_76629_1_, int p_76629_2_, int p_76629_3_, int p_76629_4_)`
- `public void addEntity( Entity p_76612_1_)`
- `public void removeEntity( Entity p_76622_1_)`
- `public void removeEntityAtIndex( Entity p_76608_1_, int p_76608_2_)`
- `public boolean canBlockSeeTheSky(int p_76619_1_, int p_76619_2_, int p_76619_3_)`
- `public TileEntity func_150806_e(int p_150806_1_, int p_150806_2_, int p_150806_3_)`
- `public void addTileEntity( TileEntity p_150813_1_)`
- `public void func_150812_a(int p_150812_1_, int p_150812_2_, int p_150812_3_, TileEntity p_150812_4_)`
- `public void removeTileEntity(int p_150805_1_, int p_150805_2_, int p_150805_3_)`
- `public void onChunkLoad()`
- `public void onChunkUnload()`
- `public void setChunkModified()`
- `public void getEntitiesWithinAABBForEntity( Entity p_76588_1_, AxisAlignedBB p_76588_2_, java.util.List p_76588_3_, IEntitySelector p_76588_4_)`
- `public void getEntitiesOfTypeWithinAAAB(java.lang.Class p_76618_1_, AxisAlignedBB p_76618_2_, java.util.List p_76618_3_, IEntitySelector p_76618_4_)`
- `public boolean needsSaving(boolean p_76601_1_)`
- `public java.util.Random getRandomWithSeed(long p_76617_1_)`
- `public boolean isEmpty()`
- `public void populateChunk( IChunkProvider p_76624_1_, IChunkProvider p_76624_2_, int p_76624_3_, int p_76624_4_)`
- `public int getPrecipitationHeight(int p_76626_1_, int p_76626_2_)`
- `public void func_150804_b(boolean p_150804_1_)`
- `public boolean func_150802_k()`
- `public ChunkCoordIntPair getChunkCoordIntPair()`
- `public boolean getAreLevelsEmpty(int p_76606_1_, int p_76606_2_)`
- `public void setStorageArrays( ExtendedBlockStorage [] p_76602_1_)`
- `public void fillChunk(byte[] p_76607_1_, int p_76607_2_, int p_76607_3_, boolean p_76607_4_)`
- `public BiomeGenBase getBiomeGenForWorldCoords(int p_76591_1_, int p_76591_2_, WorldChunkManager p_76591_3_)`
- `public byte[] getBiomeArray()`
- `public void setBiomeArray(byte[] p_76616_1_)`
- `public void resetRelightChecks()`
- `public void enqueueRelightChecks()`
- `public void func_150809_p()`
