---
title: "EnchantmentLevelSetEvent"
description: "public class EnchantmentLevelSetEvent extends Event"
package: "net/minecraftforge/event/enchanting"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/enchanting/EnchantmentLevelSetEvent.html"
sourceType: javadoc
---

# EnchantmentLevelSetEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.enchanting.EnchantmentLevelSetEvent

## Class signature

```java
public class EnchantmentLevelSetEvent extends Event
```

## Constructors

- `EnchantmentLevelSetEvent(World world, BlockPos pos, int enchantRow, int power, ItemStack itemStack, int level)`

## Methods

- `int getEnchantRow()` — Get the row for which the enchantment level is being set
- `ItemStack getItem()` — Get the item being enchanted
- `int getLevel()` — Get the level of the enchantment for this row (0-30)
- `int getOriginalLevel()` — Get the original level of the enchantment for this row (0-30)
- `BlockPos getPos()` — Get the pos of the enchantment table
- `int getPower()` — Get the power (# of bookshelves) for the enchanting table
- `World getWorld()` — Get the world object
- `void setLevel(int level)` — Set the new level of the enchantment (0-30)
