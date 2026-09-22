# WorldInfo

**Inheritance:** java.lang.Object → net.minecraft.world.storage.WorldInfo

## Class signature

```java
public class WorldInfo extends java.lang.Object
```

## Constructors

- `WorldInfo()`
- `WorldInfo(NBTTagCompound nbt)`
- `WorldInfo(WorldInfo worldInformation)`
- `WorldInfo(WorldSettings settings, java.lang.String name)`

## Methods

- `void addToCrashReport(CrashReportCategory category)`
- `boolean areCommandsAllowed()`
- `NBTTagCompound cloneNBTCompound(NBTTagCompound nbt)`
- `NBTBase getAdditionalProperty(java.lang.String additionalProperty)`
- `double getBorderCenterX()`
- `void getBorderCenterX(double posX)`
- `double getBorderCenterZ()`
- `void getBorderCenterZ(double posZ)`
- `double getBorderDamagePerBlock()`
- `double getBorderLerpTarget()`
- `long getBorderLerpTime()`
- `double getBorderSafeZone()`
- `double getBorderSize()`
- `int getBorderWarningDistance()`
- `int getBorderWarningTime()`
- `int getCleanWeatherTime()`
- `EnumDifficulty getDifficulty()`
- `@Deprecated NBTTagCompound getDimensionData(DimensionType dimensionIn)`
- `NBTTagCompound getDimensionData(int dimensionIn)`
- `GameRules getGameRulesInstance()`
- `GameType getGameType()`
- `java.lang.String getGeneratorOptions()`
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
- `int getVersionId()`
- `java.lang.String getVersionName()`
- `java.lang.String getWorldName()`
- `long getWorldTime()`
- `long getWorldTotalTime()`
- `boolean isDifficultyLocked()`
- `boolean isHardcoreModeEnabled()`
- `boolean isInitialized()`
- `boolean isMapFeaturesEnabled()`
- `boolean isRaining()`
- `boolean isThundering()`
- `boolean isVersionSnapshot()`
- `void populateFromWorldSettings(WorldSettings settings)`
- `static void registerFixes(DataFixer fixer)`
- `void setAdditionalProperties(java.util.Map<java.lang.String, NBTBase> additionalProperties)` — Allow access to additional mod specific world based properties Used by FML to store mod list associated with a world, and maybe an id map Used by Forge to store the dimensions available to a world
- `void setAllowCommands(boolean allow)`
- `void setBorderDamagePerBlock(double damage)`
- `void setBorderLerpTarget(double lerpSize)`
- `void setBorderLerpTime(long time)`
- `void setBorderSafeZone(double amount)`
- `void setBorderSize(double size)`
- `void setBorderWarningDistance(int amountOfBlocks)`
- `void setBorderWarningTime(int ticks)`
- `void setCleanWeatherTime(int cleanWeatherTimeIn)`
- `void setDifficulty(EnumDifficulty newDifficulty)`
- `void setDifficultyLocked(boolean locked)`
- `@Deprecated void setDimensionData(DimensionType dimensionIn, NBTTagCompound compound)`
- `void setDimensionData(int dimensionID, NBTTagCompound compound)`
- `void setGameType(GameType type)`
- `void setHardcore(boolean hardcoreIn)`
- `void setMapFeaturesEnabled(boolean enabled)`
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

- `static EnumDifficulty DEFAULT_DIFFICULTY`