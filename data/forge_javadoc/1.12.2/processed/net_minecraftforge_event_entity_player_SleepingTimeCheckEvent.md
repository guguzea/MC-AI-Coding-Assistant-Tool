# SleepingTimeCheckEvent

## Class signature

```java
public class SleepingTimeCheckEvent extends PlayerEvent
```

## Constructors

- `public SleepingTimeCheckEvent( EntityPlayer player, BlockPos sleepingLocation)`

## Methods

- `public BlockPos getSleepingLocation()`

## Description

This event is fired when the game checks if players can sleep at this time. Failing this check will cause sleeping players to wake up and prevent awake players from sleeping. This event has a result.