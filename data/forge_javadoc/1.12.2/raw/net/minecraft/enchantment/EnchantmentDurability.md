---
title: "EnchantmentDurability"
description: "public class EnchantmentDurability extends Enchantment"
package: "net/minecraft/enchantment"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/enchantment/EnchantmentDurability.html"
sourceType: javadoc
---

# EnchantmentDurability

## Class signature

```java
public class EnchantmentDurability extends Enchantment
```

## Constructors

- `protected EnchantmentDurability( Enchantment.Rarity rarityIn, EntityEquipmentSlot ... slots)`

## Methods

- `public int getMinEnchantability(int enchantmentLevel)`
- `public int getMaxEnchantability(int enchantmentLevel)`
- `public int getMaxLevel()`
- `public boolean canApply( ItemStack stack)`
- `public static boolean negateDamage( ItemStack stack, int level, java.util.Random rand)`
