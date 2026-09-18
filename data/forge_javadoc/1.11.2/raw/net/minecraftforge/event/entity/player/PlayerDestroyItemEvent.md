---
title: "PlayerDestroyItemEvent"
description: "PlayerDestroyItemEvent is fired when a player destroys an item. This event is fired whenever a player destroys an item in PlayerControllerMP#processRightClick(EntityPlayer, World, ItemStack, EnumHand)"
package: "net/minecraftforge/event/entity/player"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/player/PlayerDestroyItemEvent.html"
sourceType: javadoc
---

# PlayerDestroyItemEvent

## Class signature

```java
public class PlayerDestroyItemEvent extends PlayerEvent
```

## Constructors

- `public PlayerDestroyItemEvent( EntityPlayer player, @Nonnull ItemStack original, @Nullable EnumHand hand)`

## Methods

- `@Nonnull public ItemStack getOriginal()`
- `@Nullable public EnumHand getHand()`

## Description

PlayerDestroyItemEvent is fired when a player destroys an item. This event is fired whenever a player destroys an item in PlayerControllerMP#processRightClick(EntityPlayer, World, ItemStack, EnumHand)
