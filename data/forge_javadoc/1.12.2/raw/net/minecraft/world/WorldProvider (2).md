---
title: "WorldProvider"
description: "Determines if the player can sleep in this world (or if the bed should explode for example)."
package: "net/minecraft/world"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/WorldProvider.html"
sourceType: javadoc
---

# WorldProvider

## Class signature

```java
public abstract class WorldProvider extends java.lang.Object
```

## Constructors

- `public WorldProvider()`

## Methods

- `public final void setWorld( World worldIn)`
- `protected void generateLightBrightnessTable()`
- `protected void init()`
- `public IChunkGenerator createChunkGenerator()`
- `public boolean canCoordinateBeSpawn(int x, int z)`
- `public float calculateCelestialAngle(long worldTime, float partialTicks)`
- `public int getMoonPhase(long worldTime)`
- `public boolean isSurfaceWorld()`
- `public float[] calcSunriseSunsetColors(float celestialAngle, float partialTicks)`
- `public Vec3d getFogColor(float p_76562_1_, float p_76562_2_)`
- `public boolean canRespawnHere()`
- `public float getCloudHeight()`
- `public boolean isSkyColored()`
- `public BlockPos getSpawnCoordinate()`
- `public int getAverageGroundLevel()`
- `public double getVoidFogYFactor()`
- `public boolean doesXZShowFog(int x, int z)`
- `public BiomeProvider getBiomeProvider()`
- `public boolean doesWaterVaporize()`
- `public boolean hasSkyLight()`
- `public boolean isNether()`
- `public float[] getLightBrightnessTable()`
- `public WorldBorder createWorldBorder()`
- `public void setDimension(int dim)`
- `public int getDimension()`
- `public java.lang.String getSaveFolder()`
- `public double getMovementFactor()`
- `public boolean shouldClientCheckLighting()`
- `public IRenderHandler getSkyRenderer()`
- `public void setSkyRenderer( IRenderHandler skyRenderer)`
- `public IRenderHandler getCloudRenderer()`
- `public void setCloudRenderer( IRenderHandler renderer)`
- `public IRenderHandler getWeatherRenderer()`
- `public void setWeatherRenderer( IRenderHandler renderer)`
- `public void getLightmapColors(float partialTicks, float sunBrightness, float skyLight, float blockLight, float[] colors)`
- `public BlockPos getRandomizedSpawnPoint()`
- `public boolean shouldMapSpin(java.lang.String entity, double x, double z, double rotation)`
- `public int getRespawnDimension( EntityPlayerMP player)`
- `public ICapabilityProvider initCapabilities()`
- `public MusicTicker.MusicType getMusicType()`
- `public WorldProvider.WorldSleepResult canSleepAt( EntityPlayer player, BlockPos pos)`
- `public Biome getBiomeForCoords( BlockPos pos)`
- `public boolean isDaytime()`
- `public float getSunBrightnessFactor(float par1)`
- `public float getCurrentMoonPhaseFactor()`
- `public Vec3d getSkyColor( Entity cameraEntity, float partialTicks)`
- `public Vec3d getCloudColor(float partialTicks)`
- `public float getSunBrightness(float par1)`
- `public float getStarBrightness(float par1)`
- `public void setAllowedSpawnTypes(boolean allowHostile, boolean allowPeaceful)`
- `public void calculateInitialWeather()`
- `public void updateWeather()`
- `public boolean canBlockFreeze( BlockPos pos, boolean byWater)`
- `public boolean canSnowAt( BlockPos pos, boolean checkLight)`
- `public void setWorldTime(long time)`
- `public long getSeed()`
- `public long getWorldTime()`
- `public BlockPos getSpawnPoint()`
- `public void setSpawnPoint( BlockPos pos)`
- `public boolean canMineBlock( EntityPlayer player, BlockPos pos)`
- `public boolean isBlockHighHumidity( BlockPos pos)`
- `public int getHeight()`
- `public int getActualHeight()`
- `public double getHorizon()`
- `public void resetRainAndThunder()`
- `public boolean canDoLightning( Chunk chunk)`
- `public boolean canDoRainSnowIce( Chunk chunk)`
- `public void onPlayerAdded( EntityPlayerMP player)`
- `public void onPlayerRemoved( EntityPlayerMP player)`
- `public abstract DimensionType getDimensionType()`
- `public void onWorldSave()`
- `public void onWorldUpdateEntities()`
- `public boolean canDropChunk(int x, int z)`

## Description

Determines if the player can sleep in this world (or if the bed should explode for example).
