---
title: "WorldProviderEnd"
description: "public class WorldProviderEnd extends WorldProvider"
package: "net/minecraft/world"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/WorldProviderEnd.html"
sourceType: javadoc
---

# WorldProviderEnd

**Inheritance:** java.lang.Object → net.minecraft.world.WorldProvider → net.minecraft.world.WorldProviderEnd

## Class signature

```java
public class WorldProviderEnd extends WorldProvider
```

## Methods

- `float[] calcSunriseSunsetColors(float celestialAngle, float partialTicks)` — Returns array with sunrise/sunset colors
- `float calculateCelestialAngle(long p_76563_1_, float p_76563_3_)` — Calculates the angle of sun and moon in the sky relative to a specified time (usually worldTime)
- `boolean canCoordinateBeSpawn(int x, int z)` — Will check if the x, z position specified is alright to be set as the map spawn point
- `boolean canRespawnHere()` — True if the player can respawn in this dimension (true = overworld, false = nether).
- `IChunkProvider createChunkGenerator()` — Returns a new chunk provider which generates chunks for this world
- `boolean doesXZShowFog(int x, int z)` — Returns true if the given X,Z coordinate should show environmental fog.
- `int getAverageGroundLevel()`
- `float getCloudHeight()` — the y level at which clouds are rendered.
- `java.lang.String getDimensionName()` — Returns the dimension's name, e.g.
- `Vec3 getFogColor(float p_76562_1_, float p_76562_2_)` — Return Vec3D with biome specific fog color
- `java.lang.String getInternalNameSuffix()`
- `BlockPos getSpawnCoordinate()`
- `boolean isSkyColored()`
- `boolean isSurfaceWorld()` — Returns 'true' if in the "main surface world", but 'false' if in the Nether or End dimensions.
- `void registerWorldChunkManager()` — creates a new world chunk manager for WorldProvider

## Fields

- `WorldProviderEnd`
