---
title: "BlockEvent.PlaceEvent"
description: "public static class BlockEvent.PlaceEvent extends BlockEvent"
package: "net/minecraftforge/event/world"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/world/BlockEvent.PlaceEvent.html"
sourceType: javadoc
---

# BlockEvent.PlaceEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.PlaceEvent

## Class signature

```java
public static class BlockEvent.PlaceEvent extends BlockEvent
```

## Constructors

- `PlaceEvent(BlockSnapshot blockSnapshot, IBlockState placedAgainst, EntityPlayer player)`

## Methods

- `BlockSnapshot getBlockSnapshot()`
- `ItemStack getItemInHand()`
- `IBlockState getPlacedAgainst()`
- `IBlockState getPlacedBlock()`
- `EntityPlayer getPlayer()`
