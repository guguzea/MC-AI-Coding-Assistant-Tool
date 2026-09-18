---
title: "ArrowLooseEvent"
description: "ArrowLooseEvent is fired when a player stops using a bow. This event is fired whenever a player stops using a bow in ItemBow#onPlayerStoppedUsing(ItemStack, World, EntityPlayer, int). bow contains the"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/ArrowLooseEvent.html"
sourceType: javadoc
---

# ArrowLooseEvent

## Class signature

```java
public class ArrowLooseEvent extends PlayerEvent
```

## Constructors

- `public ArrowLooseEvent( EntityPlayer player, ItemStack bow, World world, int charge, boolean hasAmmo)`

## Methods

- `public ItemStack getBow()`
- `public World getWorld()`
- `public boolean hasAmmo()`
- `public int getCharge()`
- `public void setCharge(int charge)`

## Description

ArrowLooseEvent is fired when a player stops using a bow. This event is fired whenever a player stops using a bow in ItemBow#onPlayerStoppedUsing(ItemStack, World, EntityPlayer, int). bow contains the
