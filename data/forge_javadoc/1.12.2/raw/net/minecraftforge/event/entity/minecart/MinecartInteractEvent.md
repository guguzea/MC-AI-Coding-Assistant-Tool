---
title: "MinecartInteractEvent"
description: "MinecartInteractEvent is fired when a player interacts with a minecart. This event is fired whenever a player interacts with a minecart in EntityMinecart.processInitialInteract(EntityPlayer, EnumHand)"
package: "net/minecraftforge/event/entity/minecart"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/minecart/MinecartInteractEvent.html"
sourceType: javadoc
---

# MinecartInteractEvent

## Class signature

```java
public class MinecartInteractEvent extends MinecartEvent
```

## Constructors

- `public MinecartInteractEvent( EntityMinecart minecart, EntityPlayer player, EnumHand hand)`

## Methods

- `public EntityPlayer getPlayer()`
- `public ItemStack getItem()`
- `public EnumHand getHand()`

## Description

MinecartInteractEvent is fired when a player interacts with a minecart. This event is fired whenever a player interacts with a minecart in EntityMinecart.processInitialInteract(EntityPlayer, EnumHand)
