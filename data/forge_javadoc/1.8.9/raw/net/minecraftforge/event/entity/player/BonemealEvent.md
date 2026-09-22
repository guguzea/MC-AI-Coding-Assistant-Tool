---
title: "BonemealEvent"
description: "public class BonemealEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/entity/player/BonemealEvent.html"
sourceType: javadoc
---

# BonemealEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.BonemealEvent

## Class signature

```java
public class BonemealEvent extends PlayerEvent
```

## Constructors

- `BonemealEvent(EntityPlayer player, World world, BlockPos pos, IBlockState block)`

## Fields

- `IBlockState block`
- `BlockPos pos`
- `World world` — This event is called when a player attempts to use Bonemeal on a block.
