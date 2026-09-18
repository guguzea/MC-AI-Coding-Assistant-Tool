---
title: "MinecartInteractEvent"
description: "MinecartInteractEvent is fired when a player interacts with a minecart. This event is fired whenever a player interacts with a minecart in EntityMinecartContainer#interactFirst(EntityPlayer), EntityMi"
package: "net/minecraftforge/event/entity/minecart"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/minecart/MinecartInteractEvent.html"
sourceType: javadoc
---

# MinecartInteractEvent

## Class signature

```java
public class MinecartInteractEvent extends MinecartEvent
```

## Constructors

- `public MinecartInteractEvent( EntityMinecart minecart, EntityPlayer player, ItemStack item, EnumHand hand)`

## Methods

- `public EntityPlayer getPlayer()`
- `public ItemStack getItem()`
- `public EnumHand getHand()`

## Description

MinecartInteractEvent is fired when a player interacts with a minecart. This event is fired whenever a player interacts with a minecart in EntityMinecartContainer#interactFirst(EntityPlayer), EntityMi
