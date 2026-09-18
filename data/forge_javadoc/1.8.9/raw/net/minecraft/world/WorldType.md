---
title: "WorldType"
description: "amplified world type"
package: "net/minecraft/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/WorldType.html"
sourceType: javadoc
---

# WorldType

## Class signature

```java
public class WorldType extends java.lang.Object
```

## Constructors

- `public WorldType(java.lang.String name)`

## Methods

- `public java.lang.String getWorldTypeName()`
- `public java.lang.String getTranslateName()`
- `public java.lang.String func_151359_c()`
- `public int getGeneratorVersion()`
- `public WorldType getWorldTypeForGeneratorVersion(int version)`
- `public boolean getCanBeCreated()`
- `public boolean isVersioned()`
- `public static WorldType parseWorldType(java.lang.String type)`
- `public int getWorldTypeID()`
- `public boolean showWorldInfoNotice()`
- `public WorldChunkManager getChunkManager( World world)`
- `public IChunkProvider getChunkGenerator( World world, java.lang.String generatorOptions)`
- `public int getMinimumSpawnHeight( World world)`
- `public double getHorizon( World world)`
- `public double voidFadeMagnitude()`
- `public boolean handleSlimeSpawnReduction(java.util.Random random, World world)`
- `public void onGUICreateWorldPress()`
- `public int getSpawnFuzz()`
- `public void onCustomizeButton( Minecraft mc, GuiCreateWorld guiCreateWorld)`
- `public boolean isCustomizable()`
- `public float getCloudHeight()`
- `public GenLayer getBiomeLayer(long worldSeed, GenLayer parentLayer, java.lang.String chunkProviderSettingsJson)`

## Description

amplified world type
