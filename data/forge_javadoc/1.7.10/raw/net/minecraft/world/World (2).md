---
title: "World"
description: "public abstract class World extends java.lang.Object implements IBlockAccess"
package: "net/minecraft/world"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/World.html"
sourceType: javadoc
---

# World

## Class signature

```java
public abstract class World extends java.lang.Object implements IBlockAccess
```

## Constructors

- `public World( ISaveHandler p_i45368_1_, java.lang.String p_i45368_2_, WorldProvider p_i45368_3_, WorldSettings p_i45368_4_, Profiler p_i45368_5_)`
- `public World( ISaveHandler p_i45369_1_, java.lang.String p_i45369_2_, WorldSettings p_i45369_3_, WorldProvider p_i45369_4_, Profiler p_i45369_5_)`

## Methods

- `public BiomeGenBase getBiomeGenForCoords(int p_72807_1_, int p_72807_2_)`
- `public WorldChunkManager getWorldChunkManager()`
- `protected abstract IChunkProvider createChunkProvider()`
- `protected void initialize( WorldSettings p_72963_1_)`
- `public void setSpawnLocation()`
- `public Block getTopBlock(int p_147474_1_, int p_147474_2_)`
- `public Block getBlock(int p_147439_1_, int p_147439_2_, int p_147439_3_)`
- `public boolean isAirBlock(int p_147437_1_, int p_147437_2_, int p_147437_3_)`
- `public boolean blockExists(int p_72899_1_, int p_72899_2_, int p_72899_3_)`
- `public boolean doChunksNearChunkExist(int p_72873_1_, int p_72873_2_, int p_72873_3_, int p_72873_4_)`
- `public boolean checkChunksExist(int p_72904_1_, int p_72904_2_, int p_72904_3_, int p_72904_4_, int p_72904_5_, int p_72904_6_)`
- `protected boolean chunkExists(int p_72916_1_, int p_72916_2_)`
- `public Chunk getChunkFromBlockCoords(int p_72938_1_, int p_72938_2_)`
- `public Chunk getChunkFromChunkCoords(int p_72964_1_, int p_72964_2_)`
- `public boolean setBlock(int p_147465_1_, int p_147465_2_, int p_147465_3_, Block p_147465_4_, int p_147465_5_, int p_147465_6_)`
- `public int getBlockMetadata(int p_72805_1_, int p_72805_2_, int p_72805_3_)`
- `public boolean setBlockMetadataWithNotify(int p_72921_1_, int p_72921_2_, int p_72921_3_, int p_72921_4_, int p_72921_5_)`
- `public boolean setBlockToAir(int p_147468_1_, int p_147468_2_, int p_147468_3_)`
- `public boolean func_147480_a(int p_147480_1_, int p_147480_2_, int p_147480_3_, boolean p_147480_4_)`
- `public boolean setBlock(int p_147449_1_, int p_147449_2_, int p_147449_3_, Block p_147449_4_)`
- `public void markBlockForUpdate(int p_147471_1_, int p_147471_2_, int p_147471_3_)`
- `public void notifyBlockChange(int p_147444_1_, int p_147444_2_, int p_147444_3_, Block p_147444_4_)`
- `public void markBlocksDirtyVertical(int p_72975_1_, int p_72975_2_, int p_72975_3_, int p_72975_4_)`
- `public void markBlockRangeForRenderUpdate(int p_147458_1_, int p_147458_2_, int p_147458_3_, int p_147458_4_, int p_147458_5_, int p_147458_6_)`
- `public void notifyBlocksOfNeighborChange(int p_147459_1_, int p_147459_2_, int p_147459_3_, Block p_147459_4_)`
- `public void notifyBlocksOfNeighborChange(int p_147441_1_, int p_147441_2_, int p_147441_3_, Block p_147441_4_, int p_147441_5_)`
- `public void notifyBlockOfNeighborChange(int p_147460_1_, int p_147460_2_, int p_147460_3_, Block p_147460_4_)`
- `public boolean isBlockTickScheduledThisTick(int p_147477_1_, int p_147477_2_, int p_147477_3_, Block p_147477_4_)`
- `public boolean canBlockSeeTheSky(int p_72937_1_, int p_72937_2_, int p_72937_3_)`
- `public int getFullBlockLightValue(int p_72883_1_, int p_72883_2_, int p_72883_3_)`
- `public int getBlockLightValue(int p_72957_1_, int p_72957_2_, int p_72957_3_)`
- `public int getBlockLightValue_do(int p_72849_1_, int p_72849_2_, int p_72849_3_, boolean p_72849_4_)`
- `public int getHeightValue(int p_72976_1_, int p_72976_2_)`
- `public int getChunkHeightMapMinimum(int p_82734_1_, int p_82734_2_)`
- `public int getSkyBlockTypeBrightness( EnumSkyBlock p_72925_1_, int p_72925_2_, int p_72925_3_, int p_72925_4_)`
- `public int getSavedLightValue( EnumSkyBlock p_72972_1_, int p_72972_2_, int p_72972_3_, int p_72972_4_)`
- `public void setLightValue( EnumSkyBlock p_72915_1_, int p_72915_2_, int p_72915_3_, int p_72915_4_, int p_72915_5_)`
- `public void func_147479_m(int p_147479_1_, int p_147479_2_, int p_147479_3_)`
- `public int getLightBrightnessForSkyBlocks(int p_72802_1_, int p_72802_2_, int p_72802_3_, int p_72802_4_)`
- `public float getLightBrightness(int p_72801_1_, int p_72801_2_, int p_72801_3_)`
- `public boolean isDaytime()`
- `public MovingObjectPosition rayTraceBlocks( Vec3 p_72933_1_, Vec3 p_72933_2_)`
- `public MovingObjectPosition rayTraceBlocks( Vec3 p_72901_1_, Vec3 p_72901_2_, boolean p_72901_3_)`
- `public MovingObjectPosition func_147447_a( Vec3 p_147447_1_, Vec3 p_147447_2_, boolean p_147447_3_, boolean p_147447_4_, boolean p_147447_5_)`
- `public void playSoundAtEntity( Entity p_72956_1_, java.lang.String p_72956_2_, float p_72956_3_, float p_72956_4_)`
- `public void playSoundToNearExcept( EntityPlayer p_85173_1_, java.lang.String p_85173_2_, float p_85173_3_, float p_85173_4_)`
- `public void playSoundEffect(double p_72908_1_, double p_72908_3_, double p_72908_5_, java.lang.String p_72908_7_, float p_72908_8_, float p_72908_9_)`
- `public void playSound(double p_72980_1_, double p_72980_3_, double p_72980_5_, java.lang.String p_72980_7_, float p_72980_8_, float p_72980_9_, boolean p_72980_10_)`
- `public void playRecord(java.lang.String p_72934_1_, int p_72934_2_, int p_72934_3_, int p_72934_4_)`
- `public void spawnParticle(java.lang.String p_72869_1_, double p_72869_2_, double p_72869_4_, double p_72869_6_, double p_72869_8_, double p_72869_10_, double p_72869_12_)`
- `public boolean addWeatherEffect( Entity p_72942_1_)`
- `public boolean spawnEntityInWorld( Entity p_72838_1_)`
- `public void onEntityAdded( Entity p_72923_1_)`
- `public void onEntityRemoved( Entity p_72847_1_)`
- `public void removeEntity( Entity p_72900_1_)`
- `public void removePlayerEntityDangerously( Entity p_72973_1_)`
- `public void addWorldAccess( IWorldAccess p_72954_1_)`
- `public java.util.List getCollidingBoundingBoxes( Entity p_72945_1_, AxisAlignedBB p_72945_2_)`
- `public java.util.List func_147461_a( AxisAlignedBB p_147461_1_)`
- `public int calculateSkylightSubtracted(float p_72967_1_)`
- `public void removeWorldAccess( IWorldAccess p_72848_1_)`
- `public float getSunBrightness(float p_72971_1_)`
- `public Vec3 getSkyColor( Entity p_72833_1_, float p_72833_2_)`
- `public float getCelestialAngle(float p_72826_1_)`
- `public int getMoonPhase()`
- `public float getCurrentMoonPhaseFactor()`
- `public float getCelestialAngleRadians(float p_72929_1_)`
- `public Vec3 getCloudColour(float p_72824_1_)`
- `public Vec3 getFogColor(float p_72948_1_)`
- `public int getPrecipitationHeight(int p_72874_1_, int p_72874_2_)`
- `public int getTopSolidOrLiquidBlock(int p_72825_1_, int p_72825_2_)`
- `public float getStarBrightness(float p_72880_1_)`
- `public void scheduleBlockUpdate(int p_147464_1_, int p_147464_2_, int p_147464_3_, Block p_147464_4_, int p_147464_5_)`
- `public void scheduleBlockUpdateWithPriority(int p_147454_1_, int p_147454_2_, int p_147454_3_, Block p_147454_4_, int p_147454_5_, int p_147454_6_)`
- `public void func_147446_b(int p_147446_1_, int p_147446_2_, int p_147446_3_, Block p_147446_4_, int p_147446_5_, int p_147446_6_)`
- `public void updateEntities()`
- `public void func_147448_a(java.util.Collection p_147448_1_)`
- `public void updateEntity( Entity p_72870_1_)`
- `public void updateEntityWithOptionalForce( Entity p_72866_1_, boolean p_72866_2_)`
- `public boolean checkNoEntityCollision( AxisAlignedBB p_72855_1_)`
- `public boolean checkNoEntityCollision( AxisAlignedBB p_72917_1_, Entity p_72917_2_)`
- `public boolean checkBlockCollision( AxisAlignedBB p_72829_1_)`
- `public boolean isAnyLiquid( AxisAlignedBB p_72953_1_)`
- `public boolean func_147470_e( AxisAlignedBB p_147470_1_)`
- `public boolean handleMaterialAcceleration( AxisAlignedBB p_72918_1_, Material p_72918_2_, Entity p_72918_3_)`
- `public boolean isMaterialInBB( AxisAlignedBB p_72875_1_, Material p_72875_2_)`
- `public boolean isAABBInMaterial( AxisAlignedBB p_72830_1_, Material p_72830_2_)`
- `public Explosion createExplosion( Entity p_72876_1_, double p_72876_2_, double p_72876_4_, double p_72876_6_, float p_72876_8_, boolean p_72876_9_)`
- `public Explosion newExplosion( Entity p_72885_1_, double p_72885_2_, double p_72885_4_, double p_72885_6_, float p_72885_8_, boolean p_72885_9_, boolean p_72885_10_)`
- `public float getBlockDensity( Vec3 p_72842_1_, AxisAlignedBB p_72842_2_)`
- `public boolean extinguishFire( EntityPlayer p_72886_1_, int p_72886_2_, int p_72886_3_, int p_72886_4_, int p_72886_5_)`
- `public java.lang.String getDebugLoadedEntities()`
- `public java.lang.String getProviderName()`
- `public TileEntity getTileEntity(int p_147438_1_, int p_147438_2_, int p_147438_3_)`
- `public void setTileEntity(int p_147455_1_, int p_147455_2_, int p_147455_3_, TileEntity p_147455_4_)`
- `public void removeTileEntity(int p_147475_1_, int p_147475_2_, int p_147475_3_)`
- `public void func_147457_a( TileEntity p_147457_1_)`
- `public boolean func_147469_q(int p_147469_1_, int p_147469_2_, int p_147469_3_)`
- `public static boolean doesBlockHaveSolidTopSurface( IBlockAccess p_147466_0_, int p_147466_1_, int p_147466_2_, int p_147466_3_)`
- `public boolean isBlockNormalCubeDefault(int p_147445_1_, int p_147445_2_, int p_147445_3_, boolean p_147445_4_)`
- `public void calculateInitialSkylight()`
- `public void setAllowedSpawnTypes(boolean p_72891_1_, boolean p_72891_2_)`
- `public void tick()`
- `protected void updateWeather()`
- `protected void setActivePlayerChunksAndCheckLight()`
- `protected abstract int func_152379_p()`
- `protected void func_147467_a(int p_147467_1_, int p_147467_2_, Chunk p_147467_3_)`
- `protected void func_147456_g()`
- `public boolean isBlockFreezable(int p_72884_1_, int p_72884_2_, int p_72884_3_)`
- `public boolean isBlockFreezableNaturally(int p_72850_1_, int p_72850_2_, int p_72850_3_)`
- `public boolean canBlockFreeze(int p_72834_1_, int p_72834_2_, int p_72834_3_, boolean p_72834_4_)`
- `public boolean func_147478_e(int p_147478_1_, int p_147478_2_, int p_147478_3_, boolean p_147478_4_)`
- `public boolean func_147451_t(int p_147451_1_, int p_147451_2_, int p_147451_3_)`
- `public boolean updateLightByType( EnumSkyBlock p_147463_1_, int p_147463_2_, int p_147463_3_, int p_147463_4_)`
- `public boolean tickUpdates(boolean p_72955_1_)`
- `public java.util.List getPendingBlockUpdates( Chunk p_72920_1_, boolean p_72920_2_)`
- `public java.util.List getEntitiesWithinAABBExcludingEntity( Entity p_72839_1_, AxisAlignedBB p_72839_2_)`
- `public java.util.List getEntitiesWithinAABBExcludingEntity( Entity p_94576_1_, AxisAlignedBB p_94576_2_, IEntitySelector p_94576_3_)`
- `public java.util.List getEntitiesWithinAABB(java.lang.Class p_72872_1_, AxisAlignedBB p_72872_2_)`
- `public java.util.List selectEntitiesWithinAABB(java.lang.Class p_82733_1_, AxisAlignedBB p_82733_2_, IEntitySelector p_82733_3_)`
