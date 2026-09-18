# Chunk

## Class signature

```java
public class Chunk extends java.lang.Object implements ICapabilityProvider
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
- `public IBlockState setBlockState( BlockPos pos, IBlockState state)`
- `public int getLightFor( EnumSkyBlock type, BlockPos pos)`
- `public void setLightFor( EnumSkyBlock type, BlockPos pos, int value)`
- `public int getLightSubtracted( BlockPos pos, int amount)`
- `public void addEntity( Entity entityIn)`
- `public void removeEntity( Entity entityIn)`
- `public void removeEntityAtIndex( Entity entityIn, int index)`
- `public boolean canSeeSky( BlockPos pos)`
- `public TileEntity getTileEntity( BlockPos pos, Chunk.EnumCreateEntityType p_177424_2_)`
- `public void addTileEntity( TileEntity tileEntityIn)`
- `public void addTileEntity( BlockPos pos, TileEntity tileEntityIn)`
- `public void removeTileEntity( BlockPos pos)`
- `public void onLoad()`
- `public void onUnload()`
- `public void markDirty()`
- `public void getEntitiesWithinAABBForEntity( Entity entityIn, AxisAlignedBB aabb, java.util.List< Entity > listToFill, <any> filter)`
- `public <T extends Entity > void getEntitiesOfTypeWithinAABB(java.lang.Class<? extends T> entityClass, AxisAlignedBB aabb, java.util.List<T> listToFill, <any> filter)`
- `public boolean needsSaving(boolean p_76601_1_)`
- `public java.util.Random getRandomWithSeed(long seed)`
- `public boolean isEmpty()`
- `public void populate( IChunkProvider chunkProvider, IChunkGenerator chunkGenrator)`
- `protected void populate( IChunkGenerator generator)`
- `public BlockPos getPrecipitationHeight( BlockPos pos)`
- `public void onTick(boolean skipRecheckGaps)`
- `public boolean isPopulated()`
- `public boolean wasTicked()`
- `public ChunkPos getPos()`
- `public boolean isEmptyBetween(int startY, int endY)`
- `public void setStorageArrays( ExtendedBlockStorage [] newStorageArrays)`
- `public void read( PacketBuffer buf, int availableSections, boolean groundUpContinuous)`
- `public Biome getBiome( BlockPos pos, BiomeProvider provider)`
- `public byte[] getBiomeArray()`
- `public void setBiomeArray(byte[] biomeArray)`
- `public void resetRelightChecks()`
- `public void enqueueRelightChecks()`
- `public void checkLight()`
- `public boolean isLoaded()`
- `public void markLoaded(boolean loaded)`
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
- `public CapabilityDispatcher getCapabilities()`
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`

## Description

Retrieves the handler for the capability requested on the specific side.