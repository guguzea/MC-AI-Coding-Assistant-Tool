# WorldInfo

**Inheritance:** java.lang.Object → net.minecraft.world.storage.WorldInfo

## Class signature

```java
public class WorldInfo extends java.lang.Object
```

## Constructors

- `WorldInfo()`
- `WorldInfo(NBTTagCompound p_i2157_1_)`
- `WorldInfo(WorldInfo p_i2159_1_)`
- `WorldInfo(WorldSettings p_i2158_1_, java.lang.String p_i2158_2_)`

## Methods

- `void addToCrashReport(CrashReportCategory p_85118_1_)`
- `boolean areCommandsAllowed()`
- `NBTTagCompound cloneNBTCompound(NBTTagCompound p_76082_1_)`
- `NBTBase getAdditionalProperty(java.lang.String additionalProperty)`
- `GameRules getGameRulesInstance()`
- `WorldSettings.GameType getGameType()`
- `java.lang.String getGeneratorOptions()`
- `long getLastTimePlayed()`
- `NBTTagCompound getNBTTagCompound()`
- `NBTTagCompound getPlayerNBTTagCompound()`
- `int getRainTime()`
- `int getSaveVersion()`
- `long getSeed()`
- `long getSizeOnDisk()`
- `int getSpawnX()`
- `int getSpawnY()`
- `int getSpawnZ()`
- `WorldType getTerrainType()`
- `int getThunderTime()`
- `int getVanillaDimension()`
- `java.lang.String getWorldName()`
- `long getWorldTime()`
- `long getWorldTotalTime()`
- `void incrementTotalWorldTime(long p_82572_1_)`
- `boolean isHardcoreModeEnabled()`
- `boolean isInitialized()`
- `boolean isMapFeaturesEnabled()`
- `boolean isRaining()`
- `boolean isThundering()`
- `void setAdditionalProperties(java.util.Map<java.lang.String, NBTBase> additionalProperties)` — Allow access to additional mod specific world based properties Used by FML to store mod list associated with a world, and maybe an id map Used by Forge to store the dimensions available to a world
- `void setGameType(WorldSettings.GameType p_76060_1_)`
- `void setRaining(boolean p_76084_1_)`
- `void setRainTime(int p_76080_1_)`
- `void setSaveVersion(int p_76078_1_)`
- `void setServerInitialized(boolean p_76091_1_)`
- `void setSpawnPosition(int p_76081_1_, int p_76081_2_, int p_76081_3_)`
- `void setSpawnX(int p_76058_1_)`
- `void setSpawnY(int p_76056_1_)`
- `void setSpawnZ(int p_76087_1_)`
- `void setTerrainType(WorldType p_76085_1_)`
- `void setThundering(boolean p_76069_1_)`
- `void setThunderTime(int p_76090_1_)`
- `void setWorldName(java.lang.String p_76062_1_)`
- `void setWorldTime(long p_76068_1_)`