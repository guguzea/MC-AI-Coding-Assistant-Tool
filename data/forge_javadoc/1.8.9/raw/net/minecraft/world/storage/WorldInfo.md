---
title: "WorldInfo"
description: "Adds this WorldInfo instance to the crash report."
package: "net/minecraft/world/storage"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/storage/WorldInfo.html"
sourceType: javadoc
---

# WorldInfo

## Class signature

```java
public class WorldInfo extends java.lang.Object
```

## Constructors

- `protected WorldInfo()`
- `public WorldInfo( NBTTagCompound nbt)`
- `public WorldInfo( WorldSettings settings, java.lang.String name)`
- `public WorldInfo( WorldInfo worldInformation)`

## Methods

- `public void populateFromWorldSettings( WorldSettings settings)`
- `public NBTTagCompound getNBTTagCompound()`
- `public NBTTagCompound cloneNBTCompound( NBTTagCompound nbt)`
- `public long getSeed()`
- `public int getSpawnX()`
- `public int getSpawnY()`
- `public int getSpawnZ()`
- `public long getWorldTotalTime()`
- `public long getWorldTime()`
- `public long getSizeOnDisk()`
- `public NBTTagCompound getPlayerNBTTagCompound()`
- `public void setSpawnX(int x)`
- `public void setSpawnY(int y)`
- `public void setWorldTotalTime(long time)`
- `public void setSpawnZ(int z)`
- `public void setWorldTime(long time)`
- `public void setSpawn( BlockPos spawnPoint)`
- `public java.lang.String getWorldName()`
- `public void setWorldName(java.lang.String worldName)`
- `public int getSaveVersion()`
- `public void setSaveVersion(int version)`
- `public long getLastTimePlayed()`
- `public int getCleanWeatherTime()`
- `public void setCleanWeatherTime(int cleanWeatherTimeIn)`
- `public boolean isThundering()`
- `public void setThundering(boolean thunderingIn)`
- `public int getThunderTime()`
- `public void setThunderTime(int time)`
- `public boolean isRaining()`
- `public void setRaining(boolean isRaining)`
- `public int getRainTime()`
- `public void setRainTime(int time)`
- `public WorldSettings.GameType getGameType()`
- `public boolean isMapFeaturesEnabled()`
- `public void setMapFeaturesEnabled(boolean enabled)`
- `public void setGameType( WorldSettings.GameType type)`
- `public boolean isHardcoreModeEnabled()`
- `public void setHardcore(boolean hardcoreIn)`
- `public WorldType getTerrainType()`
- `public void setTerrainType( WorldType type)`
- `public java.lang.String getGeneratorOptions()`
- `public boolean areCommandsAllowed()`
- `public void setAllowCommands(boolean allow)`
- `public boolean isInitialized()`
- `public void setServerInitialized(boolean initializedIn)`
- `public GameRules getGameRulesInstance()`
- `public double getBorderCenterX()`
- `public double getBorderCenterZ()`
- `public double getBorderSize()`
- `public void setBorderSize(double size)`
- `public long getBorderLerpTime()`
- `public void setBorderLerpTime(long time)`
- `public double getBorderLerpTarget()`
- `public void setBorderLerpTarget(double lerpSize)`
- `public void getBorderCenterZ(double posZ)`
- `public void getBorderCenterX(double posX)`
- `public double getBorderSafeZone()`
- `public void setBorderSafeZone(double amount)`
- `public double getBorderDamagePerBlock()`
- `public void setBorderDamagePerBlock(double damage)`
- `public int getBorderWarningDistance()`
- `public int getBorderWarningTime()`
- `public void setBorderWarningDistance(int amountOfBlocks)`
- `public void setBorderWarningTime(int ticks)`
- `public EnumDifficulty getDifficulty()`
- `public void setDifficulty( EnumDifficulty newDifficulty)`
- `public boolean isDifficultyLocked()`
- `public void setDifficultyLocked(boolean locked)`
- `public void addToCrashReport( CrashReportCategory category)`
- `public void setAdditionalProperties(java.util.Map<java.lang.String, NBTBase > additionalProperties)`
- `public NBTBase getAdditionalProperty(java.lang.String additionalProperty)`

## Description

Adds this WorldInfo instance to the crash report.
