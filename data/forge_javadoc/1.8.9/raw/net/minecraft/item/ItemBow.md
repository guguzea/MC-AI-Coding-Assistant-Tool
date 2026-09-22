---
title: "ItemBow"
description: "public class ItemBow extends Item"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemBow.html"
sourceType: javadoc
---

# ItemBow

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemBow

## Class signature

```java
public class ItemBow extends Item
```

## Constructors

- `ItemBow()`

## Methods

- `int getItemEnchantability()` — Return the enchantability factor of the item, most of the time is based on material.
- `EnumAction getItemUseAction(ItemStack stack)` — returns the action that specifies what animation to play when the items is being used
- `int getMaxItemUseDuration(ItemStack stack)` — How long it takes to use or consume an item
- `ItemStack onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)` — Called whenever this item is equipped and the right mouse button is pressed.
- `ItemStack onItemUseFinish(ItemStack stack, World worldIn, EntityPlayer playerIn)` — Called when the player finishes using this Item (E.g. finishes eating.).
- `void onPlayerStoppedUsing(ItemStack stack, World worldIn, EntityPlayer playerIn, int timeLeft)` — Called when the player stops using an Item (stops holding the right mouse button).

## Fields

- `static java.lang.String[] bowPullIconNameArray`
