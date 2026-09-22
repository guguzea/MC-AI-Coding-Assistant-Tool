---
title: "EnchantmentDamage"
description: "public class EnchantmentDamage extends Enchantment"
package: "net/minecraft/enchantment"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/enchantment/EnchantmentDamage.html"
sourceType: javadoc
---

# EnchantmentDamage

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Enchantment> → net.minecraft.enchantment.Enchantment → net.minecraft.enchantment.EnchantmentDamage

## Class signature

```java
public class EnchantmentDamage extends Enchantment
```

## Constructors

- `EnchantmentDamage(Enchantment.Rarity rarityIn, int damageTypeIn, EntityEquipmentSlot ... slots)`

## Methods

- `float calcDamageByCreature(int level, EnumCreatureAttribute creatureType)`
- `boolean canApply(ItemStack stack)`
- `boolean canApplyTogether(Enchantment ench)`
- `int getMaxEnchantability(int enchantmentLevel)`
- `int getMaxLevel()`
- `int getMinEnchantability(int enchantmentLevel)`
- `java.lang.String getName()`
- `void onEntityDamaged(EntityLivingBase user, Entity target, int level)`

## Fields

- `int damageType`
