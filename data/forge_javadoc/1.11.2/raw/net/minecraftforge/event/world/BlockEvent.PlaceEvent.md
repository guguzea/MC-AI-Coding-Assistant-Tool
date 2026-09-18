---
title: "BlockEvent.PlaceEvent"
description: "Called when a block is placed by a player. If a Block Place event is cancelled, the block will not be placed."
package: "net/minecraftforge/event/world"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/world/BlockEvent.PlaceEvent.html"
sourceType: javadoc
---

# BlockEvent.PlaceEvent

## Constructors

- `public PlaceEvent(@Nonnull BlockSnapshot blockSnapshot, @Nonnull IBlockState placedAgainst, @Nonnull EntityPlayer player, @Nonnull EnumHand hand)`

## Methods

- `@Deprecated public PlaceEvent( BlockSnapshot blockSnapshot, IBlockState placedAgainst, EntityPlayer player)`
- `public EntityPlayer getPlayer()`
- `@Nonnull @Deprecated public ItemStack getItemInHand()`
- `public BlockSnapshot getBlockSnapshot()`
- `public IBlockState getPlacedBlock()`
- `public IBlockState getPlacedAgainst()`
- `public EnumHand getHand()`

## Description

Called when a block is placed by a player. If a Block Place event is cancelled, the block will not be placed.
