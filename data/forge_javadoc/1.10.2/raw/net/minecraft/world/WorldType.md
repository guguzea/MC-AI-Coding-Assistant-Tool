---
title: "WorldType"
description: "Creates a new world type, the ID is hidden and should not be referenced by modders."
package: "net/minecraft/world"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/WorldType.html"
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
- `public java.lang.String getTranslatedInfo()`
- `public int getGeneratorVersion()`
- `public WorldType getWorldTypeForGeneratorVersion(int version)`
- `public boolean getCanBeCreated()`
- `public boolean isVersioned()`
- `public static WorldType parseWorldType(java.lang.String type)`
- `public int getWorldTypeID()`
- `public boolean showWorldInfoNotice()`
- `public BiomeProvider getBiomeProvider( World world)`
- `public IChunkGenerator getChunkGenerator( World world, java.lang.String generatorOptions)`
- `public int getMinimumSpawnHeight( World world)`
- `public double getHorizon( World world)`
- `public double voidFadeMagnitude()`
- `public boolean handleSlimeSpawnReduction(java.util.Random random, World world)`
- `public void onGUICreateWorldPress()`
- `public int getSpawnFuzz( WorldServer world, MinecraftServer server)`
- `public void onCustomizeButton( Minecraft mc, GuiCreateWorld guiCreateWorld)`
- `public boolean isCustomizable()`
- `public float getCloudHeight()`
- `public GenLayer getBiomeLayer(long worldSeed, GenLayer parentLayer, java.lang.String chunkProviderSettingsJson)`

## Description

Creates a new world type, the ID is hidden and should not be referenced by modders.
