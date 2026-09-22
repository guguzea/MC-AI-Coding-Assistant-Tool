---
title: "PlayerSleepInBedEvent"
description: "public class PlayerSleepInBedEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/PlayerSleepInBedEvent.html"
sourceType: javadoc
---

# PlayerSleepInBedEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerSleepInBedEvent

## Class signature

```java
public class PlayerSleepInBedEvent extends PlayerEvent
```

## Constructors

- `PlayerSleepInBedEvent(EntityPlayer player, BlockPos pos)`

## Methods

- `BlockPos getPos()`
- `EntityPlayer.SleepResult getResultStatus()`
- `void setResult(EntityPlayer.SleepResult result)`
