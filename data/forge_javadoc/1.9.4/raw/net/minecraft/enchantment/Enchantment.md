---
title: "Enchantment"
description: "This applies specifically to applying at the enchanting table."
package: "net/minecraft/enchantment"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/enchantment/Enchantment.html"
sourceType: javadoc
---

# Enchantment

## Class signature

```java
public abstract class Enchantment extends IForgeRegistryEntry.Impl < Enchantment >
```

## Constructors

- `protected Enchantment( Enchantment.Rarity rarityIn, EnumEnchantmentType typeIn, EntityEquipmentSlot [] slots)`

## Methods

- `@Nullable public static Enchantment getEnchantmentByID(int id)`
- `public static int getEnchantmentID( Enchantment enchantmentIn)`
- `@Nullable public static Enchantment getEnchantmentByLocation(java.lang.String location)`
- `@Nullable public java.lang.Iterable< ItemStack > getEntityEquipment( EntityLivingBase entityIn)`
- `public Enchantment.Rarity getRarity()`
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
- `public boolean isTreasureEnchantment()`
- `public boolean canApplyAtEnchantingTable( ItemStack stack)`
- `public boolean isAllowedOnBooks()`
- `public static void registerEnchantments()`

## Description

This applies specifically to applying at the enchanting table.
