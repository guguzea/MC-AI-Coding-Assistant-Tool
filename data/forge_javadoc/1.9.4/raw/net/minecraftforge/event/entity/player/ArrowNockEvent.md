---
title: "ArrowNockEvent"
description: "public class ArrowNockEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/ArrowNockEvent.html"
sourceType: javadoc
---

# ArrowNockEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.ArrowNockEvent

## Class signature

```java
public class ArrowNockEvent extends PlayerEvent
```

## Constructors

- `ArrowNockEvent(EntityPlayer player, ItemStack item, EnumHand hand, World world, boolean hasAmmo)`

## Methods

- `ActionResult<ItemStack> getAction()`
- `ItemStack getBow()`
- `EnumHand getHand()`
- `World getWorld()`
- `boolean hasAmmo()`
- `void setAction(ActionResult<ItemStack> action)`
