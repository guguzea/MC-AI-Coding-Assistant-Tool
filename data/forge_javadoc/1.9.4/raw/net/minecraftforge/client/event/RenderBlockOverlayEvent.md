---
title: "RenderBlockOverlayEvent"
description: "public class RenderBlockOverlayEvent extends Event"
package: "net/minecraftforge/client/event"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/event/RenderBlockOverlayEvent.html"
sourceType: javadoc
---

# RenderBlockOverlayEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.RenderBlockOverlayEvent

## Class signature

```java
public class RenderBlockOverlayEvent extends Event
```

## Constructors

- `@Deprecated RenderBlockOverlayEvent(EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, Block block, int x, int y, int z)`
- `RenderBlockOverlayEvent(EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, IBlockState block, BlockPos blockPos)`

## Methods

- `IBlockState getBlockForOverlay()` — If the overlay type is BLOCK, then this is the block which the overlay is getting it's icon from
- `BlockPos getBlockPos()`
- `RenderBlockOverlayEvent.OverlayType getOverlayType()` — The type of overlay to occur
- `EntityPlayer getPlayer()` — The player which the overlay will apply to
- `float getRenderPartialTicks()`
