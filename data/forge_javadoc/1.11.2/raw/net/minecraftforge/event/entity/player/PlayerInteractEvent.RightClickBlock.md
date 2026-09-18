---
title: "PlayerInteractEvent.RightClickBlock"
description: "This event is fired on both sides whenever the player right clicks while targeting a block. This event controls which of Block.onBlockActivated(net.minecraft.world.World, net.minecraft.util.math.Block"
package: "net/minecraftforge/event/entity/player"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/player/PlayerInteractEvent.RightClickBlock.html"
sourceType: javadoc
---

# PlayerInteractEvent.RightClickBlock

## Constructors

- `public RightClickBlock( EntityPlayer player, EnumHand hand, BlockPos pos, EnumFacing face, Vec3d hitVec)`

## Methods

- `public Vec3d getHitVec()`
- `public Event.Result getUseBlock()`
- `public Event.Result getUseItem()`
- `public void setUseBlock( Event.Result triggerBlock)`
- `public void setUseItem( Event.Result triggerItem)`
- `public void setCanceled(boolean canceled)`

## Description

This event is fired on both sides whenever the player right clicks while targeting a block. This event controls which of Block.onBlockActivated(net.minecraft.world.World, net.minecraft.util.math.Block
