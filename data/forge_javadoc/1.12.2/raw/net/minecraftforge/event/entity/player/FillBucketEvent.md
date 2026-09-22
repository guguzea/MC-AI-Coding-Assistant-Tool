---
title: "FillBucketEvent"
description: "public class FillBucketEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/FillBucketEvent.html"
sourceType: javadoc
---

# FillBucketEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.FillBucketEvent

## Class signature

```java
public class FillBucketEvent extends PlayerEvent
```

## Constructors

- `FillBucketEvent(EntityPlayer player, ItemStack current, World world, RayTraceResult target)`

## Methods

- `ItemStack getEmptyBucket()`
- `ItemStack getFilledBucket()`
- `RayTraceResult getTarget()`
- `World getWorld()`
- `void setFilledBucket(ItemStack bucket)`
