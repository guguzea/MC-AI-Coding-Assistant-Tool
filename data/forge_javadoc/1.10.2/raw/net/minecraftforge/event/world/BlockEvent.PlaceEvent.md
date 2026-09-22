---
title: "BlockEvent.PlaceEvent"
description: "public static class BlockEvent.PlaceEvent extends BlockEvent"
package: "net/minecraftforge/event/world"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/world/BlockEvent.PlaceEvent.html"
sourceType: javadoc
---

# BlockEvent.PlaceEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.PlaceEvent

## Class signature

```java
public static class BlockEvent.PlaceEvent extends BlockEvent
```

## Constructors

- `@Deprecated PlaceEvent(BlockSnapshot blockSnapshot, IBlockState placedAgainst, EntityPlayer player)`
- `PlaceEvent(BlockSnapshot blockSnapshot, IBlockState placedAgainst, EntityPlayer player, EnumHand hand)`

## Methods

- `BlockSnapshot getBlockSnapshot()`
- `EnumHand getHand()`
- `ItemStack getItemInHand()`
- `IBlockState getPlacedAgainst()`
- `IBlockState getPlacedBlock()`
- `EntityPlayer getPlayer()`
