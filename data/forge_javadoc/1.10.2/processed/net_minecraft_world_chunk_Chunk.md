# Chunk

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.Chunk

## Class signature

```java
public class Chunk extends java.lang.Object
```

## Constructors

- `Chunk(World worldIn, ChunkPrimer primer, int x, int z)`
- `Chunk(World worldIn, int x, int z)`

## Methods

- `void addEntity(Entity entityIn)`
- `void addTileEntity(BlockPos pos, TileEntity tileEntityIn)`
- `void addTileEntity(TileEntity tileEntityIn)`
- `boolean canSeeSky(BlockPos pos)`
- `void checkLight()`
- `void enqueueRelightChecks()`
- `void fillChunk(PacketBuffer buf, int p_186033_2_, boolean p_186033_3_)`
- `protected void generateHeightMap()`
- `void generateSkylightMap()`
- `boolean getAreLevelsEmpty(int startY, int endY)`
- `Biome getBiome(BlockPos pos, BiomeProvider provider)`
- `byte[] getBiomeArray()`
- `int getBlockLightOpacity(BlockPos pos)`
- `IBlockState getBlockState(BlockPos pos)`
- `IBlockState getBlockState(int x, int y, int z)`
- `ExtendedBlockStorage [] getBlockStorageArray()`
- `ChunkPos getChunkCoordIntPair()`
- `<T extends Entity> void getEntitiesOfTypeWithinAAAB(java.lang.Class<? extends T> entityClass, AxisAlignedBB aabb, java.util.List<T> listToFill, com.google.common.base.Predicate<? super T> filter)`
- `void getEntitiesWithinAABBForEntity(Entity entityIn, AxisAlignedBB aabb, java.util.List<Entity> listToFill, com.google.common.base.Predicate<? super Entity> p_177414_4_)`
- `ClassInheritanceMultiMap<Entity>[] getEntityLists()`
- `int getHeight(BlockPos pos)`
- `int[] getHeightMap()`
- `int getHeightValue(int x, int z)`
- `long getInhabitedTime()`
- `int getLightFor(EnumSkyBlock p_177413_1_, BlockPos pos)`
- `int getLightSubtracted(BlockPos pos, int amount)`
- `int getLowestHeight()`
- `BlockPos getPrecipitationHeight(BlockPos pos)`
- `java.util.Random getRandomWithSeed(long seed)`
- `TileEntity getTileEntity(BlockPos pos, Chunk.EnumCreateEntityType p_177424_2_)`
- `java.util.Map<BlockPos, TileEntity> getTileEntityMap()`
- `int getTopFilledSegment()`
- `World getWorld()`
- `boolean isAtLocation(int x, int z)`
- `boolean isChunkTicked()`
- `boolean isEmpty()`
- `boolean isLightPopulated()`
- `boolean isLoaded()`
- `boolean isPopulated()`
- `boolean isTerrainPopulated()`
- `boolean needsSaving(boolean p_76601_1_)`
- `void onChunkLoad()`
- `void onChunkUnload()`
- `void onTick(boolean p_150804_1_)`
- `protected void populateChunk(IChunkGenerator generator)`
- `void populateChunk(IChunkProvider chunkProvider, IChunkGenerator chunkGenrator)`
- `void removeEntity(Entity entityIn)`
- `void removeEntityAtIndex(Entity entityIn, int index)`
- `void removeInvalidTileEntity(BlockPos pos)` — Removes the tile entity at the specified position, only if it's marked as invalid.
- `void removeTileEntity(BlockPos pos)`
- `void resetRelightChecks()`
- `void setBiomeArray(byte[] biomeArray)`
- `IBlockState setBlockState(BlockPos pos, IBlockState state)`
- `void setChunkLoaded(boolean loaded)`
- `void setChunkModified()`
- `void setHasEntities(boolean hasEntitiesIn)`
- `void setHeightMap(int[] newHeightMap)`
- `void setInhabitedTime(long newInhabitedTime)`
- `void setLastSaveTime(long saveTime)`
- `void setLightFor(EnumSkyBlock p_177431_1_, BlockPos pos, int value)`
- `void setLightPopulated(boolean lightPopulated)`
- `void setModified(boolean modified)`
- `void setStorageArrays(ExtendedBlockStorage [] newStorageArrays)`
- `void setTerrainPopulated(boolean terrainPopulated)`

## Fields

- `static ExtendedBlockStorage NULL_BLOCK_STORAGE`
- `boolean unloaded`
- `int xPosition`
- `int zPosition`