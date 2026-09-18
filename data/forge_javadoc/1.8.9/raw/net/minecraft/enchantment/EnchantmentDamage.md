---
title: "EnchantmentDamage"
description: "Defines the type of damage of the enchantment, 0 = all, 1 = undead, 3 = arthropods"
package: "net/minecraft/enchantment"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/enchantment/EnchantmentDamage.html"
sourceType: javadoc
---

# EnchantmentDamage

## Class signature

```java
public class EnchantmentDamage extends Enchantment
```

## Constructors

- `public EnchantmentDamage(int enchID, ResourceLocation enchName, int enchWeight, int classification)`

## Methods

- `public int getMinEnchantability(int enchantmentLevel)`
- `public int getMaxEnchantability(int enchantmentLevel)`
- `public int getMaxLevel()`
- `public float calcDamageByCreature(int level, EnumCreatureAttribute creatureType)`
- `public java.lang.String getName()`
- `public boolean canApplyTogether( Enchantment ench)`
- `public boolean canApply( ItemStack stack)`
- `public void onEntityDamaged( EntityLivingBase user, Entity target, int level)`

## Description

Defines the type of damage of the enchantment, 0 = all, 1 = undead, 3 = arthropods
