---
title: "ArrowLooseEvent"
description: "public class ArrowLooseEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/ArrowLooseEvent.html"
sourceType: javadoc
---

# ArrowLooseEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.ArrowLooseEvent

## Class signature

```java
public class ArrowLooseEvent extends PlayerEvent
```

## Constructors

- `ArrowLooseEvent(EntityPlayer player, ItemStack bow, World world, int charge, boolean hasAmmo)`

## Methods

- `ItemStack getBow()`
- `int getCharge()`
- `World getWorld()`
- `boolean hasAmmo()`
- `void setCharge(int charge)`
