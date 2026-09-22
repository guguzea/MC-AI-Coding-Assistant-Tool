---
title: "WorldType"
description: "public class WorldType extends java.lang.Object"
package: "net/minecraft/world"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/WorldType.html"
sourceType: javadoc
---

# WorldType

**Inheritance:** java.lang.Object → net.minecraft.world.WorldType

## Class signature

```java
public class WorldType extends java.lang.Object
```

## Constructors

- `WorldType(java.lang.String name)`

## Methods

- `java.lang.String func_151359_c()`
- `GenLayer getBiomeLayer(long worldSeed, GenLayer parentLayer, java.lang.String chunkProviderSettingsJson)` — Creates the GenLayerBiome used for generating the world with the specified ChunkProviderSettings JSON String *IF AND ONLY IF* this WorldType == WorldType.CUSTOMIZED.
- `boolean getCanBeCreated()` — Gets whether this WorldType can be used to generate a new world.
- `IChunkProvider getChunkGenerator(World world, java.lang.String generatorOptions)`
- `WorldChunkManager getChunkManager(World world)`
- `float getCloudHeight()` — Get the height to render the clouds for this world type
- `int getGeneratorVersion()` — Returns generatorVersion.
- `double getHorizon(World world)`
- `int getMinimumSpawnHeight(World world)`
- `int getSpawnFuzz()` — Gets the spawn fuzz for players who join the world.
- `java.lang.String getTranslateName()` — Gets the translation key for the name of this world type.
- `WorldType getWorldTypeForGeneratorVersion(int version)`
- `int getWorldTypeID()`
- `java.lang.String getWorldTypeName()`
- `boolean handleSlimeSpawnReduction(java.util.Random random, World world)`
- `boolean isCustomizable()` — Should world creation GUI show 'Customize' button for this world type?
- `boolean isVersioned()` — Returns true if this world Type has a version associated with it.
- `void onCustomizeButton(Minecraft mc, GuiCreateWorld guiCreateWorld)` — Called when the 'Customize' button is pressed on world creation GUI
- `void onGUICreateWorldPress()` — Called when 'Create New World' button is pressed before starting game
- `static WorldType parseWorldType(java.lang.String type)`
- `boolean showWorldInfoNotice()` — returns true if selecting this worldtype from the customize menu should display the generator.
- `double voidFadeMagnitude()`

## Fields

- `static WorldType AMPLIFIED` — amplified world type
- `static WorldType CUSTOMIZED`
- `static WorldType DEBUG_WORLD`
- `static WorldType DEFAULT` — Default world type.
- `static WorldType DEFAULT_1_1` — Default (1.1) world type.
- `static WorldType FLAT` — Flat world type.
- `static WorldType LARGE_BIOMES` — Large Biome world Type.
- `static WorldType [] worldTypes` — List of world types.
