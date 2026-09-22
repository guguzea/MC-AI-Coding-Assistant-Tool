---
title: "RenderBlockOverlayEvent"
description: "public class RenderBlockOverlayEvent extends Event"
package: "net/minecraftforge/client/event"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/event/RenderBlockOverlayEvent.html"
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

## Fields

- `IBlockState blockForOverlay` — If the overlay type is BLOCK, then this is the block which the overlay is getting it's icon from
- `BlockPos blockPos`
- `RenderBlockOverlayEvent.OverlayType overlayType` — The type of overlay to occur
- `EntityPlayer player` — The player which the overlay will apply to
- `float renderPartialTicks`
