# WorldInfo

## Class signature

```java
public class WorldInfo extends java.lang.Object
```

## Constructors

- `protected WorldInfo()`
- `public WorldInfo( NBTTagCompound p_i2157_1_)`
- `public WorldInfo( WorldSettings p_i2158_1_, java.lang.String p_i2158_2_)`
- `public WorldInfo( WorldInfo p_i2159_1_)`

## Methods

- `public NBTTagCompound getNBTTagCompound()`
- `public NBTTagCompound cloneNBTCompound( NBTTagCompound p_76082_1_)`
- `public long getSeed()`
- `public int getSpawnX()`
- `public int getSpawnY()`
- `public int getSpawnZ()`
- `public long getWorldTotalTime()`
- `public long getWorldTime()`
- `public long getSizeOnDisk()`
- `public NBTTagCompound getPlayerNBTTagCompound()`
- `public int getVanillaDimension()`
- `public void setSpawnX(int p_76058_1_)`
- `public void setSpawnY(int p_76056_1_)`
- `public void incrementTotalWorldTime(long p_82572_1_)`
- `public void setSpawnZ(int p_76087_1_)`
- `public void setWorldTime(long p_76068_1_)`
- `public void setSpawnPosition(int p_76081_1_, int p_76081_2_, int p_76081_3_)`
- `public java.lang.String getWorldName()`
- `public void setWorldName(java.lang.String p_76062_1_)`
- `public int getSaveVersion()`
- `public void setSaveVersion(int p_76078_1_)`
- `public long getLastTimePlayed()`
- `public boolean isThundering()`
- `public void setThundering(boolean p_76069_1_)`
- `public int getThunderTime()`
- `public void setThunderTime(int p_76090_1_)`
- `public boolean isRaining()`
- `public void setRaining(boolean p_76084_1_)`
- `public int getRainTime()`
- `public void setRainTime(int p_76080_1_)`
- `public WorldSettings.GameType getGameType()`
- `public boolean isMapFeaturesEnabled()`
- `public void setGameType( WorldSettings.GameType p_76060_1_)`
- `public boolean isHardcoreModeEnabled()`
- `public WorldType getTerrainType()`
- `public void setTerrainType( WorldType p_76085_1_)`
- `public java.lang.String getGeneratorOptions()`
- `public boolean areCommandsAllowed()`
- `public boolean isInitialized()`
- `public void setServerInitialized(boolean p_76091_1_)`
- `public GameRules getGameRulesInstance()`
- `public void addToCrashReport( CrashReportCategory p_85118_1_)`
- `public void setAdditionalProperties(java.util.Map<java.lang.String, NBTBase > additionalProperties)`
- `public NBTBase getAdditionalProperty(java.lang.String additionalProperty)`

## Description

Allow access to additional mod specific world based properties Used by FML to store mod list associated with a world, and maybe an id map Used by Forge to store the dimensions available to a world