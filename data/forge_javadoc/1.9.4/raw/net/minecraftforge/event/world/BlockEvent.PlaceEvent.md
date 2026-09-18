---
title: "BlockEvent.PlaceEvent"
description: "Called when a block is placed by a player. If a Block Place event is cancelled, the block will not be placed."
package: "net/minecraftforge/event/world"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/world/BlockEvent.PlaceEvent.html"
sourceType: javadoc
---

# BlockEvent.PlaceEvent

## Constructors

- `public PlaceEvent( BlockSnapshot blockSnapshot, IBlockState placedAgainst, EntityPlayer player)`

## Methods

- `public EntityPlayer getPlayer()`
- `public ItemStack getItemInHand()`
- `public BlockSnapshot getBlockSnapshot()`
- `public IBlockState getPlacedBlock()`
- `public IBlockState getPlacedAgainst()`

## Description

Called when a block is placed by a player. If a Block Place event is cancelled, the block will not be placed.
