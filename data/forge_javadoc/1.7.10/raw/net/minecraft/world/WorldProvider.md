---
title: "WorldProvider"
description: "public abstract class WorldProvider extends java.lang.Object"
package: "net/minecraft/world"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/WorldProvider.html"
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

- `float[] calcSunriseSunsetColors(float p_76560_1_, float p_76560_2_)`
- `float calculateCelestialAngle(long p_76563_1_, float p_76563_3_)`
- `boolean canCoordinateBeSpawn(int p_76566_1_, int p_76566_2_)`
- `boolean canRespawnHere()`
- `IChunkProvider createChunkGenerator()`
- `boolean doesXZShowFog(int p_76568_1_, int p_76568_2_)`
- `protected void generateLightBrightnessTable()`
- `int getAverageGroundLevel()`
- `float getCloudHeight()`
- `abstract java.lang.String getDimensionName()`
- `ChunkCoordinates getEntrancePortalLocation()`
- `Vec3 getFogColor(float p_76562_1_, float p_76562_2_)`
- `int getMoonPhase(long p_76559_1_)`
- `static WorldProvider getProviderForDimension(int p_76570_0_)`
- `double getVoidFogYFactor()`
- `boolean getWorldHasVoidParticles()`
- `boolean isSkyColored()`
- `boolean isSurfaceWorld()`
- `void registerWorld(World p_76558_1_)`
- `protected void registerWorldChunkManager()`

## Fields

- `int dimensionId`
- `java.lang.String field_82913_c`
- `boolean hasNoSky`
- `boolean isHellWorld`
- `float[] lightBrightnessTable`
- `static float[] moonPhaseFactors`
- `WorldType terrainType`
- `WorldChunkManager worldChunkMgr`
- `World worldObj`
