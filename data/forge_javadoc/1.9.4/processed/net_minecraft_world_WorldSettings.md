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
- `public WorldSettings setGeneratorOptions(java.lang.String options)`
- `public WorldSettings enableCommands()`
- `public boolean isBonusChestEnabled()`
- `public long getSeed()`
- `public WorldSettings.GameType getGameType()`
- `public boolean getHardcoreEnabled()`
- `public boolean isMapFeaturesEnabled()`
- `public WorldType getTerrainType()`
- `public boolean areCommandsAllowed()`
- `public static WorldSettings.GameType getGameTypeById(int id)`
- `public java.lang.String getGeneratorOptions()`