---
title: "BlockEvent.NeighborNotifyEvent"
description: "public static class BlockEvent.NeighborNotifyEvent extends BlockEvent"
package: "net/minecraftforge/event/world"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/world/BlockEvent.NeighborNotifyEvent.html"
sourceType: javadoc
---

# BlockEvent.NeighborNotifyEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.NeighborNotifyEvent

## Class signature

```java
public static class BlockEvent.NeighborNotifyEvent extends BlockEvent
```

## Constructors

- `NeighborNotifyEvent(World world, BlockPos pos, IBlockState state, java.util.EnumSet<EnumFacing> notifiedSides)`

## Methods

- `java.util.EnumSet<EnumFacing> getNotifiedSides()` — Gets a list of directions from the base block that updates will occur upon.
