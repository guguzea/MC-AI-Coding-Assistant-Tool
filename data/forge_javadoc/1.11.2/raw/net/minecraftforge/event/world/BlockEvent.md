---
title: "BlockEvent"
description: "Event that is fired when an Block is about to be broken by a player Canceling this event will prevent the Block from being broken."
package: "net/minecraftforge/event/world"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/world/BlockEvent.html"
sourceType: javadoc
---

# BlockEvent

## Class signature

```java
public class BlockEvent extends Event
```

## Constructors

- `public BlockEvent( World world, BlockPos pos, IBlockState state)`

## Methods

- `public World getWorld()`
- `public BlockPos getPos()`
- `public IBlockState getState()`

## Description

Event that is fired when an Block is about to be broken by a player Canceling this event will prevent the Block from being broken.
