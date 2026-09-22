# WorldProvider

**Inheritance:** java.lang.Object → net.minecraft.world.WorldProvider

## Class signature

```java
public abstract class WorldProvider extends java.lang.Object
```

## Constructors

- `WorldProvider()`

## Methods

- `float[] calcSunriseSunsetColors(float celestialAngle, float partialTicks)` — Returns array with sunrise/sunset colors
- `float calculateCelestialAngle(long p_76563_1_, float p_76563_3_)` — Calculates the angle of sun and moon in the sky relative to a specified time (usually worldTime)
- `void calculateInitialWeather()`
- `boolean canBlockFreeze(BlockPos pos, boolean byWater)`
- `boolean canCoordinateBeSpawn(int x, int z)` — Will check if the x, z position specified is alright to be set as the map spawn point
- `boolean canDoLightning(Chunk chunk)`
- `boolean canDoRainSnowIce(Chunk chunk)`
- `boolean canMineBlock(EntityPlayer player, BlockPos pos)`
- `boolean canRespawnHere()` — True if the player can respawn in this dimension (true = overworld, false = nether).
- `boolean canSnowAt(BlockPos pos, boolean checkLight)`
- `IChunkProvider createChunkGenerator()` — Returns a new chunk provider which generates chunks for this world
- `boolean doesWaterVaporize()`
- `boolean doesXZShowFog(int x, int z)` — Returns true if the given X,Z coordinate should show environmental fog.
- `Vec3 drawClouds(float partialTicks)`
- `protected void generateLightBrightnessTable()` — Creates the light to brightness table
- `int getActualHeight()`
- `int getAverageGroundLevel()`
- `BiomeGenBase getBiomeGenForCoords(BlockPos pos)`
- `float getCloudHeight()` — the y level at which clouds are rendered.
- `IRenderHandler getCloudRenderer()`
- `float getCurrentMoonPhaseFactor()` — Calculates the current moon phase factor.
- `java.lang.String getDepartMessage()` — A Message to display to the user when they transfer out of this dismension.
- `int getDimensionId()` — Gets the dimension of the provider
- `abstract java.lang.String getDimensionName()` — Returns the dimension's name, e.g.
- `Vec3 getFogColor(float p_76562_1_, float p_76562_2_)` — Return Vec3D with biome specific fog color
- `boolean getHasNoSky()`
- `int getHeight()`
- `double getHorizon()`
- `abstract java.lang.String getInternalNameSuffix()`
- `float[] getLightBrightnessTable()`
- `int getMoonPhase(long p_76559_1_)`
- `double getMovementFactor()` — The dimensions movement factor.
- `static WorldProvider getProviderForDimension(int dimension)`
- `BlockPos getRandomizedSpawnPoint()`
- `int getRespawnDimension(EntityPlayerMP player)` — Determines the dimension the player will be respawned in, typically this brings them back to the overworld.
- `java.lang.String getSaveFolder()` — Returns the sub-folder of the world folder that this WorldProvider saves to.
- `long getSeed()`
- `Vec3 getSkyColor(Entity cameraEntity, float partialTicks)`
- `IRenderHandler getSkyRenderer()`
- `BlockPos getSpawnCoordinate()`
- `BlockPos getSpawnPoint()`
- `float getStarBrightness(float par1)` — Gets the Star Brightness for rendering sky.
- `float getSunBrightness(float par1)` — Gets the Sun Brightness for rendering sky.
- `float getSunBrightnessFactor(float par1)` — The current sun brightness factor for this dimension. 0.0f means no light at all, and 1.0f means maximum sunlight.
- `double getVoidFogYFactor()` — Returns a double value representing the Y value relative to the top of the map at which void fog is at its maximum.
- `IRenderHandler getWeatherRenderer()`
- `java.lang.String getWelcomeMessage()` — A message to display to the user when they transfer to this dimension.
- `WorldBorder getWorldBorder()`
- `WorldChunkManager getWorldChunkManager()`
- `long getWorldTime()`
- `boolean isBlockHighHumidity(BlockPos pos)`
- `boolean isDaytime()`
- `boolean isSkyColored()`
- `boolean isSurfaceWorld()` — Returns 'true' if in the "main surface world", but 'false' if in the Nether or End dimensions.
- `void registerWorld(World worldIn)` — associate an existing world with a World provider, and setup its lightbrightness table
- `protected void registerWorldChunkManager()` — creates a new world chunk manager for WorldProvider
- `void resetRainAndThunder()`
- `void setAllowedSpawnTypes(boolean allowHostile, boolean allowPeaceful)`
- `void setCloudRenderer(IRenderHandler renderer)`
- `void setDimension(int dim)` — Sets the providers current dimension ID, used in default getSaveFolder() Added to allow default providers to be registered for multiple dimensions.
- `void setSkyRenderer(IRenderHandler skyRenderer)`
- `void setSpawnPoint(BlockPos pos)`
- `void setWeatherRenderer(IRenderHandler renderer)`
- `void setWorldTime(long time)`
- `boolean shouldMapSpin(java.lang.String entity, double x, double y, double z)` — Determine if the cursor on the map should 'spin' when rendered, like it does for the player in the nether.
- `void updateWeather()`

## Fields

- `protected int dimensionId` — The id for the dimension (ex. -1: Nether, 0: Overworld, 1: The End)
- `protected boolean hasNoSky` — A boolean that tells if a world does not have a sky.
- `protected boolean isHellWorld` — States whether the Hell world provider is used(true) or if the normal world provider is used(false)
- `protected float[] lightBrightnessTable` — Light to brightness conversion table
- `static float[] moonPhaseFactors`
- `protected WorldChunkManager worldChunkMgr` — World chunk manager being used to generate chunks
- `protected World worldObj` — world object being used