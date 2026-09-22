---
title: "UseHoeEvent"
description: "public class UseHoeEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/entity/player/UseHoeEvent.html"
sourceType: javadoc
---

# UseHoeEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.UseHoeEvent

## Class signature

```java
public class UseHoeEvent extends PlayerEvent
```

## Constructors

- `UseHoeEvent(EntityPlayer player, ItemStack current, World world, BlockPos pos)`

## Fields

- `ItemStack current` — This event is fired when a player attempts to use a Hoe on a block, it can be canceled to completely prevent any further processing.
- `BlockPos pos`
- `World world`
