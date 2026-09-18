---
title: "WorldProvider"
description: "The id for the dimension (ex. -1: Nether, 0: Overworld, 1: The End)"
package: "net/minecraft/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/WorldProvider.html"
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

- `public final void registerWorld( World worldIn)`
- `protected void generateLightBrightnessTable()`
- `protected void registerWorldChunkManager()`
- `public IChunkProvider createChunkGenerator()`
- `public boolean canCoordinateBeSpawn(int x, int z)`
- `public float calculateCelestialAngle(long p_76563_1_, float p_76563_3_)`
- `public int getMoonPhase(long p_76559_1_)`
- `public boolean isSurfaceWorld()`
- `public float[] calcSunriseSunsetColors(float celestialAngle, float partialTicks)`
- `public Vec3 getFogColor(float p_76562_1_, float p_76562_2_)`
- `public boolean canRespawnHere()`
- `public static WorldProvider getProviderForDimension(int dimension)`
- `public float getCloudHeight()`
- `public boolean isSkyColored()`
- `public BlockPos getSpawnCoordinate()`
- `public int getAverageGroundLevel()`
- `public double getVoidFogYFactor()`
- `public boolean doesXZShowFog(int x, int z)`
- `public abstract java.lang.String getDimensionName()`
- `public abstract java.lang.String getInternalNameSuffix()`
- `public WorldChunkManager getWorldChunkManager()`
- `public boolean doesWaterVaporize()`
- `public boolean getHasNoSky()`
- `public float[] getLightBrightnessTable()`
- `public int getDimensionId()`
- `public WorldBorder getWorldBorder()`
- `public void setDimension(int dim)`
- `public java.lang.String getSaveFolder()`
- `public java.lang.String getWelcomeMessage()`
- `public java.lang.String getDepartMessage()`
- `public double getMovementFactor()`
- `public IRenderHandler getSkyRenderer()`
- `public void setSkyRenderer( IRenderHandler skyRenderer)`
- `public IRenderHandler getCloudRenderer()`
- `public void setCloudRenderer( IRenderHandler renderer)`
- `public IRenderHandler getWeatherRenderer()`
- `public void setWeatherRenderer( IRenderHandler renderer)`
- `public BlockPos getRandomizedSpawnPoint()`
- `public boolean shouldMapSpin(java.lang.String entity, double x, double y, double z)`
- `public int getRespawnDimension( EntityPlayerMP player)`
- `public BiomeGenBase getBiomeGenForCoords( BlockPos pos)`
- `public boolean isDaytime()`
- `public float getSunBrightnessFactor(float par1)`
- `public float getCurrentMoonPhaseFactor()`
- `public Vec3 getSkyColor( Entity cameraEntity, float partialTicks)`
- `public Vec3 drawClouds(float partialTicks)`
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

## Description

The id for the dimension (ex. -1: Nether, 0: Overworld, 1: The End)
