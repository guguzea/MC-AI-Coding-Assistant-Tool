---
title: "PlayerEvent.BreakSpeed"
description: "BreakSpeed is fired when a player attempts to harvest a block. This event is fired whenever a player attempts to harvest a block in EntityPlayer#canHarvestBlock(Block). This event is fired via the For"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/PlayerEvent.BreakSpeed.html"
sourceType: javadoc
---

# PlayerEvent.BreakSpeed

## Constructors

- `public BreakSpeed( EntityPlayer player, IBlockState state, float original, BlockPos pos)`

## Methods

- `public IBlockState getState()`
- `public float getOriginalSpeed()`
- `public float getNewSpeed()`
- `public void setNewSpeed(float newSpeed)`
- `public BlockPos getPos()`

## Description

BreakSpeed is fired when a player attempts to harvest a block. This event is fired whenever a player attempts to harvest a block in EntityPlayer#canHarvestBlock(Block). This event is fired via the For
