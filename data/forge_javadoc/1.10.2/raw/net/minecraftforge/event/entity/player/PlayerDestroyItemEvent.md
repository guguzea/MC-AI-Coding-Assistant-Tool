---
title: "PlayerDestroyItemEvent"
description: "PlayerDestroyItemEvent is fired when a player destroys an item. This event is fired whenever a player destroys an item in PlayerControllerMP.processRightClick(EntityPlayer, World, ItemStack, EnumHand)"
package: "net/minecraftforge/event/entity/player"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/player/PlayerDestroyItemEvent.html"
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

PlayerDestroyItemEvent is fired when a player destroys an item. This event is fired whenever a player destroys an item in PlayerControllerMP.processRightClick(EntityPlayer, World, ItemStack, EnumHand)
