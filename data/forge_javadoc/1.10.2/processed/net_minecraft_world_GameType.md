# GameType

**Inheritance:** java.lang.Object → java.lang.Enum<GameType> → net.minecraft.world.GameType

## Class signature

```java
public enum GameType extends java.lang.Enum<GameType>
```

## Methods

- `void configurePlayerCapabilities(PlayerCapabilities capabilities)`
- `static GameType getByID(int idIn)`
- `static GameType getByName(java.lang.String gamemodeName)`
- `int getID()`
- `java.lang.String getName()`
- `boolean isAdventure()`
- `boolean isCreative()`
- `boolean isSurvivalOrAdventure()`
- `static GameType parseGameTypeWithDefault(int targetId, GameType fallback)`
- `static GameType parseGameTypeWithDefault(java.lang.String targetName, GameType fallback)`
- `static GameType valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static GameType [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.