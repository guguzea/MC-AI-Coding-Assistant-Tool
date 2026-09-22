---
title: "WorldSettings"
description: "public final class WorldSettings extends java.lang.Object"
package: "net/minecraft/world"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/WorldSettings.html"
sourceType: javadoc
---

# WorldSettings

**Inheritance:** java.lang.Object → net.minecraft.world.WorldSettings

## Class signature

```java
public final class WorldSettings extends java.lang.Object
```

## Constructors

- `WorldSettings(long seedIn, WorldSettings.GameType gameType, boolean enableMapFeatures, boolean hardcoreMode, WorldType worldTypeIn)`
- `WorldSettings(WorldInfo info)`

## Methods

- `boolean areCommandsAllowed()`
- `WorldSettings enableBonusChest()`
- `WorldSettings enableCommands()`
- `WorldSettings.GameType getGameType()`
- `static WorldSettings.GameType getGameTypeById(int id)`
- `java.lang.String getGeneratorOptions()`
- `boolean getHardcoreEnabled()`
- `long getSeed()`
- `WorldType getTerrainType()`
- `boolean isBonusChestEnabled()`
- `boolean isMapFeaturesEnabled()`
- `WorldSettings setGeneratorOptions(java.lang.String options)`
