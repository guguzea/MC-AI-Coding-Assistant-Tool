---
title: "PlayerEvent.Clone"
description: "public static class PlayerEvent.Clone extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/entity/player/PlayerEvent.Clone.html"
sourceType: javadoc
---

# PlayerEvent.Clone

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerEvent.Clone

## Class signature

```java
public static class PlayerEvent.Clone extends PlayerEvent
```

## Constructors

- `Clone(EntityPlayer _new, EntityPlayer oldPlayer, boolean wasDeath)`

## Fields

- `EntityPlayer original` — The old EntityPlayer that this new entity is a clone of.
- `boolean wasDeath` — True if this event was fired because the player died.
