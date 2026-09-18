---
title: "WorldProvider"
description: "public abstract class WorldProvider extends java.lang.Object"
package: "net/minecraft/world"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/WorldProvider.html"
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

- `public final void registerWorld( World p_76558_1_)`
- `protected void generateLightBrightnessTable()`
- `protected void registerWorldChunkManager()`
- `public IChunkProvider createChunkGenerator()`
- `public boolean canCoordinateBeSpawn(int p_76566_1_, int p_76566_2_)`
- `public float calculateCelestialAngle(long p_76563_1_, float p_76563_3_)`
- `public int getMoonPhase(long p_76559_1_)`
- `public boolean isSurfaceWorld()`
- `public float[] calcSunriseSunsetColors(float p_76560_1_, float p_76560_2_)`
- `public Vec3 getFogColor(float p_76562_1_, float p_76562_2_)`
- `public boolean canRespawnHere()`
- `public static WorldProvider getProviderForDimension(int p_76570_0_)`
- `public float getCloudHeight()`
- `public boolean isSkyColored()`
- `public ChunkCoordinates getEntrancePortalLocation()`
- `public int getAverageGroundLevel()`
- `public boolean getWorldHasVoidParticles()`
- `public double getVoidFogYFactor()`
- `public boolean doesXZShowFog(int p_76568_1_, int p_76568_2_)`
- `public abstract java.lang.String getDimensionName()`
