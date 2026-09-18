# World

## Class signature

```java
public abstract class World extends java.lang.Object implements IBlockAccess , ICapabilityProvider
```

## Constructors

- `protected World( ISaveHandler saveHandlerIn, WorldInfo info, WorldProvider providerIn, Profiler profilerIn, boolean client)`

## Methods

- `public World init()`
- `public Biome getBiome( BlockPos pos)`
- `public Biome getBiomeForCoordsBody( BlockPos pos)`
- `public BiomeProvider getBiomeProvider()`
- `protected abstract IChunkProvider createChunkProvider()`
- `public void initialize( WorldSettings settings)`
- `public MinecraftServer getMinecraftServer()`
- `public void setInitialSpawnLocation()`
- `public IBlockState getGroundAboveSeaLevel( BlockPos pos)`
- `public boolean isValid( BlockPos pos)`
- `public boolean isOutsideBuildHeight( BlockPos pos)`
- `public boolean isAirBlock( BlockPos pos)`
- `public boolean isBlockLoaded( BlockPos pos)`
- `public boolean isBlockLoaded( BlockPos pos, boolean allowEmpty)`
- `public boolean isAreaLoaded( BlockPos center, int radius)`
- `public boolean isAreaLoaded( BlockPos center, int radius, boolean allowEmpty)`
- `public boolean isAreaLoaded( BlockPos from, BlockPos to)`
- `public boolean isAreaLoaded( BlockPos from, BlockPos to, boolean allowEmpty)`
- `public boolean isAreaLoaded( StructureBoundingBox box)`
- `public boolean isAreaLoaded( StructureBoundingBox box, boolean allowEmpty)`
- `protected abstract boolean isChunkLoaded(int x, int z, boolean allowEmpty)`
- `public Chunk getChunkFromBlockCoords( BlockPos pos)`
- `public Chunk getChunkFromChunkCoords(int chunkX, int chunkZ)`
- `public boolean isChunkGeneratedAt(int x, int z)`
- `public boolean setBlockState( BlockPos pos, IBlockState newState, int flags)`
- `public void markAndNotifyBlock( BlockPos pos, Chunk chunk, IBlockState iblockstate, IBlockState newState, int flags)`
- `public boolean setBlockToAir( BlockPos pos)`
- `public boolean destroyBlock( BlockPos pos, boolean dropBlock)`
- `public boolean setBlockState( BlockPos pos, IBlockState state)`
- `public void notifyBlockUpdate( BlockPos pos, IBlockState oldState, IBlockState newState, int flags)`
- `public void notifyNeighborsRespectDebug( BlockPos pos, Block blockType, boolean p_175722_3_)`
- `public void markBlocksDirtyVertical(int x, int z, int y1, int y2)`
- `public void markBlockRangeForRenderUpdate( BlockPos rangeMin, BlockPos rangeMax)`
- `public void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `public void updateObservingBlocksAt( BlockPos pos, Block blockType)`
- `public void notifyNeighborsOfStateChange( BlockPos pos, Block blockType, boolean updateObservers)`
- `public void notifyNeighborsOfStateExcept( BlockPos pos, Block blockType, EnumFacing skipSide)`
- `public void neighborChanged( BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void observedNeighborChanged( BlockPos pos, Block p_190529_2_, BlockPos p_190529_3_)`
- `public boolean isBlockTickPending( BlockPos pos, Block blockType)`
- `public boolean canSeeSky( BlockPos pos)`
- `public boolean canBlockSeeSky( BlockPos pos)`
- `public int getLight( BlockPos pos)`
- `public int getLightFromNeighbors( BlockPos pos)`
- `public int getLight( BlockPos pos, boolean checkNeighbors)`
- `public BlockPos getHeight( BlockPos pos)`
- `public int getHeight(int x, int z)`
- `@Deprecated public int getChunksLowestHorizon(int x, int z)`
- `public int getLightFromNeighborsFor( EnumSkyBlock type, BlockPos pos)`
- `public int getLightFor( EnumSkyBlock type, BlockPos pos)`
- `public void setLightFor( EnumSkyBlock type, BlockPos pos, int lightValue)`
- `public void notifyLightSet( BlockPos pos)`
- `public int getCombinedLight( BlockPos pos, int lightValue)`
- `public float getLightBrightness( BlockPos pos)`
- `public IBlockState getBlockState( BlockPos pos)`
- `public boolean isDaytime()`
- `public RayTraceResult rayTraceBlocks( Vec3d start, Vec3d end)`
- `public RayTraceResult rayTraceBlocks( Vec3d start, Vec3d end, boolean stopOnLiquid)`
- `public RayTraceResult rayTraceBlocks( Vec3d vec31, Vec3d vec32, boolean stopOnLiquid, boolean ignoreBlockWithoutBoundingBox, boolean returnLastUncollidableBlock)`
- `public void playSound( EntityPlayer player, BlockPos pos, SoundEvent soundIn, SoundCategory category, float volume, float pitch)`
- `public void playSound( EntityPlayer player, double x, double y, double z, SoundEvent soundIn, SoundCategory category, float volume, float pitch)`
- `public void playSound(double x, double y, double z, SoundEvent soundIn, SoundCategory category, float volume, float pitch, boolean distanceDelay)`
- `public void playRecord( BlockPos blockPositionIn, SoundEvent soundEventIn)`
- `public void spawnParticle( EnumParticleTypes particleType, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `public void spawnAlwaysVisibleParticle(int p_190523_1_, double p_190523_2_, double p_190523_4_, double p_190523_6_, double p_190523_8_, double p_190523_10_, double p_190523_12_, int... p_190523_14_)`
- `public void spawnParticle( EnumParticleTypes particleType, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `public boolean addWeatherEffect( Entity entityIn)`
- `public boolean spawnEntity( Entity entityIn)`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public void removeEntity( Entity entityIn)`
- `public void removeEntityDangerously( Entity entityIn)`
- `public void addEventListener( IWorldEventListener listener)`
- `public java.util.List< AxisAlignedBB > getCollisionBoxes( Entity entityIn, AxisAlignedBB aabb)`
- `public void removeEventListener( IWorldEventListener listener)`
- `public boolean isInsideWorldBorder( Entity p_191503_1_)`
- `public boolean collidesWithAnyBlock( AxisAlignedBB bbox)`
- `public int calculateSkylightSubtracted(float partialTicks)`
- `public float getSunBrightnessFactor(float partialTicks)`
- `public float getSunBrightness(float partialTicks)`
- `public float getSunBrightnessBody(float partialTicks)`
- `public Vec3d getSkyColor( Entity entityIn, float partialTicks)`
- `public Vec3d getSkyColorBody( Entity entityIn, float partialTicks)`
- `public float getCelestialAngle(float partialTicks)`
- `public int getMoonPhase()`
- `public float getCurrentMoonPhaseFactor()`
- `public float getCurrentMoonPhaseFactorBody()`
- `public float getCelestialAngleRadians(float partialTicks)`
- `public Vec3d getCloudColour(float partialTicks)`
- `public Vec3d getCloudColorBody(float partialTicks)`
- `public Vec3d getFogColor(float partialTicks)`
- `public BlockPos getPrecipitationHeight( BlockPos pos)`
- `public BlockPos getTopSolidOrLiquidBlock( BlockPos pos)`
- `public float getStarBrightness(float partialTicks)`
- `public float getStarBrightnessBody(float partialTicks)`
- `public boolean isUpdateScheduled( BlockPos pos, Block blk)`
- `public void scheduleUpdate( BlockPos pos, Block blockIn, int delay)`
- `public void updateBlockTick( BlockPos pos, Block blockIn, int delay, int priority)`
- `public void scheduleBlockUpdate( BlockPos pos, Block blockIn, int delay, int priority)`
- `public void updateEntities()`
- `protected void tickPlayers()`
- `public boolean addTileEntity( TileEntity tile)`
- `public void addTileEntities(java.util.Collection< TileEntity > tileEntityCollection)`
- `public void updateEntity( Entity ent)`
- `public void updateEntityWithOptionalForce( Entity entityIn, boolean forceUpdate)`
- `public boolean checkNoEntityCollision( AxisAlignedBB bb)`
- `public boolean checkNoEntityCollision( AxisAlignedBB bb, Entity entityIn)`
- `public boolean checkBlockCollision( AxisAlignedBB bb)`
- `public boolean containsAnyLiquid( AxisAlignedBB bb)`
- `public boolean isFlammableWithin( AxisAlignedBB bb)`
- `public boolean handleMaterialAcceleration( AxisAlignedBB bb, Material materialIn, Entity entityIn)`
- `public boolean isMaterialInBB( AxisAlignedBB bb, Material materialIn)`
- `public Explosion createExplosion( Entity entityIn, double x, double y, double z, float strength, boolean isSmoking)`
- `public Explosion newExplosion( Entity entityIn, double x, double y, double z, float strength, boolean isFlaming, boolean isSmoking)`
- `public float getBlockDensity( Vec3d vec, AxisAlignedBB bb)`
- `public boolean extinguishFire( EntityPlayer player, BlockPos pos, EnumFacing side)`
- `public java.lang.String getDebugLoadedEntities()`
- `public java.lang.String getProviderName()`
- `public TileEntity getTileEntity( BlockPos pos)`
- `public void setTileEntity( BlockPos pos, TileEntity tileEntityIn)`

## Description

Used in the getEntitiesWithinAABB functions to expand the search area for entities.