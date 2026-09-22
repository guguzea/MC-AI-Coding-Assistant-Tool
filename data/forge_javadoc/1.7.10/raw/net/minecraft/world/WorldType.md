---
title: "WorldType"
description: "public class WorldType extends java.lang.Object"
package: "net/minecraft/world"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/WorldType.html"
sourceType: javadoc
---

# WorldType

**Inheritance:** java.lang.Object → net.minecraft.world.WorldType

## Class signature

```java
public class WorldType extends java.lang.Object
```

## Methods

- `java.lang.String func_151359_c()`
- `boolean getCanBeCreated()`
- `IChunkProvider getChunkGenerator(World world, java.lang.String generatorOptions)`
- `WorldChunkManager getChunkManager(World world)`
- `int getGeneratorVersion()`
- `double getHorizon(World world)`
- `int getMinimumSpawnHeight(World world)`
- `java.lang.String getTranslateName()`
- `WorldType getWorldTypeForGeneratorVersion(int p_77132_1_)`
- `int getWorldTypeID()`
- `java.lang.String getWorldTypeName()`
- `boolean handleSlimeSpawnReduction(java.util.Random random, World world)`
- `boolean hasVoidParticles(boolean flag)`
- `boolean isVersioned()`
- `void onGUICreateWorldPress()` — Called when 'Create New World' button is pressed before starting game
- `static WorldType parseWorldType(java.lang.String p_77130_0_)`
- `boolean showWorldInfoNotice()`
- `double voidFadeMagnitude()`

## Fields

- `static WorldType AMPLIFIED`
- `static WorldType DEFAULT`
- `static WorldType DEFAULT_1_1`
- `static WorldType FLAT`
- `static WorldType LARGE_BIOMES`
- `static WorldType [] worldTypes`
