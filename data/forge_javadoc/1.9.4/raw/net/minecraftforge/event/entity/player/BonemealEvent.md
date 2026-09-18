---
title: "BonemealEvent"
description: "This event is called when a player attempts to use Bonemeal on a block. It can be canceled to completely prevent any further processing. You can also set the result to ALLOW to mark the event as proce"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/BonemealEvent.html"
sourceType: javadoc
---

# BonemealEvent

## Class signature

```java
public class BonemealEvent extends PlayerEvent
```

## Constructors

- `public BonemealEvent( EntityPlayer player, World world, BlockPos pos, IBlockState block)`

## Methods

- `public World getWorld()`
- `public BlockPos getPos()`
- `public IBlockState getBlock()`

## Description

This event is called when a player attempts to use Bonemeal on a block. It can be canceled to completely prevent any further processing. You can also set the result to ALLOW to mark the event as proce
