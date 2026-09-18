# SleepingLocationCheckEvent

## Class signature

```java
public class SleepingLocationCheckEvent extends PlayerEvent
```

## Constructors

- `public SleepingLocationCheckEvent( EntityPlayer player, BlockPos sleepingLocation)`

## Methods

- `public BlockPos getSleepingLocation()`

## Description

This event is fired when game checks, if sleeping player should be still considered "in bed". Failing this check will cause player to wake up. This event has a result. Event.HasResult setResult(ALLOW)