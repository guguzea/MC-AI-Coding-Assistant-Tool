# Chunk

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.Chunk

## Class signature

```java
public class Chunk extends java.lang.Object
```

## Constructors

- `Chunk(World p_i45447_1_, Block [] p_i45447_2_, byte[] p_i45447_3_, int p_i45447_4_, int p_i45447_5_)`
- `Chunk(World p_i45446_1_, Block [] p_i45446_2_, int p_i45446_3_, int p_i45446_4_)`
- `Chunk(World p_i1995_1_, int p_i1995_2_, int p_i1995_3_)`

## Methods

- `void addEntity(Entity p_76612_1_)`
- `void addTileEntity(TileEntity p_150813_1_)`
- `boolean canBlockSeeTheSky(int p_76619_1_, int p_76619_2_, int p_76619_3_)`
- `void enqueueRelightChecks()`
- `void fillChunk(byte[] p_76607_1_, int p_76607_2_, int p_76607_3_, boolean p_76607_4_)`
- `boolean func_150802_k()`
- `void func_150804_b(boolean p_150804_1_)`
- `TileEntity func_150806_e(int p_150806_1_, int p_150806_2_, int p_150806_3_)`
- `boolean func_150807_a(int p_150807_1_, int p_150807_2_, int p_150807_3_, Block p_150807_4_, int p_150807_5_)`
- `int func_150808_b(int p_150808_1_, int p_150808_2_, int p_150808_3_)`
- `void func_150809_p()`
- `void func_150812_a(int p_150812_1_, int p_150812_2_, int p_150812_3_, TileEntity p_150812_4_)`
- `void generateHeightMap()`
- `void generateSkylightMap()`
- `boolean getAreLevelsEmpty(int p_76606_1_, int p_76606_2_)`
- `byte[] getBiomeArray()`
- `BiomeGenBase getBiomeGenForWorldCoords(int p_76591_1_, int p_76591_2_, WorldChunkManager p_76591_3_)`
- `Block getBlock(int p_150810_1_, int p_150810_2_, int p_150810_3_)`
- `int getBlockLightValue(int p_76629_1_, int p_76629_2_, int p_76629_3_, int p_76629_4_)`
- `int getBlockMetadata(int p_76628_1_, int p_76628_2_, int p_76628_3_)`
- `ExtendedBlockStorage [] getBlockStorageArray()`
- `ChunkCoordIntPair getChunkCoordIntPair()`
- `void getEntitiesOfTypeWithinAAAB(java.lang.Class p_76618_1_, AxisAlignedBB p_76618_2_, java.util.List p_76618_3_, IEntitySelector p_76618_4_)`
- `void getEntitiesWithinAABBForEntity(Entity p_76588_1_, AxisAlignedBB p_76588_2_, java.util.List p_76588_3_, IEntitySelector p_76588_4_)`
- `int getHeightValue(int p_76611_1_, int p_76611_2_)`
- `int getPrecipitationHeight(int p_76626_1_, int p_76626_2_)`
- `java.util.Random getRandomWithSeed(long p_76617_1_)`
- `int getSavedLightValue(EnumSkyBlock p_76614_1_, int p_76614_2_, int p_76614_3_, int p_76614_4_)`
- `int getTopFilledSegment()`
- `boolean isAtLocation(int p_76600_1_, int p_76600_2_)`
- `boolean isEmpty()`
- `boolean needsSaving(boolean p_76601_1_)`
- `void onChunkLoad()`
- `void onChunkUnload()`
- `void populateChunk(IChunkProvider p_76624_1_, IChunkProvider p_76624_2_, int p_76624_3_, int p_76624_4_)`
- `void removeEntity(Entity p_76622_1_)`
- `void removeEntityAtIndex(Entity p_76608_1_, int p_76608_2_)`
- `void removeTileEntity(int p_150805_1_, int p_150805_2_, int p_150805_3_)`
- `void resetRelightChecks()`
- `void setBiomeArray(byte[] p_76616_1_)`
- `boolean setBlockMetadata(int p_76589_1_, int p_76589_2_, int p_76589_3_, int p_76589_4_)`
- `void setChunkModified()`
- `void setLightValue(EnumSkyBlock p_76633_1_, int p_76633_2_, int p_76633_3_, int p_76633_4_, int p_76633_5_)`
- `void setStorageArrays(ExtendedBlockStorage [] p_76602_1_)`

## Fields

- `java.util.Map chunkTileEntityMap`
- `java.util.List[] entityLists`
- `boolean field_150815_m`
- `boolean hasEntities`
- `int[] heightMap`
- `int heightMapMinimum`
- `long inhabitedTime`
- `boolean isChunkLoaded`
- `boolean isLightPopulated`
- `static boolean isLit`
- `boolean isModified`
- `boolean isTerrainPopulated`
- `long lastSaveTime`
- `int[] precipitationHeightMap`
- `boolean sendUpdates`
- `boolean[] updateSkylightColumns`
- `World worldObj`
- `int xPosition`
- `int zPosition`