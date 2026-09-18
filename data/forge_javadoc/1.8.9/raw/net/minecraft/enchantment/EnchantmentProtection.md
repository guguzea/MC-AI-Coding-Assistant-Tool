---
title: "EnchantmentProtection"
description: "Defines the type of protection of the enchantment, 0 = all, 1 = fire, 2 = fall (feather fall), 3 = explosion and 4 = projectile."
package: "net/minecraft/enchantment"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/enchantment/EnchantmentProtection.html"
sourceType: javadoc
---

# EnchantmentProtection

## Class signature

```java
public class EnchantmentProtection extends Enchantment
```

## Constructors

- `public EnchantmentProtection(int p_i45765_1_, ResourceLocation p_i45765_2_, int p_i45765_3_, int p_i45765_4_)`

## Methods

- `public int getMinEnchantability(int enchantmentLevel)`
- `public int getMaxEnchantability(int enchantmentLevel)`
- `public int getMaxLevel()`
- `public int calcModifierDamage(int level, DamageSource source)`
- `public java.lang.String getName()`
- `public boolean canApplyTogether( Enchantment ench)`
- `public static int getFireTimeForEntity( Entity p_92093_0_, int p_92093_1_)`
- `public static double func_92092_a( Entity p_92092_0_, double p_92092_1_)`

## Description

Defines the type of protection of the enchantment, 0 = all, 1 = fire, 2 = fall (feather fall), 3 = explosion and 4 = projectile.
