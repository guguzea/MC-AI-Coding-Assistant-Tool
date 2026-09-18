---
title: "PlayerDestroyItemEvent"
description: "PlayerDestroyItemEvent is fired when a player destroys an item. This event is fired whenever a player destroys an item in PlayerControllerMP#onPlayerRightClick(EntityPlayer, World, ItemStack, int, int"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/PlayerDestroyItemEvent.html"
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

PlayerDestroyItemEvent is fired when a player destroys an item. This event is fired whenever a player destroys an item in PlayerControllerMP#onPlayerRightClick(EntityPlayer, World, ItemStack, int, int
