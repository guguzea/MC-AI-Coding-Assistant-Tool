---
title: "FurnaceFuelBurnTimeEvent"
description: "FurnaceFuelBurnTimeEvent is fired when determining the fuel value for an ItemStack. To set the burn time of your own item, use Item.getItemBurnTime(ItemStack) instead. This event is fired from ForgeEv"
package: "net/minecraftforge/event/furnace"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/furnace/FurnaceFuelBurnTimeEvent.html"
sourceType: javadoc
---

# FurnaceFuelBurnTimeEvent

## Class signature

```java
public class FurnaceFuelBurnTimeEvent extends Event
```

## Constructors

- `public FurnaceFuelBurnTimeEvent( ItemStack itemStack, int burnTime)`

## Methods

- `public ItemStack getItemStack()`
- `public void setBurnTime(int burnTime)`
- `public int getBurnTime()`

## Description

FurnaceFuelBurnTimeEvent is fired when determining the fuel value for an ItemStack. To set the burn time of your own item, use Item.getItemBurnTime(ItemStack) instead. This event is fired from ForgeEv
