# EnchantmentHelper

**Inheritance:** java.lang.Object → net.minecraft.enchantment.EnchantmentHelper

## Class signature

```java
public class EnchantmentHelper extends java.lang.Object
```

## Constructors

- `EnchantmentHelper()`

## Methods

- `static ItemStack addRandomEnchantment(java.util.Random random, ItemStack p_77504_1_, int p_77504_2_, boolean allowTreasure)`
- `static void applyArthropodEnchantments(EntityLivingBase p_151385_0_, Entity p_151385_1_)`
- `static void applyThornEnchantments(EntityLivingBase p_151384_0_, Entity p_151384_1_)`
- `static java.util.List<EnchantmentData> buildEnchantmentList(java.util.Random randomIn, ItemStack itemStackIn, int p_77513_2_, boolean allowTreasure)`
- `static int calcItemStackEnchantability(java.util.Random rand, int enchantNum, int power, ItemStack stack)`
- `static float func_191527_a(EntityLivingBase p_191527_0_)`
- `static int func_191528_c(ItemStack p_191528_0_)`
- `static int func_191529_b(ItemStack p_191529_0_)`
- `static boolean getAquaAffinityModifier(EntityLivingBase p_185287_0_)`
- `static int getDepthStriderModifier(EntityLivingBase p_185294_0_)`
- `static int getEfficiencyModifier(EntityLivingBase p_185293_0_)`
- `static ItemStack getEnchantedItem(Enchantment p_92099_0_, EntityLivingBase p_92099_1_)`
- `static java.util.List<EnchantmentData> getEnchantmentDatas(int p_185291_0_, ItemStack p_185291_1_, boolean allowTreasure)`
- `static int getEnchantmentLevel(Enchantment enchID, ItemStack stack)`
- `static int getEnchantmentModifierDamage(java.lang.Iterable<ItemStack> stacks, DamageSource source)`
- `static java.util.Map<Enchantment, java.lang.Integer> getEnchantments(ItemStack stack)`
- `static int getFireAspectModifier(EntityLivingBase player)`
- `static int getKnockbackModifier(EntityLivingBase player)`
- `static int getLootingModifier(EntityLivingBase p_185283_0_)`
- `static int getMaxEnchantmentLevel(Enchantment p_185284_0_, EntityLivingBase p_185284_1_)`
- `static float getModifierForCreature(ItemStack stack, EnumCreatureAttribute creatureAttribute)`
- `static int getRespirationModifier(EntityLivingBase p_185292_0_)`
- `static boolean hasBindingCurse(ItemStack p_190938_0_)`
- `static boolean hasFrostWalkerEnchantment(EntityLivingBase player)`
- `static boolean hasVanishingCurse(ItemStack p_190939_0_)`
- `static void removeIncompatible(java.util.List<EnchantmentData> p_185282_0_, EnchantmentData p_185282_1_)`
- `static void setEnchantments(java.util.Map<Enchantment, java.lang.Integer> enchMap, ItemStack stack)`