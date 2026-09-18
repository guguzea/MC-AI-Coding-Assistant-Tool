---
title: "ItemSkull"
description: "Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks)."
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemSkull.html"
sourceType: javadoc
---

# ItemSkull

## Class signature

```java
public class ItemSkull extends Item
```

## Constructors

- `public ItemSkull()`

## Methods

- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
- `public int getMetadata(int damage)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`
- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public boolean updateItemStackNBT( NBTTagCompound nbt)`

## Description

Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks).
