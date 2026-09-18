---
title: "PlayerEvent.HarvestCheck"
description: "HarvestCheck is fired when a player attempts to harvest a block. This event is fired whenever a player attempts to harvest a block in EntityPlayer.canHarvestBlock(IBlockState) . This event is fired vi"
package: "net/minecraftforge/event/entity/player"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/player/PlayerEvent.HarvestCheck.html"
sourceType: javadoc
---

# PlayerEvent.HarvestCheck

## Constructors

- `public HarvestCheck( EntityPlayer player, IBlockState state, boolean success)`

## Methods

- `public IBlockState getTargetBlock()`
- `public boolean canHarvest()`
- `public void setCanHarvest(boolean success)`

## Description

HarvestCheck is fired when a player attempts to harvest a block. This event is fired whenever a player attempts to harvest a block in EntityPlayer.canHarvestBlock(IBlockState) . This event is fired vi
