---
title: "EnchantmentProtection"
description: "public class EnchantmentProtection extends Enchantment"
package: "net/minecraft/enchantment"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/enchantment/EnchantmentProtection.html"
sourceType: javadoc
---

# EnchantmentProtection

**Inheritance:** java.lang.Object → net.minecraft.enchantment.Enchantment → net.minecraft.enchantment.EnchantmentProtection

## Class signature

```java
public class EnchantmentProtection extends Enchantment
```

## Constructors

- `EnchantmentProtection(int p_i45765_1_, ResourceLocation p_i45765_2_, int p_i45765_3_, int p_i45765_4_)`

## Methods

- `int calcModifierDamage(int level, DamageSource source)` — Calculates the damage protection of the enchantment based on level and damage source passed.
- `boolean canApplyTogether(Enchantment ench)` — Determines if the enchantment passed can be applyied together with this enchantment.
- `static double func_92092_a(Entity p_92092_0_, double p_92092_1_)`
- `static int getFireTimeForEntity(Entity p_92093_0_, int p_92093_1_)` — Gets the amount of ticks an entity should be set fire, adjusted for fire protection.
- `int getMaxEnchantability(int enchantmentLevel)` — Returns the maximum value of enchantability nedded on the enchantment level passed.
- `int getMaxLevel()` — Returns the maximum level that the enchantment can have.
- `int getMinEnchantability(int enchantmentLevel)` — Returns the minimal value of enchantability needed on the enchantment level passed.
- `java.lang.String getName()` — Return the name of key in translation table of this enchantment.

## Fields

- `int protectionType` — Defines the type of protection of the enchantment, 0 = all, 1 = fire, 2 = fall (feather fall), 3 = explosion and 4 = projectile.
