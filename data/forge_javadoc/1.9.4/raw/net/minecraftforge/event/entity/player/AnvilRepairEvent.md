---
title: "AnvilRepairEvent"
description: "public class AnvilRepairEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/AnvilRepairEvent.html"
sourceType: javadoc
---

# AnvilRepairEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.AnvilRepairEvent

## Class signature

```java
public class AnvilRepairEvent extends PlayerEvent
```

## Constructors

- `AnvilRepairEvent(EntityPlayer player, ItemStack output, ItemStack left, ItemStack right)`

## Methods

- `float getBreakChance()`
- `ItemStack getLeft()` — Fired when the player removes a "repaired" item from the Anvil's Output slot.
- `ItemStack getOutput()`
- `ItemStack getRight()`
- `void setBreakChance(float breakChance)`
