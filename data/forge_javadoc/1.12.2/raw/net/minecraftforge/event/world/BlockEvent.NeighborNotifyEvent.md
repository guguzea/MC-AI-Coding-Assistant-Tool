---
title: "BlockEvent.NeighborNotifyEvent"
description: "Fired when a physics update occurs on a block. This event acts as a way for mods to detect physics updates, in the same way a BUD switch does. This event is only called on the server."
package: "net/minecraftforge/event/world"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/BlockEvent.NeighborNotifyEvent.html"
sourceType: javadoc
---

# BlockEvent.NeighborNotifyEvent

## Constructors

- `public NeighborNotifyEvent( World world, BlockPos pos, IBlockState state, java.util.EnumSet< EnumFacing > notifiedSides, boolean forceRedstoneUpdate)`

## Methods

- `public java.util.EnumSet< EnumFacing > getNotifiedSides()`
- `public boolean getForceRedstoneUpdate()`

## Description

Fired when a physics update occurs on a block. This event acts as a way for mods to detect physics updates, in the same way a BUD switch does. This event is only called on the server.
