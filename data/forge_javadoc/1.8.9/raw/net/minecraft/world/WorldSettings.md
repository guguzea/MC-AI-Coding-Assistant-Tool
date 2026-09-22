---
title: "WorldSettings"
description: "public final class WorldSettings extends java.lang.Object"
package: "net/minecraft/world"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/WorldSettings.html"
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

- `boolean areCommandsAllowed()` — Returns true if Commands (cheats) are allowed.
- `WorldSettings enableBonusChest()` — Enables the bonus chest.
- `WorldSettings enableCommands()` — Enables Commands (cheats).
- `WorldSettings.GameType getGameType()` — Gets the game type.
- `static WorldSettings.GameType getGameTypeById(int id)` — Gets the GameType by ID
- `boolean getHardcoreEnabled()` — Returns true if hardcore mode is enabled, otherwise false
- `long getSeed()` — Returns the seed for the world.
- `WorldType getTerrainType()`
- `java.lang.String getWorldName()`
- `boolean isBonusChestEnabled()` — Returns true if the Bonus Chest is enabled.
- `boolean isMapFeaturesEnabled()` — Get whether the map features (e.g. strongholds) generation is enabled or disabled.
- `WorldSettings setWorldName(java.lang.String name)`
