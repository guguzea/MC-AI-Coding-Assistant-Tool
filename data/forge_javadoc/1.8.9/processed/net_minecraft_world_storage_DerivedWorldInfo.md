# DerivedWorldInfo

## Class signature

```java
public class DerivedWorldInfo extends WorldInfo
```

## Constructors

- `public DerivedWorldInfo( WorldInfo p_i2145_1_)`

## Methods

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
- `public java.lang.String getWorldName()`
- `public int getSaveVersion()`
- `public long getLastTimePlayed()`
- `public boolean isThundering()`
- `public int getThunderTime()`
- `public boolean isRaining()`
- `public int getRainTime()`
- `public WorldSettings.GameType getGameType()`
- `public void setSpawnX(int x)`
- `public void setSpawnY(int y)`
- `public void setWorldTotalTime(long time)`
- `public void setSpawnZ(int z)`
- `public void setWorldTime(long time)`
- `public void setSpawn( BlockPos spawnPoint)`
- `public void setWorldName(java.lang.String worldName)`
- `public void setSaveVersion(int version)`
- `public void setThundering(boolean thunderingIn)`
- `public void setThunderTime(int time)`
- `public void setRaining(boolean isRaining)`
- `public void setRainTime(int time)`
- `public boolean isMapFeaturesEnabled()`
- `public boolean isHardcoreModeEnabled()`
- `public WorldType getTerrainType()`
- `public void setTerrainType( WorldType type)`
- `public boolean areCommandsAllowed()`
- `public void setAllowCommands(boolean allow)`
- `public boolean isInitialized()`
- `public void setServerInitialized(boolean initializedIn)`
- `public GameRules getGameRulesInstance()`
- `public EnumDifficulty getDifficulty()`
- `public void setDifficulty( EnumDifficulty newDifficulty)`
- `public boolean isDifficultyLocked()`
- `public void setDifficultyLocked(boolean locked)`

## Description

Returns true if commands are allowed on this World.