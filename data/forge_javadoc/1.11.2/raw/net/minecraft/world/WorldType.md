---
title: "WorldType"
description: "public class WorldType extends java.lang.Object"
package: "net/minecraft/world"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/WorldType.html"
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

- `boolean canBeCreated()`
- `GenLayer getBiomeLayer(long worldSeed, GenLayer parentLayer, ChunkProviderSettings chunkProviderSettings)` — Creates the GenLayerBiome used for generating the world with the specified ChunkProviderSettings JSON String *IF AND ONLY IF* this WorldType == WorldType.CUSTOMIZED.
- `BiomeProvider getBiomeProvider(World world)`
- `IChunkGenerator getChunkGenerator(World world, java.lang.String generatorOptions)`
- `float getCloudHeight()` — Get the height to render the clouds for this world type
- `int getGeneratorVersion()`
- `double getHorizon(World world)`
- `int getMinimumSpawnHeight(World world)`
- `java.lang.String getName()`
- `int getSpawnFuzz(WorldServer world, MinecraftServer server)` — Gets the spawn fuzz for players who join the world.
- `java.lang.String getTranslatedInfo()`
- `java.lang.String getTranslateName()`
- `WorldType getWorldTypeForGeneratorVersion(int version)`
- `int getWorldTypeID()`
- `boolean handleSlimeSpawnReduction(java.util.Random random, World world)`
- `boolean isCustomizable()` — Should world creation GUI show 'Customize' button for this world type?
- `boolean isVersioned()`
- `void onCustomizeButton(Minecraft mc, GuiCreateWorld guiCreateWorld)` — Called when the 'Customize' button is pressed on world creation GUI
- `void onGUICreateWorldPress()` — Called when 'Create New World' button is pressed before starting game
- `static WorldType parseWorldType(java.lang.String type)`
- `boolean showWorldInfoNotice()`
- `double voidFadeMagnitude()`

## Fields

- `static WorldType AMPLIFIED`
- `static WorldType CUSTOMIZED`
- `static WorldType DEBUG_WORLD`
- `static WorldType DEFAULT`
- `static WorldType DEFAULT_1_1`
- `static WorldType FLAT`
- `static WorldType LARGE_BIOMES`
- `static WorldType [] WORLD_TYPES`
