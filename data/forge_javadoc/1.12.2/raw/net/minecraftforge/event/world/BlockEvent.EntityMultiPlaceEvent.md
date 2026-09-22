---
title: "BlockEvent.EntityMultiPlaceEvent"
description: "public static class BlockEvent.EntityMultiPlaceEvent extends BlockEvent.EntityPlaceEvent"
package: "net/minecraftforge/event/world"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/BlockEvent.EntityMultiPlaceEvent.html"
sourceType: javadoc
---

# BlockEvent.EntityMultiPlaceEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.EntityPlaceEvent → net.minecraftforge.event.world.BlockEvent.EntityMultiPlaceEvent

## Class signature

```java
public static class BlockEvent.EntityMultiPlaceEvent extends BlockEvent.EntityPlaceEvent
```

## Constructors

- `EntityMultiPlaceEvent(java.util.List<BlockSnapshot> blockSnapshots, IBlockState placedAgainst, Entity entity)`

## Methods

- `java.util.List<BlockSnapshot> getReplacedBlockSnapshots()` — Gets a list of BlockSnapshots for all blocks which were replaced by the placement of the new blocks.
