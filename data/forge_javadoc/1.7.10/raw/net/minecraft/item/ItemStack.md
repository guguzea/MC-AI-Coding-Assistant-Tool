---
title: "ItemStack"
description: "public final class ItemStack extends java.lang.Object"
package: "net/minecraft/item"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/item/ItemStack.html"
sourceType: javadoc
---

# ItemStack

**Inheritance:** java.lang.Object → net.minecraft.item.ItemStack

## Class signature

```java
public final class ItemStack extends java.lang.Object
```

## Constructors

- `ItemStack(Block p_i1876_1_)`
- `ItemStack(Block p_i1877_1_, int p_i1877_2_)`
- `ItemStack(Block p_i1878_1_, int p_i1878_2_, int p_i1878_3_)`
- `ItemStack(Item p_i1879_1_)`
- `ItemStack(Item p_i1880_1_, int p_i1880_2_)`
- `ItemStack(Item p_i1881_1_, int p_i1881_2_, int p_i1881_3_)`

## Methods

- `void addEnchantment(Enchantment p_77966_1_, int p_77966_2_)`
- `static boolean areItemStacksEqual(ItemStack p_77989_0_, ItemStack p_77989_1_)`
- `static boolean areItemStackTagsEqual(ItemStack p_77970_0_, ItemStack p_77970_1_)`
- `boolean attemptDamageItem(int p_96631_1_, java.util.Random p_96631_2_)`
- `boolean canEditBlocks()`
- `ItemStack copy()`
- `static ItemStack copyItemStack(ItemStack p_77944_0_)`
- `void damageItem(int p_77972_1_, EntityLivingBase p_77972_2_)`
- `void func_135074_t()`
- `void func_150996_a(Item p_150996_1_)`
- `float func_150997_a(Block p_150997_1_)`
- `boolean func_150998_b(Block p_150998_1_)`
- `void func_150999_a(World p_150999_1_, Block p_150999_2_, int p_150999_3_, int p_150999_4_, int p_150999_5_, EntityPlayer p_150999_6_)`
- `IChatComponent func_151000_E()`
- `Multimap getAttributeModifiers()`
- `java.lang.String getDisplayName()`
- `NBTTagList getEnchantmentTagList()`
- `boolean getHasSubtypes()`
- `IIcon getIconIndex()`
- `Item getItem()`
- `int getItemDamage()`
- `int getItemDamageForDisplay()`
- `EntityItemFrame getItemFrame()`
- `int getItemSpriteNumber()`
- `EnumAction getItemUseAction()`
- `int getMaxDamage()`
- `int getMaxItemUseDuration()`
- `int getMaxStackSize()`
- `EnumRarity getRarity()`
- `int getRepairCost()`
- `NBTTagCompound getTagCompound()`
- `java.util.List getTooltip(EntityPlayer p_82840_1_, boolean p_82840_2_)`
- `java.lang.String getUnlocalizedName()`
- `boolean hasDisplayName()`
- `boolean hasEffect()`
- `boolean hasTagCompound()`
- `void hitEntity(EntityLivingBase p_77961_1_, EntityPlayer p_77961_2_)`
- `boolean interactWithEntity(EntityPlayer p_111282_1_, EntityLivingBase p_111282_2_)`
- `boolean isItemDamaged()`
- `boolean isItemEnchantable()`
- `boolean isItemEnchanted()`
- `boolean isItemEqual(ItemStack p_77969_1_)`
- `boolean isItemStackDamageable()`
- `boolean isOnItemFrame()`
- `boolean isStackable()`
- `static ItemStack loadItemStackFromNBT(NBTTagCompound p_77949_0_)`
- `void onCrafting(World p_77980_1_, EntityPlayer p_77980_2_, int p_77980_3_)`
- `ItemStack onFoodEaten(World p_77950_1_, EntityPlayer p_77950_2_)`
- `void onPlayerStoppedUsing(World p_77974_1_, EntityPlayer p_77974_2_, int p_77974_3_)`
- `void readFromNBT(NBTTagCompound p_77963_1_)`
- `void setItemDamage(int p_77964_1_)`
- `void setItemFrame(EntityItemFrame p_82842_1_)`
- `void setRepairCost(int p_82841_1_)`
- `ItemStack setStackDisplayName(java.lang.String p_151001_1_)`
- `void setTagCompound(NBTTagCompound p_77982_1_)`
- `void setTagInfo(java.lang.String p_77983_1_, NBTBase p_77983_2_)`
- `ItemStack splitStack(int p_77979_1_)`
- `java.lang.String toString()`
- `boolean tryPlaceItemIntoWorld(EntityPlayer p_77943_1_, World p_77943_2_, int p_77943_3_, int p_77943_4_, int p_77943_5_, int p_77943_6_, float p_77943_7_, float p_77943_8_, float p_77943_9_)`
- `void updateAnimation(World p_77945_1_, Entity p_77945_2_, int p_77945_3_, boolean p_77945_4_)`
- `ItemStack useItemRightClick(World p_77957_1_, EntityPlayer p_77957_2_)`
- `NBTTagCompound writeToNBT(NBTTagCompound p_77955_1_)`

## Fields

- `int animationsToGo`
- `static java.text.DecimalFormat field_111284_a`
- `int stackSize`
- `NBTTagCompound stackTagCompound`
