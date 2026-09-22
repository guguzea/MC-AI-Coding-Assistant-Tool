---
title: "PlayerEvent.Clone"
description: "public static class PlayerEvent.Clone extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/player/PlayerEvent.Clone.html"
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

## Methods

- `EntityPlayer getOriginal()` — The old EntityPlayer that this new entity is a clone of.
- `boolean isWasDeath()` — True if this event was fired because the player died.
