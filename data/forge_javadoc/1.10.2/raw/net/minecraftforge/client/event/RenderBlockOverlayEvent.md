---
title: "RenderBlockOverlayEvent"
description: "Called when a block's texture is going to be overlaid on the player's HUD. Cancel this event to prevent the overlay."
package: "net/minecraftforge/client/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/event/RenderBlockOverlayEvent.html"
sourceType: javadoc
---

# RenderBlockOverlayEvent

## Class signature

```java
public class RenderBlockOverlayEvent extends Event
```

## Constructors

- `public RenderBlockOverlayEvent( EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, IBlockState block, BlockPos blockPos)`

## Methods

- `@Deprecated public RenderBlockOverlayEvent( EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, Block block, int x, int y, int z)`
- `public EntityPlayer getPlayer()`
- `public float getRenderPartialTicks()`
- `public RenderBlockOverlayEvent.OverlayType getOverlayType()`
- `public IBlockState getBlockForOverlay()`
- `public BlockPos getBlockPos()`

## Description

Called when a block's texture is going to be overlaid on the player's HUD. Cancel this event to prevent the overlay.
