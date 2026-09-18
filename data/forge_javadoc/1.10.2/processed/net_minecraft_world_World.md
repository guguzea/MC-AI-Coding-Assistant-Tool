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
- `@Nullable public MinecraftServer getMinecraftServer()`
- `public void setInitialSpawnLocation()`
- `public IBlockState getGroundAboveSeaLevel( BlockPos pos)`
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
- `public boolean setBlockState( BlockPos pos, IBlockState newState, int flags)`
- `public void markAndNotifyBlock( BlockPos pos, Chunk chunk, IBlockState iblockstate, IBlockState newState, int flags)`
- `public boolean setBlockToAir( BlockPos pos)`
- `public boolean destroyBlock( BlockPos pos, boolean dropBlock)`
- `public boolean setBlockState( BlockPos pos, IBlockState state)`
- `public void notifyBlockUpdate( BlockPos pos, IBlockState oldState, IBlockState newState, int flags)`
- `public void notifyNeighborsRespectDebug( BlockPos pos, Block blockType)`
- `public void markBlocksDirtyVertical(int x1, int z1, int x2, int z2)`
- `public void markBlockRangeForRenderUpdate( BlockPos rangeMin, BlockPos rangeMax)`
- `public void markBlockRangeForRenderUpdate(int x1, int y1, int z1, int x2, int y2, int z2)`
- `public void notifyNeighborsOfStateChange( BlockPos pos, Block blockType)`
- `public void notifyNeighborsOfStateExcept( BlockPos pos, Block blockType, EnumFacing skipSide)`
- `public void notifyBlockOfStateChange( BlockPos pos, Block blockIn)`
- `public boolean isBlockTickPending( BlockPos pos, Block blockType)`
- `public boolean canSeeSky( BlockPos pos)`
- `public boolean canBlockSeeSky( BlockPos pos)`
- `public int getLight( BlockPos pos)`
- `public int getLightFromNeighbors( BlockPos pos)`
- `public int getLight( BlockPos pos, boolean checkNeighbors)`
- `public BlockPos getHeight( BlockPos pos)`
- `public int getHeightmapHeight(int x, int z)`
- `@Deprecated public int getChunksLowestHorizon(int x, int z)`
- `public int getLightFromNeighborsFor( EnumSkyBlock type, BlockPos pos)`
- `public int getLightFor( EnumSkyBlock type, BlockPos pos)`
- `public void setLightFor( EnumSkyBlock type, BlockPos pos, int lightValue)`
- `public void notifyLightSet( BlockPos pos)`
- `public int getCombinedLight( BlockPos pos, int lightValue)`
- `public float getLightBrightness( BlockPos pos)`
- `public IBlockState getBlockState( BlockPos pos)`
- `public boolean isDaytime()`
- `@Nullable public RayTraceResult rayTraceBlocks( Vec3d start, Vec3d end)`
- `@Nullable public RayTraceResult rayTraceBlocks( Vec3d start, Vec3d end, boolean stopOnLiquid)`
- `@Nullable public RayTraceResult rayTraceBlocks( Vec3d vec31, Vec3d vec32, boolean stopOnLiquid, boolean ignoreBlockWithoutBoundingBox, boolean returnLastUncollidableBlock)`
- `public void playSound(@Nullable EntityPlayer player, BlockPos pos, SoundEvent soundIn, SoundCategory category, float volume, float pitch)`
- `public void playSound(@Nullable EntityPlayer player, double x, double y, double z, SoundEvent soundIn, SoundCategory category, float volume, float pitch)`
- `public void playSound(double x, double y, double z, SoundEvent soundIn, SoundCategory category, float volume, float pitch, boolean distanceDelay)`
- `public void playRecord( BlockPos blockPositionIn, @Nullable SoundEvent soundEventIn)`
- `public void spawnParticle( EnumParticleTypes particleType, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `public void spawnParticle( EnumParticleTypes particleType, boolean ignoreRange, double xCoord, double yCoord, double zCoord, double xSpeed, double ySpeed, double zSpeed, int... parameters)`
- `public boolean addWeatherEffect( Entity entityIn)`
- `public boolean spawnEntityInWorld( Entity entityIn)`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public void removeEntity( Entity entityIn)`
- `public void removeEntityDangerously( Entity entityIn)`
- `public void addEventListener( IWorldEventListener listener)`
- `public java.util.List< AxisAlignedBB > getCollisionBoxes(@Nullable Entity entityIn, AxisAlignedBB aabb)`
- `public boolean isInsideBorder( WorldBorder worldBorderIn, Entity entityIn)`
- `public java.util.List< AxisAlignedBB > getCollisionBoxes( AxisAlignedBB bb)`
- `public void removeEventListener( IWorldEventListener listener)`
- `public boolean collidesWithAnyBlock( AxisAlignedBB bbox)`
- `public int calculateSkylightSubtracted(float partialTicks)`
- `public float getSunBrightnessFactor(float partialTicks)`
- `public float getSunBrightness(float p_72971_1_)`
- `public float getSunBrightnessBody(float p_72971_1_)`
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
- `public boolean checkNoEntityCollision( AxisAlignedBB bb, @Nullable Entity entityIn)`
- `public boolean checkBlockCollision( AxisAlignedBB bb)`
- `public boolean containsAnyLiquid( AxisAlignedBB bb)`
- `public boolean isFlammableWithin( AxisAlignedBB bb)`
- `public boolean handleMaterialAcceleration( AxisAlignedBB bb, Material materialIn, Entity entityIn)`
- `public boolean isMaterialInBB( AxisAlignedBB bb, Material materialIn)`
- `public boolean isAABBInMaterial( AxisAlignedBB bb, Material materialIn)`
- `public Explosion createExplosion(@Nullable Entity entityIn, double x, double y, double z, float strength, boolean isSmoking)`
- `public Explosion newExplosion(@Nullable Entity entityIn, double x, double y, double z, float strength, boolean isFlaming, boolean isSmoking)`
- `public float getBlockDensity( Vec3d vec, AxisAlignedBB bb)`
- `public boolean extinguishFire(@Nullable EntityPlayer player, BlockPos pos, EnumFacing side)`
- `public java.lang.String getDebugLoadedEntities()`
- `public java.lang.String getProviderName()`
- `@Nullable public TileEntity getTileEntity( BlockPos pos)`
- `public void setTileEntity( BlockPos pos, @Nullable TileEntity tileEntityIn)`
- `public void removeTileEntity( BlockPos pos)`
- `public void markTileEntityForRemoval( TileEntity tileEntityIn)`
- `public boolean isBlockFullCube( BlockPos pos)`
- `public boolean isBlockNormalCube( BlockPos pos, boolean _default)`

## Description

Used in the getEntitiesWithinAABB functions to expand the search area for entities.