---
title: "DerivedWorldInfo"
description: "public class DerivedWorldInfo extends WorldInfo"
package: "net/minecraft/world/storage"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/storage/DerivedWorldInfo.html"
sourceType: javadoc
---

# DerivedWorldInfo

**Inheritance:** java.lang.Object → net.minecraft.world.storage.WorldInfo → net.minecraft.world.storage.DerivedWorldInfo

## Class signature

```java
public class DerivedWorldInfo extends WorldInfo
```

## Methods

- `boolean areCommandsAllowed()` — Returns true if commands are allowed on this World.
- `NBTTagCompound cloneNBTCompound(NBTTagCompound nbt)` — Creates a new NBTTagCompound for the world, with the given NBTTag as the "Player"
- `EnumDifficulty getDifficulty()`
- `GameRules getGameRulesInstance()` — Gets the GameRules class Instance.
- `WorldSettings.GameType getGameType()` — Gets the GameType.
- `long getLastTimePlayed()` — Return the last time the player was in this world.
- `NBTTagCompound getNBTTagCompound()` — Gets the NBTTagCompound for the worldInfo
- `NBTTagCompound getPlayerNBTTagCompound()` — Returns the player's NBTTagCompound to be loaded
- `int getRainTime()` — Return the number of ticks until rain.
- `int getSaveVersion()` — Returns the save version of this world
- `long getSeed()` — Returns the seed of current world.
- `long getSizeOnDisk()`
- `int getSpawnX()` — Returns the x spawn position
- `int getSpawnY()` — Return the Y axis spawning point of the player.
- `int getSpawnZ()` — Returns the z spawn position
- `WorldType getTerrainType()`
- `int getThunderTime()` — Returns the number of ticks until next thunderbolt.
- `java.lang.String getWorldName()` — Get current world name
- `long getWorldTime()` — Get current world time
- `long getWorldTotalTime()`
- `boolean isDifficultyLocked()`
- `boolean isHardcoreModeEnabled()` — Returns true if hardcore mode is enabled, otherwise false
- `boolean isInitialized()` — Returns true if the World is initialized.
- `boolean isMapFeaturesEnabled()` — Get whether the map features (e.g. strongholds) generation is enabled or disabled.
- `boolean isRaining()` — Returns true if it is raining, false otherwise.
- `boolean isThundering()` — Returns true if it is thundering, false otherwise.
- `void setAllowCommands(boolean allow)`
- `void setDifficulty(EnumDifficulty newDifficulty)`
- `void setDifficultyLocked(boolean locked)`
- `void setRaining(boolean isRaining)` — Sets whether it is raining or not.
- `void setRainTime(int time)` — Sets the number of ticks until rain.
- `void setSaveVersion(int version)` — Sets the save version of the world
- `void setServerInitialized(boolean initializedIn)` — Sets the initialization status of the World.
- `void setSpawn(BlockPos spawnPoint)`
- `void setSpawnX(int x)` — Set the x spawn position to the passed in value
- `void setSpawnY(int y)` — Sets the y spawn position
- `void setSpawnZ(int z)` — Set the z spawn position to the passed in value
- `void setTerrainType(WorldType type)`
- `void setThundering(boolean thunderingIn)` — Sets whether it is thundering or not.
- `void setThunderTime(int time)` — Defines the number of ticks until next thunderbolt.
- `void setWorldName(java.lang.String worldName)`
- `void setWorldTime(long time)` — Set current world time
- `void setWorldTotalTime(long time)`

## Fields

- `DerivedWorldInfo`
