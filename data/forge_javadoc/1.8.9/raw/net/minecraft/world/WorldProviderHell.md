---
title: "WorldProviderHell"
description: "Calculates the angle of sun and moon in the sky relative to a specified time (usually worldTime)"
package: "net/minecraft/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/WorldProviderHell.html"
sourceType: javadoc
---

# WorldProviderHell

## Class signature

```java
public class WorldProviderHell extends WorldProvider
```

## Constructors

- `public WorldProviderHell()`

## Methods

- `public void registerWorldChunkManager()`
- `public Vec3 getFogColor(float p_76562_1_, float p_76562_2_)`
- `protected void generateLightBrightnessTable()`
- `public IChunkProvider createChunkGenerator()`
- `public boolean isSurfaceWorld()`
- `public boolean canCoordinateBeSpawn(int x, int z)`
- `public float calculateCelestialAngle(long p_76563_1_, float p_76563_3_)`
- `public boolean canRespawnHere()`
- `public boolean doesXZShowFog(int x, int z)`
- `public java.lang.String getDimensionName()`
- `public java.lang.String getInternalNameSuffix()`
- `public WorldBorder getWorldBorder()`

## Description

Calculates the angle of sun and moon in the sky relative to a specified time (usually worldTime)
