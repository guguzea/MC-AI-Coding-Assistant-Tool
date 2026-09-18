---
title: "PlayerDestroyItemEvent"
description: "PlayerDestroyItemEvent is fired when a player destroys an item. This event is fired whenever a player destroys an item in PlayerControllerMP.onPlayerDestroyBlock(BlockPos) , PlayerControllerMP.process"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/PlayerDestroyItemEvent.html"
sourceType: javadoc
---

# PlayerDestroyItemEvent

## Class signature

```java
public class PlayerDestroyItemEvent extends PlayerEvent
```

## Constructors

- `public PlayerDestroyItemEvent( EntityPlayer player, ItemStack original, EnumHand hand)`

## Methods

- `public ItemStack getOriginal()`
- `public EnumHand getHand()`

## Description

PlayerDestroyItemEvent is fired when a player destroys an item. This event is fired whenever a player destroys an item in PlayerControllerMP.onPlayerDestroyBlock(BlockPos) , PlayerControllerMP.process
