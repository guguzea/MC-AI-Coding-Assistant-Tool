---
title: "WorldProviderEnd"
description: "Returns array with sunrise/sunset colors"
package: "net/minecraft/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/WorldProviderEnd.html"
sourceType: javadoc
---

# WorldProviderEnd

## Class signature

```java
public class WorldProviderEnd extends WorldProvider
```

## Constructors

- `public WorldProviderEnd()`

## Methods

- `public void registerWorldChunkManager()`
- `public IChunkProvider createChunkGenerator()`
- `public float calculateCelestialAngle(long p_76563_1_, float p_76563_3_)`
- `public float[] calcSunriseSunsetColors(float celestialAngle, float partialTicks)`
- `public Vec3 getFogColor(float p_76562_1_, float p_76562_2_)`
- `public boolean isSkyColored()`
- `public boolean canRespawnHere()`
- `public boolean isSurfaceWorld()`
- `public float getCloudHeight()`
- `public boolean canCoordinateBeSpawn(int x, int z)`
- `public BlockPos getSpawnCoordinate()`
- `public int getAverageGroundLevel()`
- `public boolean doesXZShowFog(int x, int z)`
- `public java.lang.String getDimensionName()`
- `public java.lang.String getInternalNameSuffix()`

## Description

Returns array with sunrise/sunset colors
