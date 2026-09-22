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

- `void addEntity(Entity entityIn)` — Adds an entity to the chunk.
- `void addTileEntity(BlockPos pos, TileEntity tileEntityIn)`
- `void addTileEntity(TileEntity tileEntityIn)`
- `boolean canSeeSky(BlockPos pos)`
- `void enqueueRelightChecks()` — Called once-per-chunk-per-tick, and advances the round-robin relight check index by up to 8 blocks at a time.
- `void fillChunk(byte[] p_177439_1_, int p_177439_2_, boolean p_177439_3_)` — Initialize this chunk with new binary data.
- `void func_150804_b(boolean p_150804_1_)`
- `void func_150809_p()`
- `protected void generateHeightMap()` — Generates the height map for a chunk from scratch
- `void generateSkylightMap()` — Generates the initial skylight map for the chunk upon generation or load.
- `boolean getAreLevelsEmpty(int startY, int endY)` — Returns whether the ExtendedBlockStorages containing levels (in blocks) from arg 1 to arg 2 are fully empty (true) or not (false).
- `BiomeGenBase getBiome(BlockPos pos, WorldChunkManager chunkManager)`
- `byte[] getBiomeArray()` — Returns an array containing a 16x16 mapping on the X/Z of block positions in this Chunk to biome IDs.
- `Block getBlock(BlockPos pos)`
- `Block getBlock(int x, int y, int z)`
- `int getBlockLightOpacity(BlockPos pos)`
- `int getBlockMetadata(BlockPos pos)`
- `IBlockState getBlockState(BlockPos pos)`
- `ExtendedBlockStorage [] getBlockStorageArray()` — Returns the ExtendedBlockStorage array for this Chunk.
- `ChunkCoordIntPair getChunkCoordIntPair()` — Gets a ChunkCoordIntPair representing the Chunk's position.
- `<T extends Entity> void getEntitiesOfTypeWithinAAAB(java.lang.Class<? extends T> entityClass, AxisAlignedBB aabb, java.util.List<T> listToFill, <any> p_177430_4_)`
- `void getEntitiesWithinAABBForEntity(Entity entityIn, AxisAlignedBB aabb, java.util.List<Entity> listToFill, <any> p_177414_4_)` — Fills the given list of all entities that intersect within the given bounding box that aren't the passed entity.
- `ClassInheritanceMultiMap<Entity>[] getEntityLists()`
- `int getHeight(BlockPos pos)`
- `int[] getHeightMap()`
- `int getHeightValue(int x, int z)` — Returns the value in the height map at this x, z coordinate in the chunk
- `long getInhabitedTime()`
- `int getLightFor(EnumSkyBlock p_177413_1_, BlockPos pos)`
- `int getLightSubtracted(BlockPos pos, int amount)`
- `int getLowestHeight()`
- `BlockPos getPrecipitationHeight(BlockPos pos)`
- `java.util.Random getRandomWithSeed(long seed)`
- `TileEntity getTileEntity(BlockPos pos, Chunk.EnumCreateEntityType p_177424_2_)`
- `java.util.Map<BlockPos, TileEntity> getTileEntityMap()`
- `int getTopFilledSegment()` — Returns the topmost ExtendedBlockStorage instance for this Chunk that actually contains a block.
- `World getWorld()`
- `boolean isAtLocation(int x, int z)` — Checks whether the chunk is at the X/Z location specified
- `boolean isEmpty()`
- `boolean isLightPopulated()`
- `boolean isLoaded()`
- `boolean isPopulated()`
- `boolean isTerrainPopulated()`
- `boolean needsSaving(boolean p_76601_1_)` — Returns true if this Chunk needs to be saved
- `void onChunkLoad()` — Called when this Chunk is loaded by the ChunkProvider
- `void onChunkUnload()` — Called when this Chunk is unloaded by the ChunkProvider
- `void populateChunk(IChunkProvider p_76624_1_, IChunkProvider p_76624_2_, int p_76624_3_, int p_76624_4_)`
- `void removeEntity(Entity entityIn)` — removes entity using its y chunk coordinate as its index
- `void removeEntityAtIndex(Entity entityIn, int p_76608_2_)` — Removes entity at the specified index from the entity array.
- `void removeInvalidTileEntity(BlockPos pos)` — Removes the tile entity at the specified position, only if it's marked as invalid.
- `void removeTileEntity(BlockPos pos)`
- `void resetRelightChecks()` — Resets the relight check index to 0 for this Chunk.
- `void setBiomeArray(byte[] biomeArray)` — Accepts a 256-entry array that contains a 16x16 mapping on the X/Z plane of block positions in this Chunk to biome IDs.
- `IBlockState setBlockState(BlockPos pos, IBlockState state)`
- `void setChunkLoaded(boolean loaded)`
- `void setChunkModified()` — Sets the isModified flag for this Chunk
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

- `int xPosition` — The x coordinate of the chunk.
- `int zPosition` — The z coordinate of the chunk.