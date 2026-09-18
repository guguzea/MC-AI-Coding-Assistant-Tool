---
title: "SleepingLocationCheckEvent"
description: "This event is fired when game checks, if sleeping player should be still considered \"in bed\". Failing this check will cause player to wake up. This event has a result. Event.HasResult setResult(ALLO"
package: "net/minecraftforge/event/entity/player"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/entity/player/SleepingLocationCheckEvent.html"
sourceType: javadoc
---

# SleepingLocationCheckEvent

## Class signature

```java
public class SleepingLocationCheckEvent extends PlayerEvent
```

## Constructors

- `public SleepingLocationCheckEvent( EntityPlayer player, BlockPos sleepingLocation)`

## Description

This event is fired when game checks, if sleeping player should be still considered "in bed". Failing this check will cause player to wake up. This event has a result. Event.HasResult setResult(ALLOW)
