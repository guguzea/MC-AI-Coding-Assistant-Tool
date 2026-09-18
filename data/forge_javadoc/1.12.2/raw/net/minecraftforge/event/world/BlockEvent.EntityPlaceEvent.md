---
title: "BlockEvent.EntityPlaceEvent"
description: "Called when a block is placed. If a Block Place event is cancelled, the block will not be placed."
package: "net/minecraftforge/event/world"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/BlockEvent.EntityPlaceEvent.html"
sourceType: javadoc
---

# BlockEvent.EntityPlaceEvent

## Constructors

- `public EntityPlaceEvent( BlockSnapshot blockSnapshot, IBlockState placedAgainst, Entity entity)`

## Methods

- `public Entity getEntity()`
- `public BlockSnapshot getBlockSnapshot()`
- `public IBlockState getPlacedBlock()`
- `public IBlockState getPlacedAgainst()`

## Description

Called when a block is placed. If a Block Place event is cancelled, the block will not be placed.
