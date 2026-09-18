---
title: "EnchantmentDamage"
description: "public class EnchantmentDamage extends Enchantment"
package: "net/minecraft/enchantment"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/enchantment/EnchantmentDamage.html"
sourceType: javadoc
---

# EnchantmentDamage

## Class signature

```java
public class EnchantmentDamage extends Enchantment
```

## Constructors

- `public EnchantmentDamage( Enchantment.Rarity rarityIn, int damageTypeIn, EntityEquipmentSlot ... slots)`

## Methods

- `public int getMinEnchantability(int enchantmentLevel)`
- `public int getMaxEnchantability(int enchantmentLevel)`
- `public int getMaxLevel()`
- `public float calcDamageByCreature(int level, EnumCreatureAttribute creatureType)`
- `public java.lang.String getName()`
- `public boolean canApplyTogether( Enchantment ench)`
- `public boolean canApply( ItemStack stack)`
- `public void onEntityDamaged( EntityLivingBase user, Entity target, int level)`
