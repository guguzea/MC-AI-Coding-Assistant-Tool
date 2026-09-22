---
title: "EnchantmentDamage"
description: "public class EnchantmentDamage extends Enchantment"
package: "net/minecraft/enchantment"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/enchantment/EnchantmentDamage.html"
sourceType: javadoc
---

# EnchantmentDamage

**Inheritance:** java.lang.Object → net.minecraft.enchantment.Enchantment → net.minecraft.enchantment.EnchantmentDamage

## Class signature

```java
public class EnchantmentDamage extends Enchantment
```

## Constructors

- `EnchantmentDamage(int enchID, ResourceLocation enchName, int enchWeight, int classification)`

## Methods

- `float calcDamageByCreature(int level, EnumCreatureAttribute creatureType)` — Calculates the additional damage that will be dealt by an item with this enchantment.
- `boolean canApply(ItemStack stack)` — Determines if this enchantment can be applied to a specific ItemStack.
- `boolean canApplyTogether(Enchantment ench)` — Determines if the enchantment passed can be applyied together with this enchantment.
- `int getMaxEnchantability(int enchantmentLevel)` — Returns the maximum value of enchantability nedded on the enchantment level passed.
- `int getMaxLevel()` — Returns the maximum level that the enchantment can have.
- `int getMinEnchantability(int enchantmentLevel)` — Returns the minimal value of enchantability needed on the enchantment level passed.
- `java.lang.String getName()` — Return the name of key in translation table of this enchantment.
- `void onEntityDamaged(EntityLivingBase user, Entity target, int level)` — Called whenever a mob is damaged with an item that has this enchantment on it.

## Fields

- `int damageType` — Defines the type of damage of the enchantment, 0 = all, 1 = undead, 3 = arthropods
