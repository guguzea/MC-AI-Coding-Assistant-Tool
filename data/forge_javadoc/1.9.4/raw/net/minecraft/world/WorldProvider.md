---
title: "WorldProvider"
description: "Calculates the current moon phase factor."
package: "net/minecraft/world"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/WorldProvider.html"
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
- `protected void createBiomeProvider()`
- `public IChunkGenerator createChunkGenerator()`
- `public boolean canCoordinateBeSpawn(int x, int z)`
- `public float calculateCelestialAngle(long worldTime, float partialTicks)`
- `public int getMoonPhase(long worldTime)`
- `public boolean isSurfaceWorld()`
- `@Nullable public float[] calcSunriseSunsetColors(float celestialAngle, float partialTicks)`
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
- `public boolean getHasNoSky()`
- `public float[] getLightBrightnessTable()`
- `public WorldBorder createWorldBorder()`
- `public void setDimension(int dim)`
- `public int getDimension()`
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

Calculates the current moon phase factor.
