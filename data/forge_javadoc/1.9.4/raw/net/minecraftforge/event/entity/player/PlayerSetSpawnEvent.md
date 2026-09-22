---
title: "PlayerSetSpawnEvent"
description: "public class PlayerSetSpawnEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/PlayerSetSpawnEvent.html"
sourceType: javadoc
---

# PlayerSetSpawnEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerSetSpawnEvent

## Class signature

```java
public class PlayerSetSpawnEvent extends PlayerEvent
```

## Constructors

- `PlayerSetSpawnEvent(EntityPlayer player, BlockPos newSpawn, boolean forced)`

## Methods

- `BlockPos getNewSpawn()`
- `boolean isForced()` — This event is called before a player's spawn point is changed.
