---
title: "ArrowLooseEvent"
description: "ArrowLooseEvent is fired when a player stops using a bow. This event is fired whenever a player stops using a bow in ItemBow.onPlayerStoppedUsing(ItemStack, World, EntityLivingBase, int) . bow contain"
package: "net/minecraftforge/event/entity/player"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/player/ArrowLooseEvent.html"
sourceType: javadoc
---

# ArrowLooseEvent

## Class signature

```java
public class ArrowLooseEvent extends PlayerEvent
```

## Constructors

- `public ArrowLooseEvent( EntityPlayer player, @Nonnull ItemStack bow, World world, int charge, boolean hasAmmo)`

## Methods

- `@Nonnull public ItemStack getBow()`
- `public World getWorld()`
- `public boolean hasAmmo()`
- `public int getCharge()`
- `public void setCharge(int charge)`

## Description

ArrowLooseEvent is fired when a player stops using a bow. This event is fired whenever a player stops using a bow in ItemBow.onPlayerStoppedUsing(ItemStack, World, EntityLivingBase, int) . bow contain
