---
title: "EnchantmentHelper"
description: "Adds a random enchantment to the specified item."
package: "net/minecraft/enchantment"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/enchantment/EnchantmentHelper.html"
sourceType: javadoc
---

# EnchantmentHelper

## Class signature

```java
public class EnchantmentHelper extends java.lang.Object
```

## Constructors

- `public EnchantmentHelper()`

## Methods

- `public static int getEnchantmentLevel(int enchID, ItemStack stack)`
- `public static java.util.Map<java.lang.Integer,java.lang.Integer> getEnchantments( ItemStack stack)`
- `public static void setEnchantments(java.util.Map<java.lang.Integer,java.lang.Integer> enchMap, ItemStack stack)`
- `public static int getMaxEnchantmentLevel(int enchID, ItemStack [] stacks)`
- `public static int getEnchantmentModifierDamage( ItemStack [] stacks, DamageSource source)`
- `public static float func_152377_a( ItemStack p_152377_0_, EnumCreatureAttribute p_152377_1_)`
- `public static void applyThornEnchantments( EntityLivingBase p_151384_0_, Entity p_151384_1_)`
- `public static void applyArthropodEnchantments( EntityLivingBase p_151385_0_, Entity p_151385_1_)`
- `public static int getKnockbackModifier( EntityLivingBase player)`
- `public static int getFireAspectModifier( EntityLivingBase player)`
- `public static int getRespiration( Entity player)`
- `public static int getDepthStriderModifier( Entity player)`
- `public static int getEfficiencyModifier( EntityLivingBase player)`
- `public static boolean getSilkTouchModifier( EntityLivingBase player)`
- `public static int getFortuneModifier( EntityLivingBase player)`
- `public static int getLuckOfSeaModifier( EntityLivingBase player)`
- `public static int getLureModifier( EntityLivingBase player)`
- `public static int getLootingModifier( EntityLivingBase player)`
- `public static boolean getAquaAffinityModifier( EntityLivingBase player)`
- `public static ItemStack getEnchantedItem( Enchantment p_92099_0_, EntityLivingBase p_92099_1_)`
- `public static int calcItemStackEnchantability(java.util.Random p_77514_0_, int p_77514_1_, int p_77514_2_, ItemStack p_77514_3_)`
- `public static ItemStack addRandomEnchantment(java.util.Random p_77504_0_, ItemStack p_77504_1_, int p_77504_2_)`
- `public static java.util.List< EnchantmentData > buildEnchantmentList(java.util.Random randomIn, ItemStack itemStackIn, int p_77513_2_)`
- `public static java.util.Map<java.lang.Integer, EnchantmentData > mapEnchantmentData(int p_77505_0_, ItemStack p_77505_1_)`

## Description

Adds a random enchantment to the specified item.
