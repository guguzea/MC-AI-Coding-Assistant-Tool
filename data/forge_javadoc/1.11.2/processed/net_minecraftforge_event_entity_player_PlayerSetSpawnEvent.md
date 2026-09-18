# PlayerSetSpawnEvent

## Class signature

```java
public class PlayerSetSpawnEvent extends PlayerEvent
```

## Constructors

- `public PlayerSetSpawnEvent( EntityPlayer player, BlockPos newSpawn, boolean forced)`

## Methods

- `public boolean isForced()`
- `public BlockPos getNewSpawn()`

## Description

This event is called before a player's spawn point is changed.