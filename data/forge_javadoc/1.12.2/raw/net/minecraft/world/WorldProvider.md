---
title: "WorldProvider"
description: "public abstract class WorldProvider extends java.lang.Object"
package: "net/minecraft/world"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/WorldProvider.html"
sourceType: javadoc
---

# WorldProvider

**Inheritance:** java.lang.Object → net.minecraft.world.WorldProvider

## Class signature

```java
public abstract class WorldProvider extends java.lang.Object
```

## Constructors

- `WorldProvider()`

## Methods

- `float[] calcSunriseSunsetColors(float celestialAngle, float partialTicks)`
- `float calculateCelestialAngle(long worldTime, float partialTicks)`
- `void calculateInitialWeather()`
- `boolean canBlockFreeze(BlockPos pos, boolean byWater)`
- `boolean canCoordinateBeSpawn(int x, int z)`
- `boolean canDoLightning(Chunk chunk)`
- `boolean canDoRainSnowIce(Chunk chunk)`
- `boolean canDropChunk(int x, int z)`
- `boolean canMineBlock(EntityPlayer player, BlockPos pos)`
- `boolean canRespawnHere()`
- `WorldProvider.WorldSleepResult canSleepAt(EntityPlayer player, BlockPos pos)` — Determines if the player can sleep in this world (or if the bed should explode for example).
- `boolean canSnowAt(BlockPos pos, boolean checkLight)`
- `IChunkGenerator createChunkGenerator()`
- `WorldBorder createWorldBorder()`
- `boolean doesWaterVaporize()`
- `boolean doesXZShowFog(int x, int z)`
- `protected void generateLightBrightnessTable()`
- `int getActualHeight()`
- `int getAverageGroundLevel()`
- `Biome getBiomeForCoords(BlockPos pos)`
- `BiomeProvider getBiomeProvider()`
- `Vec3d getCloudColor(float partialTicks)`
- `float getCloudHeight()`
- `IRenderHandler getCloudRenderer()`
- `float getCurrentMoonPhaseFactor()` — Calculates the current moon phase factor.
- `int getDimension()`
- `abstract DimensionType getDimensionType()`
- `Vec3d getFogColor(float p_76562_1_, float p_76562_2_)`
- `int getHeight()`
- `double getHorizon()`
- `float[] getLightBrightnessTable()`
- `void getLightmapColors(float partialTicks, float sunBrightness, float skyLight, float blockLight, float[] colors)` — Allows for manipulating the coloring of the lightmap texture.
- `int getMoonPhase(long worldTime)`
- `double getMovementFactor()` — The dimension's movement factor.
- `MusicTicker.MusicType getMusicType()` — Called on the client to get the music type to play when in this world type.
- `BlockPos getRandomizedSpawnPoint()`
- `int getRespawnDimension(EntityPlayerMP player)` — Determines the dimension the player will be respawned in, typically this brings them back to the overworld.
- `java.lang.String getSaveFolder()` — Returns the sub-folder of the world folder that this WorldProvider saves to.
- `long getSeed()`
- `Vec3d getSkyColor(Entity cameraEntity, float partialTicks)`
- `IRenderHandler getSkyRenderer()`
- `BlockPos getSpawnCoordinate()`
- `BlockPos getSpawnPoint()`
- `float getStarBrightness(float par1)` — Gets the Star Brightness for rendering sky.
- `float getSunBrightness(float par1)` — Gets the Sun Brightness for rendering sky.
- `float getSunBrightnessFactor(float par1)` — The current sun brightness factor for this dimension. 0.0f means no light at all, and 1.0f means maximum sunlight.
- `double getVoidFogYFactor()`
- `IRenderHandler getWeatherRenderer()`
- `long getWorldTime()`
- `boolean hasSkyLight()`
- `protected void init()`
- `ICapabilityProvider initCapabilities()` — Called from World.initCapabilities() , to gather capabilities for this world.
- `boolean isBlockHighHumidity(BlockPos pos)`
- `boolean isDaytime()`
- `boolean isNether()`
- `boolean isSkyColored()`
- `boolean isSurfaceWorld()`
- `void onPlayerAdded(EntityPlayerMP player)`
- `void onPlayerRemoved(EntityPlayerMP player)`
- `void onWorldSave()`
- `void onWorldUpdateEntities()`
- `void resetRainAndThunder()`
- `void setAllowedSpawnTypes(boolean allowHostile, boolean allowPeaceful)`
- `void setCloudRenderer(IRenderHandler renderer)`
- `void setDimension(int dim)` — Sets the providers current dimension ID, used in default getSaveFolder() Added to allow default providers to be registered for multiple dimensions.
- `void setSkyRenderer(IRenderHandler skyRenderer)`
- `void setSpawnPoint(BlockPos pos)`
- `void setWeatherRenderer(IRenderHandler renderer)`
- `void setWorld(World worldIn)`
- `void setWorldTime(long time)`
- `boolean shouldClientCheckLighting()` — If this method returns true, then chunks received by the client will have Chunk.resetRelightChecks() called on them, queuing lighting checks for all air blocks in the chunk (and any adjacent light-emitting blocks).
- `boolean shouldMapSpin(java.lang.String entity, double x, double z, double rotation)` — Determine if the cursor on the map should 'spin' when rendered, like it does for the player in the nether.
- `void updateWeather()`

## Fields

- `protected BiomeProvider biomeProvider`
- `protected boolean doesWaterVaporize`
- `protected boolean hasSkyLight`
- `protected float[] lightBrightnessTable`
- `static float[] MOON_PHASE_FACTORS`
- `protected boolean nether`
- `protected World world`
