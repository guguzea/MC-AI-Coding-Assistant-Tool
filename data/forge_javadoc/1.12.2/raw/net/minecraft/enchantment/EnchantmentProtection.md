---
title: "EnchantmentProtection"
description: "public class EnchantmentProtection extends Enchantment"
package: "net/minecraft/enchantment"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/enchantment/EnchantmentProtection.html"
sourceType: javadoc
---

# EnchantmentProtection

## Class signature

```java
public class EnchantmentProtection extends Enchantment
```

## Constructors

- `public EnchantmentProtection( Enchantment.Rarity rarityIn, EnchantmentProtection.Type protectionTypeIn, EntityEquipmentSlot ... slots)`

## Methods

- `public int getMinEnchantability(int enchantmentLevel)`
- `public int getMaxEnchantability(int enchantmentLevel)`
- `public int getMaxLevel()`
- `public int calcModifierDamage(int level, DamageSource source)`
- `public java.lang.String getName()`
- `public boolean canApplyTogether( Enchantment ench)`
- `public static int getFireTimeForEntity( EntityLivingBase p_92093_0_, int p_92093_1_)`
- `public static double getBlastDamageReduction( EntityLivingBase entityLivingBaseIn, double damage)`
