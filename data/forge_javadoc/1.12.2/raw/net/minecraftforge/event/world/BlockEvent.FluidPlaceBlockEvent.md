---
title: "BlockEvent.FluidPlaceBlockEvent"
description: "Fired when a liquid places a block. Use setNewState(IBlockState) to change the result of a cobblestone generator or add variants of obsidian. Alternatively, you could execute arbitrary code when lava "
package: "net/minecraftforge/event/world"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/world/BlockEvent.FluidPlaceBlockEvent.html"
sourceType: javadoc
---

# BlockEvent.FluidPlaceBlockEvent

## Constructors

- `public FluidPlaceBlockEvent( World world, BlockPos pos, BlockPos liquidPos, IBlockState state)`

## Methods

- `public BlockPos getLiquidPos()`
- `public IBlockState getNewState()`
- `public void setNewState( IBlockState state)`
- `public IBlockState getOriginalState()`

## Description

Fired when a liquid places a block. Use setNewState(IBlockState) to change the result of a cobblestone generator or add variants of obsidian. Alternatively, you could execute arbitrary code when lava 
