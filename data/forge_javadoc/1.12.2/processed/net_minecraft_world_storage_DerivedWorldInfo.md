# DerivedWorldInfo

**Inheritance:** java.lang.Object → net.minecraft.world.storage.WorldInfo → net.minecraft.world.storage.DerivedWorldInfo

## Class signature

```java
public class DerivedWorldInfo extends WorldInfo
```

## Methods

- `boolean areCommandsAllowed()`
- `NBTTagCompound cloneNBTCompound(NBTTagCompound nbt)`
- `EnumDifficulty getDifficulty()`
- `@Deprecated NBTTagCompound getDimensionData(DimensionType dimensionIn)`
- `NBTTagCompound getDimensionData(int dimensionID)`
- `GameRules getGameRulesInstance()`
- `GameType getGameType()`
- `long getLastTimePlayed()`
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
- `java.lang.String getWorldName()`
- `long getWorldTime()`
- `long getWorldTotalTime()`
- `boolean isDifficultyLocked()`
- `boolean isHardcoreModeEnabled()`
- `boolean isInitialized()`
- `boolean isMapFeaturesEnabled()`
- `boolean isRaining()`
- `boolean isThundering()`
- `void setAllowCommands(boolean allow)`
- `void setDifficulty(EnumDifficulty newDifficulty)`
- `void setDifficultyLocked(boolean locked)`
- `@Deprecated void setDimensionData(DimensionType dimensionIn, NBTTagCompound compound)`
- `void setDimensionData(int dimensionID, NBTTagCompound compound)`
- `void setRaining(boolean isRaining)`
- `void setRainTime(int time)`
- `void setSaveVersion(int version)`
- `void setServerInitialized(boolean initializedIn)`
- `void setSpawn(BlockPos spawnPoint)`
- `void setSpawnX(int x)`
- `void setSpawnY(int y)`
- `void setSpawnZ(int z)`
- `void setTerrainType(WorldType type)`
- `void setThundering(boolean thunderingIn)`
- `void setThunderTime(int time)`
- `void setWorldName(java.lang.String worldName)`
- `void setWorldTime(long time)`
- `void setWorldTotalTime(long time)`

## Fields

- `DerivedWorldInfo`