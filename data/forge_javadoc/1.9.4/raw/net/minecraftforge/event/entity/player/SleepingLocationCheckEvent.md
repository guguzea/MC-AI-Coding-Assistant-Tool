---
title: "SleepingLocationCheckEvent"
description: "This event is fired when game checks, if sleeping player should be still considered \"in bed\". Failing this check will cause player to wake up. This event has a result. Event.HasResult setResult(ALLO"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/SleepingLocationCheckEvent.html"
sourceType: javadoc
---

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
