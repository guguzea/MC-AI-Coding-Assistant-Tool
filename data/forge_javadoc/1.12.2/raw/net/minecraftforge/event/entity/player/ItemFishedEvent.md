---
title: "ItemFishedEvent"
description: "public class ItemFishedEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/ItemFishedEvent.html"
sourceType: javadoc
---

# ItemFishedEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.ItemFishedEvent

## Class signature

```java
public class ItemFishedEvent extends PlayerEvent
```

## Constructors

- `ItemFishedEvent(java.util.List<ItemStack> stacks, int rodDamage, EntityFishHook hook)`

## Methods

- `void damageRodBy(int rodDamage)` — Specifies the amount of damage that the fishing rod should take.
- `NonNullList<ItemStack> getDrops()` — Use this to get the items the player will receive.
- `EntityFishHook getHookEntity()` — Use this to stuff related to the hook itself, like the position of the bobber.
- `int getRodDamage()` — Get the damage the rod will take.
