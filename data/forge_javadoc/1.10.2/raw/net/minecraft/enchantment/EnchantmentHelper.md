---
title: "EnchantmentHelper"
description: "public class EnchantmentHelper extends java.lang.Object"
package: "net/minecraft/enchantment"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/enchantment/EnchantmentHelper.html"
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

- `public static int getEnchantmentLevel( Enchantment enchID, @Nullable ItemStack stack)`
- `public static java.util.Map< Enchantment ,java.lang.Integer> getEnchantments( ItemStack stack)`
- `public static void setEnchantments(java.util.Map< Enchantment ,java.lang.Integer> enchMap, ItemStack stack)`
- `public static int getEnchantmentModifierDamage(java.lang.Iterable< ItemStack > stacks, DamageSource source)`
- `public static float getModifierForCreature( ItemStack stack, EnumCreatureAttribute creatureAttribute)`
- `public static void applyThornEnchantments( EntityLivingBase p_151384_0_, Entity p_151384_1_)`
- `public static void applyArthropodEnchantments( EntityLivingBase p_151385_0_, Entity p_151385_1_)`
- `public static int getMaxEnchantmentLevel( Enchantment p_185284_0_, EntityLivingBase p_185284_1_)`
- `public static int getKnockbackModifier( EntityLivingBase player)`
- `public static int getFireAspectModifier( EntityLivingBase player)`
- `public static int getRespirationModifier( EntityLivingBase p_185292_0_)`
- `public static int getDepthStriderModifier( EntityLivingBase p_185294_0_)`
- `public static int getEfficiencyModifier( EntityLivingBase p_185293_0_)`
- `public static int getLuckOfSeaModifier( EntityLivingBase player)`
- `public static int getLureModifier( EntityLivingBase player)`
- `public static int getLootingModifier( EntityLivingBase p_185283_0_)`
- `public static boolean getAquaAffinityModifier( EntityLivingBase p_185287_0_)`
- `public static boolean hasFrostWalkerEnchantment( EntityLivingBase player)`
- `@Nullable public static ItemStack getEnchantedItem( Enchantment p_92099_0_, EntityLivingBase p_92099_1_)`
- `public static int calcItemStackEnchantability(java.util.Random rand, int enchantNum, int power, ItemStack stack)`
- `public static ItemStack addRandomEnchantment(java.util.Random random, ItemStack p_77504_1_, int p_77504_2_, boolean allowTreasure)`
- `public static java.util.List< EnchantmentData > buildEnchantmentList(java.util.Random randomIn, ItemStack itemStackIn, int p_77513_2_, boolean allowTreasure)`
- `public static void removeIncompatible(java.util.List< EnchantmentData > p_185282_0_, EnchantmentData p_185282_1_)`
- `public static java.util.List< EnchantmentData > getEnchantmentDatas(int p_185291_0_, ItemStack p_185291_1_, boolean allowTreasure)`
