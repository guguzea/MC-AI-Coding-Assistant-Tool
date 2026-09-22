---
title: "ItemSword"
description: "public class ItemSword extends Item"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemSword.html"
sourceType: javadoc
---

# ItemSword

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemSword

## Class signature

```java
public class ItemSword extends Item
```

## Methods

- `boolean canHarvestBlock(Block blockIn)` — Check whether this Item can harvest the given Block
- `float getDamageVsEntity()` — Returns the amount of damage this item will deal.
- `boolean getIsRepairable(ItemStack toRepair, ItemStack repair)` — Return whether this item is repairable in an anvil.
- `<any> getItemAttributeModifiers()`
- `int getItemEnchantability()` — Return the enchantability factor of the item, most of the time is based on material.
- `EnumAction getItemUseAction(ItemStack stack)` — returns the action that specifies what animation to play when the items is being used
- `int getMaxItemUseDuration(ItemStack stack)` — How long it takes to use or consume an item
- `float getStrVsBlock(ItemStack stack, Block block)`
- `java.lang.String getToolMaterialName()` — Return the name for this tool's material.
- `boolean hitEntity(ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)` — Current implementations of this method in child classes do not use the entry argument beside ev.
- `boolean isFull3D()` — Returns True is the item is renderer in full 3D when hold.
- `boolean onBlockDestroyed(ItemStack stack, World worldIn, Block blockIn, BlockPos pos, EntityLivingBase playerIn)` — Called when a Block is destroyed using this Item.
- `ItemStack onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)` — Called whenever this item is equipped and the right mouse button is pressed.

## Fields

- `ItemSword`
