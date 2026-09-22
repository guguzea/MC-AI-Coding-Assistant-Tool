---
title: "BlockEvent.BreakEvent"
description: "public static class BlockEvent.BreakEvent extends BlockEvent"
package: "net/minecraftforge/event/world"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/BlockEvent.BreakEvent.html"
sourceType: javadoc
---

# BlockEvent.BreakEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.BreakEvent

## Class signature

```java
public static class BlockEvent.BreakEvent extends BlockEvent
```

## Constructors

- `BreakEvent(World world, BlockPos pos, IBlockState state, EntityPlayer player)`

## Methods

- `int getExpToDrop()` — Get the experience dropped by the block after the event has processed
- `EntityPlayer getPlayer()`
- `void setExpToDrop(int exp)` — Set the amount of experience dropped by the block after the event has processed
