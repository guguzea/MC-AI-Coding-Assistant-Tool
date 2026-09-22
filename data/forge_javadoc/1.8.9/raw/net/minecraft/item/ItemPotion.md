---
title: "ItemPotion"
description: "public class ItemPotion extends Item"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemPotion.html"
sourceType: javadoc
---

# ItemPotion

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemPotion

## Class signature

```java
public class ItemPotion extends Item
```

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)` — allows items to add custom lines of information to the mouseover description
- `int getColorFromDamage(int meta)`
- `int getColorFromItemStack(ItemStack stack, int renderPass)`
- `java.util.List<PotionEffect> getEffects(int meta)`
- `java.util.List<PotionEffect> getEffects(ItemStack stack)`
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `EnumAction getItemUseAction(ItemStack stack)` — returns the action that specifies what animation to play when the items is being used
- `int getMaxItemUseDuration(ItemStack stack)` — How long it takes to use or consume an item
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)` — returns a list of items with the same ID, but different meta (eg: dye returns 16 items)
- `boolean hasEffect(ItemStack stack)`
- `boolean isEffectInstant(int meta)`
- `static boolean isSplash(int meta)` — returns wether or not a potion is a throwable splash potion based on damage value
- `ItemStack onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)` — Called whenever this item is equipped and the right mouse button is pressed.
- `ItemStack onItemUseFinish(ItemStack stack, World worldIn, EntityPlayer playerIn)` — Called when the player finishes using this Item (E.g. finishes eating.).

## Fields

- `ItemPotion`
