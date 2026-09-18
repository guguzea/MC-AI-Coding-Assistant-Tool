---
title: "ItemFishedEvent"
description: "This event is called when a player fishes an item. This event is Cancelable Canceling the event will cause the player to receive no items at all. The hook will still take the damage specified"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/ItemFishedEvent.html"
sourceType: javadoc
---

# ItemFishedEvent

## Class signature

```java
public class ItemFishedEvent extends PlayerEvent
```

## Constructors

- `public ItemFishedEvent(java.util.List< ItemStack > stacks, int rodDamage, EntityFishHook hook)`

## Methods

- `public int getRodDamage()`
- `public void damageRodBy(int rodDamage)`
- `public NonNullList < ItemStack > getDrops()`
- `public EntityFishHook getHookEntity()`

## Description

This event is called when a player fishes an item. This event is Cancelable Canceling the event will cause the player to receive no items at all. The hook will still take the damage specified
