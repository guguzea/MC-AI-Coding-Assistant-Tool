---
title: "PlayerEvent.HarvestCheck"
description: "public static class PlayerEvent.HarvestCheck extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/PlayerEvent.HarvestCheck.html"
sourceType: javadoc
---

# PlayerEvent.HarvestCheck

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerEvent.HarvestCheck

## Class signature

```java
public static class PlayerEvent.HarvestCheck extends PlayerEvent
```

## Constructors

- `HarvestCheck(EntityPlayer player, IBlockState state, boolean success)`

## Methods

- `boolean canHarvest()`
- `IBlockState getTargetBlock()`
- `void setCanHarvest(boolean success)`
