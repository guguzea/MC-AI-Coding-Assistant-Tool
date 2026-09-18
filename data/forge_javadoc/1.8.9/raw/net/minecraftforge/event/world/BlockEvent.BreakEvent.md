---
title: "BlockEvent.BreakEvent"
description: "Event that is fired when an Block is about to be broken by a player Canceling this event will prevent the Block from being broken."
package: "net/minecraftforge/event/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/world/BlockEvent.BreakEvent.html"
sourceType: javadoc
---

# BlockEvent.BreakEvent

## Constructors

- `public BreakEvent( World world, BlockPos pos, IBlockState state, EntityPlayer player)`

## Methods

- `public EntityPlayer getPlayer()`
- `public int getExpToDrop()`
- `public void setExpToDrop(int exp)`

## Description

Event that is fired when an Block is about to be broken by a player Canceling this event will prevent the Block from being broken.
