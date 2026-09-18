---
title: "WorldSettings"
description: "public final class WorldSettings extends java.lang.Object"
package: "net/minecraft/world"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/WorldSettings.html"
sourceType: javadoc
---

# WorldSettings

## Class signature

```java
public final class WorldSettings extends java.lang.Object
```

## Constructors

- `public WorldSettings(long seedIn, WorldSettings.GameType gameType, boolean enableMapFeatures, boolean hardcoreMode, WorldType worldTypeIn)`
- `public WorldSettings( WorldInfo info)`

## Methods

- `public WorldSettings enableBonusChest()`
- `public WorldSettings setGeneratorOptions(java.lang.String options)`
- `public WorldSettings enableCommands()`
- `public boolean isBonusChestEnabled()`
- `public long getSeed()`
- `public WorldSettings.GameType getGameType()`
- `public boolean getHardcoreEnabled()`
- `public boolean isMapFeaturesEnabled()`
- `public WorldType getTerrainType()`
- `public boolean areCommandsAllowed()`
- `public static WorldSettings.GameType getGameTypeById(int id)`
- `public java.lang.String getGeneratorOptions()`
