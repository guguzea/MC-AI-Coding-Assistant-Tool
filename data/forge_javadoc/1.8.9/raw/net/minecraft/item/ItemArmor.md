---
title: "ItemArmor"
description: "Stores the armor type: 0 is helmet, 1 is plate, 2 is legs and 3 is boots"
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemArmor.html"
sourceType: javadoc
---

# ItemArmor

## Class signature

```java
public class ItemArmor extends Item
```

## Constructors

- `public ItemArmor( ItemArmor.ArmorMaterial material, int renderIndex, int armorType)`

## Methods

- `public int getColorFromItemStack( ItemStack stack, int renderPass)`
- `public int getItemEnchantability()`
- `public ItemArmor.ArmorMaterial getArmorMaterial()`
- `public boolean hasColor( ItemStack stack)`
- `public int getColor( ItemStack stack)`
- `public void removeColor( ItemStack stack)`
- `public void setColor( ItemStack stack, int color)`
- `public boolean getIsRepairable( ItemStack toRepair, ItemStack repair)`
- `public ItemStack onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)`

## Description

Stores the armor type: 0 is helmet, 1 is plate, 2 is legs and 3 is boots
