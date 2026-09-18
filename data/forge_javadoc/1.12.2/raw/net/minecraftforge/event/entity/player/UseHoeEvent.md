---
title: "UseHoeEvent"
description: "This event is fired when a player attempts to use a Hoe on a block, it can be canceled to completely prevent any further processing. You can also set the result to ALLOW to mark the event as processed"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/UseHoeEvent.html"
sourceType: javadoc
---

# UseHoeEvent

## Class signature

```java
public class UseHoeEvent extends PlayerEvent
```

## Constructors

- `public UseHoeEvent( EntityPlayer player, ItemStack current, World world, BlockPos pos)`

## Methods

- `public ItemStack getCurrent()`
- `public World getWorld()`
- `public BlockPos getPos()`

## Description

This event is fired when a player attempts to use a Hoe on a block, it can be canceled to completely prevent any further processing. You can also set the result to ALLOW to mark the event as processed
