---
title: "MinecartInteractEvent"
description: "MinecartInteractEvent is fired when a player interacts with a minecart. This event is fired whenever a player interacts with a minecart in EntityMinecartContainer.processInitialInteract(EntityPlayer, "
package: "net/minecraftforge/event/entity/minecart"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/entity/minecart/MinecartInteractEvent.html"
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
- `@Nonnull public ItemStack getItem()`
- `public EnumHand getHand()`

## Description

MinecartInteractEvent is fired when a player interacts with a minecart. This event is fired whenever a player interacts with a minecart in EntityMinecartContainer.processInitialInteract(EntityPlayer, 
