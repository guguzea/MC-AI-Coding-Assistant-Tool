---
title: "ArrowNockEvent"
description: "ArrowNockEvent is fired when a player begins using a bow. This event is fired whenever a player begins using a bow in ItemBow.onItemRightClick(World, EntityPlayer, EnumHand) . This event is fired on t"
package: "net/minecraftforge/event/entity/player"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/player/ArrowNockEvent.html"
sourceType: javadoc
---

# ArrowNockEvent

## Class signature

```java
public class ArrowNockEvent extends PlayerEvent
```

## Constructors

- `public ArrowNockEvent( EntityPlayer player, @Nonnull ItemStack item, EnumHand hand, World world, boolean hasAmmo)`

## Methods

- `@Nonnull public ItemStack getBow()`
- `public World getWorld()`
- `public EnumHand getHand()`
- `public boolean hasAmmo()`
- `public ActionResult < ItemStack > getAction()`
- `public void setAction( ActionResult < ItemStack > action)`

## Description

ArrowNockEvent is fired when a player begins using a bow. This event is fired whenever a player begins using a bow in ItemBow.onItemRightClick(World, EntityPlayer, EnumHand) . This event is fired on t
