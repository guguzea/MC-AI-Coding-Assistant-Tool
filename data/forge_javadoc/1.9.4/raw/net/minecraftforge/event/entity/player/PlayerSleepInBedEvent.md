---
title: "PlayerSleepInBedEvent"
description: "PlayerSleepInBedEvent is fired when a player sleeps in a bed. This event is fired whenever a player sleeps in a bed in EntityPlayer#sleepInBedAt(BlockPos). result contains whether the player is able t"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/PlayerSleepInBedEvent.html"
sourceType: javadoc
---

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

PlayerSleepInBedEvent is fired when a player sleeps in a bed. This event is fired whenever a player sleeps in a bed in EntityPlayer#sleepInBedAt(BlockPos). result contains whether the player is able t
