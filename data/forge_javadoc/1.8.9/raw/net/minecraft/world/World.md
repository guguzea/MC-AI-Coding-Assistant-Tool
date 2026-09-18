---
title: "World"
description: "Handles chunk operations and caching"
package: "net/minecraft/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/World.html"
sourceType: javadoc
---

# World

## Class signature

```java
public abstract class World extends java.lang.Object implements IBlockAccess
```

## Constructors

- `protected World( ISaveHandler saveHandlerIn, WorldInfo info, WorldProvider providerIn, Profiler profilerIn, boolean client)`

## Methods

- `public World init()`
- `public BiomeGenBase getBiomeGenForCoords( BlockPos pos)`
- `public BiomeGenBase getBiomeGenForCoordsBody( BlockPos pos)`
- `public WorldChunkManager getWorldChunkManager()`
- `protected abstract IChunkProvider createChunkProvider()`
- `public void initialize( WorldSettings settings)`
- `public void setInitialSpawnLocation()`
- `public Block getGroundAboveSeaLevel( BlockPos pos)`
- `public boolean isAirBlock( BlockPos pos)`
- `public boolean isBlockLoaded( BlockPos pos)`
- `public boolean isBlockLoaded( BlockPos pos, boolean allowEmpty)`
- `public boolean isAreaLoaded( BlockPos center, int radius)`
- `public boolean isAreaLoaded( BlockPos center, int radius, boolean allowEmpty)`
- `public boolean isAreaLoaded( BlockPos from, BlockPos to)`
- `public boolean isAreaLoaded( BlockPos from, BlockPos to, boolean allowEmpty)`
- `public boolean isAreaLoaded( StructureBoundingBox box)`
- `public boolean isAreaLoaded( StructureBoundingBox box, boolean allowEmpty)`
- `protected boolean isChunkLoaded(int x, int z, boolean allowEmpty)`
- `public Chunk getChunkFromBlockCoords( BlockPos pos)`
- `public Chunk getChunkFromChunkCoords(int chunkX, int chunkZ)`
- `public boolean setBlockState( BlockPos pos, IBlockState newState, int flags)`
- `public void markAndNotifyBlock( BlockPos pos, Chunk chunk, IBlockState old, IBlockState new_, int flags)`
- `public boolean setBlockToAir( BlockPos pos)`
- `public boolean destroyBlock( BlockPos pos, boolean dropBlock)`
- `public boolean setBlockState( BlockPos pos, IBlockState state)`
- `public void markBlockForUpdate( BlockPos pos)`
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
- `public int getChunksLowestHorizon(int x, int z)`
- `public int getLightFor( EnumSkyBlock type, BlockPos pos)`
- `public int getLightFromNeighborsFor( EnumSkyBlock type, BlockPos pos)`
- `public void setLightFor( EnumSkyBlock type, BlockPos pos, int lightValue)`
- `public void notifyLightSet( BlockPos pos)`
- `public int getCombinedLight( BlockPos pos, int lightValue)`
- `public float getLightBrightness( BlockPos pos)`
- `public IBlockState getBlockState( BlockPos pos)`
- `public boolean isDaytime()`
- `public MovingObjectPosition rayTraceBlocks( Vec3 p_72933_1_, Vec3 p_72933_2_)`
- `public MovingObjectPosition rayTraceBlocks( Vec3 start, Vec3 end, boolean stopOnLiquid)`
- `public MovingObjectPosition rayTraceBlocks( Vec3 vec31, Vec3 vec32, boolean stopOnLiquid, boolean ignoreBlockWithoutBoundingBox, boolean returnLastUncollidableBlock)`
- `public void playSoundAtEntity( Entity entityIn, java.lang.String name, float volume, float pitch)`
- `public void playSoundToNearExcept( EntityPlayer player, java.lang.String name, float volume, float pitch)`
- `public void playSoundEffect(double x, double y, double z, java.lang.String soundName, float volume, float pitch)`
- `public void playSound(double x, double y, double z, java.lang.String soundName, float volume, float pitch, boolean distanceDelay)`
- `public void playRecord( BlockPos pos, java.lang.String name)`
- `public void spawnParticle( EnumParticleTypes particleType, double xCoord, double yCoord, double zCoord, double xOffset, double yOffset, double zOffset, int... p_175688_14_)`
- `public void spawnParticle( EnumParticleTypes particleType, boolean p_175682_2_, double xCoord, double yCoord, double zCoord, double xOffset, double yOffset, double zOffset, int... p_175682_15_)`
- `public boolean addWeatherEffect( Entity entityIn)`
- `public boolean spawnEntityInWorld( Entity entityIn)`
- `public void onEntityAdded( Entity entityIn)`
- `public void onEntityRemoved( Entity entityIn)`
- `public void removeEntity( Entity entityIn)`
- `public void removePlayerEntityDangerously( Entity entityIn)`
- `public void addWorldAccess( IWorldAccess worldAccess)`
- `public java.util.List< AxisAlignedBB > getCollidingBoundingBoxes( Entity entityIn, AxisAlignedBB bb)`
- `public boolean isInsideBorder( WorldBorder worldBorderIn, Entity entityIn)`
- `public java.util.List< AxisAlignedBB > func_147461_a( AxisAlignedBB bb)`
- `public int calculateSkylightSubtracted(float p_72967_1_)`
- `public float getSunBrightnessFactor(float p_72967_1_)`
- `public void removeWorldAccess( IWorldAccess worldAccess)`
- `public float getSunBrightness(float p_72971_1_)`
- `public float getSunBrightnessBody(float p_72971_1_)`
- `public Vec3 getSkyColor( Entity entityIn, float partialTicks)`
- `public Vec3 getSkyColorBody( Entity entityIn, float partialTicks)`
- `public float getCelestialAngle(float partialTicks)`
- `public int getMoonPhase()`
- `public float getCurrentMoonPhaseFactor()`
- `public float getCurrentMoonPhaseFactorBody()`
- `public float getCelestialAngleRadians(float partialTicks)`
- `public Vec3 getCloudColour(float partialTicks)`
- `public Vec3 drawCloudsBody(float partialTicks)`
- `public Vec3 getFogColor(float partialTicks)`
- `public BlockPos getPrecipitationHeight( BlockPos pos)`
- `public BlockPos getTopSolidOrLiquidBlock( BlockPos pos)`
- `public float getStarBrightness(float partialTicks)`
- `public float getStarBrightnessBody(float partialTicks)`
- `public void scheduleUpdate( BlockPos pos, Block blockIn, int delay)`
- `public void updateBlockTick( BlockPos pos, Block blockIn, int delay, int priority)`
- `public void scheduleBlockUpdate( BlockPos pos, Block blockIn, int delay, int priority)`
- `public void updateEntities()`
- `public boolean addTileEntity( TileEntity tile)`
- `public void addTileEntities(java.util.Collection< TileEntity > tileEntityCollection)`
- `public void updateEntity( Entity ent)`
- `public void updateEntityWithOptionalForce( Entity entityIn, boolean forceUpdate)`
- `public boolean checkNoEntityCollision( AxisAlignedBB bb)`
- `public boolean checkNoEntityCollision( AxisAlignedBB bb, Entity entityIn)`
- `public boolean checkBlockCollision( AxisAlignedBB bb)`
- `public boolean isAnyLiquid( AxisAlignedBB bb)`
- `public boolean isFlammableWithin( AxisAlignedBB bb)`
- `public boolean handleMaterialAcceleration( AxisAlignedBB bb, Material materialIn, Entity entityIn)`
- `public boolean isMaterialInBB( AxisAlignedBB bb, Material materialIn)`
- `public boolean isAABBInMaterial( AxisAlignedBB bb, Material materialIn)`
- `public Explosion createExplosion( Entity entityIn, double x, double y, double z, float strength, boolean isSmoking)`
- `public Explosion newExplosion( Entity entityIn, double x, double y, double z, float strength, boolean isFlaming, boolean isSmoking)`
- `public float getBlockDensity( Vec3 vec, AxisAlignedBB bb)`
- `public boolean extinguishFire( EntityPlayer player, BlockPos pos, EnumFacing side)`
- `public java.lang.String getDebugLoadedEntities()`
- `public java.lang.String getProviderName()`
- `public TileEntity getTileEntity( BlockPos pos)`
- `public void setTileEntity( BlockPos pos, TileEntity tileEntityIn)`
- `public void removeTileEntity( BlockPos pos)`
- `public void markTileEntityForRemoval( TileEntity tileEntityIn)`
- `public boolean isBlockFullCube( BlockPos pos)`
- `public static boolean doesBlockHaveSolidTopSurface( IBlockAccess blockAccess, BlockPos pos)`
- `public boolean isBlockNormalCube( BlockPos pos, boolean _default)`
- `public void calculateInitialSkylight()`
- `public void setAllowedSpawnTypes(boolean hostile, boolean peaceful)`
- `public void tick()`

## Description

Handles chunk operations and caching
