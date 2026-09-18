---
title: "Enchantment"
description: "Increases underwater mining rate"
package: "net/minecraft/enchantment"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/enchantment/Enchantment.html"
sourceType: javadoc
---

# Enchantment

## Class signature

```java
public abstract class Enchantment extends java.lang.Object
```

## Constructors

- `protected Enchantment(int enchID, ResourceLocation enchName, int enchWeight, EnumEnchantmentType enchType)`

## Methods

- `public static Enchantment getEnchantmentById(int enchID)`
- `public static Enchantment getEnchantmentByLocation(java.lang.String location)`
- `public static java.util.Set< ResourceLocation > func_181077_c()`
- `public int getWeight()`
- `public int getMinLevel()`
- `public int getMaxLevel()`
- `public int getMinEnchantability(int enchantmentLevel)`
- `public int getMaxEnchantability(int enchantmentLevel)`
- `public int calcModifierDamage(int level, DamageSource source)`
- `public float calcDamageByCreature(int level, EnumCreatureAttribute creatureType)`
- `public boolean canApplyTogether( Enchantment ench)`
- `public Enchantment setName(java.lang.String enchName)`
- `public java.lang.String getName()`
- `public java.lang.String getTranslatedName(int level)`
- `public boolean canApply( ItemStack stack)`
- `public void onEntityDamaged( EntityLivingBase user, Entity target, int level)`
- `public void onUserHurt( EntityLivingBase user, Entity attacker, int level)`
- `public boolean canApplyAtEnchantingTable( ItemStack stack)`
- `public static void addToBookList( Enchantment enchantment)`
- `public boolean isAllowedOnBooks()`

## Description

Increases underwater mining rate
