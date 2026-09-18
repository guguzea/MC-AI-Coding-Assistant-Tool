---
title: "WorldSettings"
description: "Returns true if Commands (cheats) are allowed."
package: "net/minecraft/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/WorldSettings.html"
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
- `public WorldSettings setWorldName(java.lang.String name)`
- `public WorldSettings enableCommands()`
- `public boolean isBonusChestEnabled()`
- `public long getSeed()`
- `public WorldSettings.GameType getGameType()`
- `public boolean getHardcoreEnabled()`
- `public boolean isMapFeaturesEnabled()`
- `public WorldType getTerrainType()`
- `public boolean areCommandsAllowed()`
- `public static WorldSettings.GameType getGameTypeById(int id)`
- `public java.lang.String getWorldName()`

## Description

Returns true if Commands (cheats) are allowed.
