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

- `void addToCrashReport(CrashReportCategory category)` — Adds this WorldInfo instance to the crash report.
- `boolean areCommandsAllowed()` — Returns true if commands are allowed on this World.
- `NBTTagCompound cloneNBTCompound(NBTTagCompound nbt)` — Creates a new NBTTagCompound for the world, with the given NBTTag as the "Player"
- `NBTBase getAdditionalProperty(java.lang.String additionalProperty)`
- `double getBorderCenterX()` — Returns the border center X position
- `void getBorderCenterX(double posX)` — Sets the border center X position
- `double getBorderCenterZ()` — Returns the border center Z position
- `void getBorderCenterZ(double posZ)` — Sets the border center Z position
- `double getBorderDamagePerBlock()` — Returns the border damage per block
- `double getBorderLerpTarget()` — Returns the border lerp target
- `long getBorderLerpTime()` — Returns the border lerp time
- `double getBorderSafeZone()` — Returns the border safe zone
- `double getBorderSize()`
- `int getBorderWarningDistance()` — Returns the border warning distance
- `int getBorderWarningTime()` — Returns the border warning time
- `int getCleanWeatherTime()`
- `EnumDifficulty getDifficulty()`
- `GameRules getGameRulesInstance()` — Gets the GameRules class Instance.
- `WorldSettings.GameType getGameType()` — Gets the GameType.
- `java.lang.String getGeneratorOptions()`
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
- `void populateFromWorldSettings(WorldSettings settings)`
- `void setAdditionalProperties(java.util.Map<java.lang.String, NBTBase> additionalProperties)` — Allow access to additional mod specific world based properties Used by FML to store mod list associated with a world, and maybe an id map Used by Forge to store the dimensions available to a world
- `void setAllowCommands(boolean allow)`
- `void setBorderDamagePerBlock(double damage)` — Sets the border damage per block
- `void setBorderLerpTarget(double lerpSize)` — Sets the border lerp target
- `void setBorderLerpTime(long time)` — Sets the border lerp time
- `void setBorderSafeZone(double amount)` — Sets the border safe zone
- `void setBorderSize(double size)` — Sets the border size
- `void setBorderWarningDistance(int amountOfBlocks)` — Sets the border warning distance
- `void setBorderWarningTime(int ticks)` — Sets the border warning time
- `void setCleanWeatherTime(int cleanWeatherTimeIn)`
- `void setDifficulty(EnumDifficulty newDifficulty)`
- `void setDifficultyLocked(boolean locked)`
- `void setGameType(WorldSettings.GameType type)` — Sets the GameType.
- `void setHardcore(boolean hardcoreIn)`
- `void setMapFeaturesEnabled(boolean enabled)`
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

- `static EnumDifficulty DEFAULT_DIFFICULTY`