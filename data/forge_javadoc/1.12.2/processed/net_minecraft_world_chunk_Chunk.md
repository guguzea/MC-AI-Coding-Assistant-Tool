# Chunk

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.Chunk

## Class signature

```java
public class Chunk extends java.lang.Object implements ICapabilityProvider
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
- `protected void generateHeightMap()`
- `void generateSkylightMap()`
- `Biome getBiome(BlockPos pos, BiomeProvider provider)`
- `byte[] getBiomeArray()`
- `int getBlockLightOpacity(BlockPos pos)`
- `IBlockState getBlockState(BlockPos pos)`
- `IBlockState getBlockState(int x, int y, int z)`
- `ExtendedBlockStorage [] getBlockStorageArray()`
- `CapabilityDispatcher getCapabilities()`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `<T extends Entity> void getEntitiesOfTypeWithinAABB(java.lang.Class<? extends T> entityClass, AxisAlignedBB aabb, java.util.List<T> listToFill, <any> filter)`
- `void getEntitiesWithinAABBForEntity(Entity entityIn, AxisAlignedBB aabb, java.util.List<Entity> listToFill, <any> filter)`
- `ClassInheritanceMultiMap<Entity>[] getEntityLists()`
- `int getHeight(BlockPos pos)`
- `int[] getHeightMap()`
- `int getHeightValue(int x, int z)`
- `long getInhabitedTime()`
- `int getLightFor(EnumSkyBlock type, BlockPos pos)`
- `int getLightSubtracted(BlockPos pos, int amount)`
- `int getLowestHeight()`
- `ChunkPos getPos()`
- `BlockPos getPrecipitationHeight(BlockPos pos)`
- `java.util.Random getRandomWithSeed(long seed)`
- `TileEntity getTileEntity(BlockPos pos, Chunk.EnumCreateEntityType p_177424_2_)`
- `java.util.Map<BlockPos, TileEntity> getTileEntityMap()`
- `int getTopFilledSegment()`
- `World getWorld()`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean isAtLocation(int x, int z)`
- `boolean isEmpty()`
- `boolean isEmptyBetween(int startY, int endY)`
- `boolean isLightPopulated()`
- `boolean isLoaded()`
- `boolean isPopulated()`
- `boolean isTerrainPopulated()`
- `void markDirty()`
- `void markLoaded(boolean loaded)`
- `boolean needsSaving(boolean p_76601_1_)`
- `void onLoad()`
- `void onTick(boolean skipRecheckGaps)`
- `void onUnload()`
- `protected void populate(IChunkGenerator generator)`
- `void populate(IChunkProvider chunkProvider, IChunkGenerator chunkGenrator)`
- `void read(PacketBuffer buf, int availableSections, boolean groundUpContinuous)`
- `void removeEntity(Entity entityIn)`
- `void removeEntityAtIndex(Entity entityIn, int index)`
- `void removeInvalidTileEntity(BlockPos pos)` — Removes the tile entity at the specified position, only if it's marked as invalid.
- `void removeTileEntity(BlockPos pos)`
- `void resetRelightChecks()`
- `void setBiomeArray(byte[] biomeArray)`
- `IBlockState setBlockState(BlockPos pos, IBlockState state)`
- `void setHasEntities(boolean hasEntitiesIn)`
- `void setHeightMap(int[] newHeightMap)`
- `void setInhabitedTime(long newInhabitedTime)`
- `void setLastSaveTime(long saveTime)`
- `void setLightFor(EnumSkyBlock type, BlockPos pos, int value)`
- `void setLightPopulated(boolean lightPopulated)`
- `void setModified(boolean modified)`
- `void setStorageArrays(ExtendedBlockStorage [] newStorageArrays)`
- `void setTerrainPopulated(boolean terrainPopulated)`
- `boolean wasTicked()`

## Fields

- `static ExtendedBlockStorage NULL_BLOCK_STORAGE`
- `boolean unloadQueued`
- `int x`
- `int z`