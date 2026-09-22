---
title: "EnchantmentHelper"
description: "public class EnchantmentHelper extends java.lang.Object"
package: "net/minecraft/enchantment"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/enchantment/EnchantmentHelper.html"
sourceType: javadoc
---

# EnchantmentHelper

**Inheritance:** java.lang.Object → net.minecraft.enchantment.EnchantmentHelper

## Class signature

```java
public class EnchantmentHelper extends java.lang.Object
```

## Constructors

- `EnchantmentHelper()`

## Methods

- `static ItemStack addRandomEnchantment(java.util.Random p_77504_0_, ItemStack p_77504_1_, int p_77504_2_)` — Adds a random enchantment to the specified item.
- `static void applyArthropodEnchantments(EntityLivingBase p_151385_0_, Entity p_151385_1_)`
- `static void applyThornEnchantments(EntityLivingBase p_151384_0_, Entity p_151384_1_)`
- `static java.util.List<EnchantmentData> buildEnchantmentList(java.util.Random randomIn, ItemStack itemStackIn, int p_77513_2_)`
- `static int calcItemStackEnchantability(java.util.Random p_77514_0_, int p_77514_1_, int p_77514_2_, ItemStack p_77514_3_)` — Returns the enchantability of itemstack, it's uses a singular formula for each index (2nd parameter: 0, 1 and 2), cutting to the max enchantability power of the table (3rd parameter)
- `static float func_152377_a(ItemStack p_152377_0_, EnumCreatureAttribute p_152377_1_)`
- `static boolean getAquaAffinityModifier(EntityLivingBase player)` — Returns the aqua affinity status of enchantments on current equipped item of player.
- `static int getDepthStriderModifier(Entity player)` — Returns the level of the Depth Strider enchantment.
- `static int getEfficiencyModifier(EntityLivingBase player)` — Return the extra efficiency of tools based on enchantments on equipped player item.
- `static ItemStack getEnchantedItem(Enchantment p_92099_0_, EntityLivingBase p_92099_1_)`
- `static int getEnchantmentLevel(int enchID, ItemStack stack)` — Returns the level of enchantment on the ItemStack passed.
- `static int getEnchantmentModifierDamage(ItemStack [] stacks, DamageSource source)` — Returns the modifier of protection enchantments on armors equipped on player.
- `static java.util.Map<java.lang.Integer, java.lang.Integer> getEnchantments(ItemStack stack)`
- `static int getFireAspectModifier(EntityLivingBase player)` — Returns the fire aspect modifier of the players held item.
- `static int getFortuneModifier(EntityLivingBase player)` — Returns the fortune enchantment modifier of the current equipped item of player.
- `static int getKnockbackModifier(EntityLivingBase player)` — Returns the Knockback modifier of the enchantment on the players held item.
- `static int getLootingModifier(EntityLivingBase player)` — Returns the looting enchantment modifier of the current equipped item of player.
- `static int getLuckOfSeaModifier(EntityLivingBase player)` — Returns the level of the 'Luck Of The Sea' enchantment.
- `static int getLureModifier(EntityLivingBase player)` — Returns the level of the 'Lure' enchantment on the players held item.
- `static int getMaxEnchantmentLevel(int enchID, ItemStack [] stacks)` — Returns the biggest level of the enchantment on the array of ItemStack passed.
- `static int getRespiration(Entity player)` — Returns the 'Water Breathing' modifier of enchantments on player equipped armors.
- `static boolean getSilkTouchModifier(EntityLivingBase player)` — Returns the silk touch status of enchantments on current equipped item of player.
- `static java.util.Map<java.lang.Integer, EnchantmentData> mapEnchantmentData(int p_77505_0_, ItemStack p_77505_1_)`
- `static void setEnchantments(java.util.Map<java.lang.Integer, java.lang.Integer> enchMap, ItemStack stack)` — Set the enchantments for the specified stack.
