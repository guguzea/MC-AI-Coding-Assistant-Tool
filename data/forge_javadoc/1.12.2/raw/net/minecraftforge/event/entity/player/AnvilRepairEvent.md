---
title: "AnvilRepairEvent"
description: "public class AnvilRepairEvent extends PlayerEvent"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/AnvilRepairEvent.html"
sourceType: javadoc
---

# AnvilRepairEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.AnvilRepairEvent

## Class signature

```java
public class AnvilRepairEvent extends PlayerEvent
```

## Constructors

- `AnvilRepairEvent(EntityPlayer player, ItemStack left, ItemStack right, ItemStack output)`

## Methods

- `float getBreakChance()`
- `ItemStack getIngredientInput()` — Get the second item input into the anvil
- `ItemStack getItemInput()` — Get the first item input into the anvil
- `ItemStack getItemResult()` — Get the output result from the anvil
- `@Deprecated ItemStack getLeft()`
- `@Deprecated ItemStack getOutput()`
- `@Deprecated ItemStack getRight()`
- `void setBreakChance(float breakChance)`
