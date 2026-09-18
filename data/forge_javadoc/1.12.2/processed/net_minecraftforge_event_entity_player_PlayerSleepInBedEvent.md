# PlayerSleepInBedEvent

## Class signature

```java
public class PlayerSleepInBedEvent extends PlayerEvent
```

## Constructors

- `public PlayerSleepInBedEvent( EntityPlayer player, BlockPos pos)`

## Methods

- `public EntityPlayer.SleepResult getResultStatus()`
- `public void setResult( EntityPlayer.SleepResult result)`
- `public BlockPos getPos()`

## Description

PlayerSleepInBedEvent is fired when a player sleeps in a bed. This event is fired whenever a player sleeps in a bed in EntityPlayer.trySleep(BlockPos) . result contains whether the player is able to s