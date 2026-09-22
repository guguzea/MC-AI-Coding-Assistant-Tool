---
title: "BonemealEvent"
description: "public class BonemealEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/BonemealEvent.html"
sourceType: javadoc
---

# BonemealEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.BonemealEvent

## Class signature

```java
public class BonemealEvent extends PlayerEvent
```

## Constructors

- `BonemealEvent(EntityPlayer player, World world, BlockPos pos, IBlockState block, EnumHand hand, ItemStack stack)`

## Methods

- `IBlockState getBlock()`
- `EnumHand getHand()`
- `BlockPos getPos()`
- `ItemStack getStack()`
- `World getWorld()`
