---
title: "EnchantmentDigging"
description: "Determines if this enchantment can be applied to a specific ItemStack."
package: "net/minecraft/enchantment"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/enchantment/EnchantmentDigging.html"
sourceType: javadoc
---

# EnchantmentDigging

## Class signature

```java
public class EnchantmentDigging extends Enchantment
```

## Constructors

- `protected EnchantmentDigging(int enchID, ResourceLocation enchName, int enchWeight)`

## Methods

- `public int getMinEnchantability(int enchantmentLevel)`
- `public int getMaxEnchantability(int enchantmentLevel)`
- `public int getMaxLevel()`
- `public boolean canApply( ItemStack stack)`

## Description

Determines if this enchantment can be applied to a specific ItemStack.
