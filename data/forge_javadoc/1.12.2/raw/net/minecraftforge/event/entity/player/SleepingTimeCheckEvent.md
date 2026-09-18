---
title: "SleepingTimeCheckEvent"
description: "This event is fired when the game checks if players can sleep at this time. Failing this check will cause sleeping players to wake up and prevent awake players from sleeping. This event has a result. "
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/SleepingTimeCheckEvent.html"
sourceType: javadoc
---

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
