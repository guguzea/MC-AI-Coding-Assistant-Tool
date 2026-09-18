---
title: "WorldProviderEnd"
description: "public class WorldProviderEnd extends WorldProvider"
package: "net/minecraft/world"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/WorldProviderEnd.html"
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

- `public void init()`
- `public IChunkGenerator createChunkGenerator()`
- `public float calculateCelestialAngle(long worldTime, float partialTicks)`
- `@Nullable public float[] calcSunriseSunsetColors(float celestialAngle, float partialTicks)`
- `public Vec3d getFogColor(float p_76562_1_, float p_76562_2_)`
- `public boolean isSkyColored()`
- `public boolean canRespawnHere()`
- `public boolean isSurfaceWorld()`
- `public float getCloudHeight()`
- `public boolean canCoordinateBeSpawn(int x, int z)`
- `public BlockPos getSpawnCoordinate()`
- `public int getAverageGroundLevel()`
- `public boolean doesXZShowFog(int x, int z)`
- `public DimensionType getDimensionType()`
- `public void onWorldSave()`
- `public void onWorldUpdateEntities()`
- `@Nullable public DragonFightManager getDragonFightManager()`
