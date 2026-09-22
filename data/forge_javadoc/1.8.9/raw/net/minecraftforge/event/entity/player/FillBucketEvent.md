---
title: "FillBucketEvent"
description: "public class FillBucketEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/entity/player/FillBucketEvent.html"
sourceType: javadoc
---

# FillBucketEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.FillBucketEvent

## Class signature

```java
public class FillBucketEvent extends PlayerEvent
```

## Constructors

- `FillBucketEvent(EntityPlayer player, ItemStack current, World world, MovingObjectPosition target)`

## Fields

- `ItemStack current` — This event is fired when a player attempts to use a Empty bucket, it can be canceled to completely prevent any further processing.
- `ItemStack result`
- `MovingObjectPosition target`
- `World world`
