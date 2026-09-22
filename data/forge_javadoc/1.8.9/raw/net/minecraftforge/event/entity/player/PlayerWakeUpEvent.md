---
title: "PlayerWakeUpEvent"
description: "public class PlayerWakeUpEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/entity/player/PlayerWakeUpEvent.html"
sourceType: javadoc
---

# PlayerWakeUpEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerWakeUpEvent

## Class signature

```java
public class PlayerWakeUpEvent extends PlayerEvent
```

## Constructors

- `PlayerWakeUpEvent(EntityPlayer player, boolean wakeImmediatly, boolean updateWorld, boolean setSpawn)`

## Fields

- `boolean setSpawn` — Indicates if the player's sleep was considered successful.
- `boolean updateWorld` — Indicates if the server should be notified of sleeping changes.
- `boolean wakeImmediatly` — Used for the 'wake up animation'.
