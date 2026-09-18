---
title: "EnchantmentLevelSetEvent"
description: "Fired when the enchantment level is set for each of the three potential enchantments in the enchanting table. The level is set to the vanilla value and can be modified by this event handler. The encha"
package: "net/minecraftforge/event/enchanting"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/enchanting/EnchantmentLevelSetEvent.html"
sourceType: javadoc
---

# EnchantmentLevelSetEvent

## Class signature

```java
public class EnchantmentLevelSetEvent extends Event
```

## Constructors

- `public EnchantmentLevelSetEvent( World world, BlockPos pos, int enchantRow, int power, @Nonnull ItemStack itemStack, int level)`

## Methods

- `public World getWorld()`
- `public BlockPos getPos()`
- `public int getEnchantRow()`
- `public int getPower()`
- `@Nonnull public ItemStack getItem()`
- `public int getOriginalLevel()`
- `public int getLevel()`
- `public void setLevel(int level)`

## Description

Fired when the enchantment level is set for each of the three potential enchantments in the enchanting table. The level is set to the vanilla value and can be modified by this event handler. The encha
