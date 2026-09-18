# DifficultyChangeEvent

## Class signature

```java
public class DifficultyChangeEvent extends Event
```

## Constructors

- `public DifficultyChangeEvent( EnumDifficulty difficulty, EnumDifficulty oldDifficulty)`

## Methods

- `public EnumDifficulty getDifficulty()`
- `public EnumDifficulty getOldDifficulty()`

## Description

DifficultyChangeEvent is fired when difficulty is changing. This event is fired via the ForgeHooks.onDifficultyChange(EnumDifficulty, EnumDifficulty) . This event is not Cancelable . This event does n