---
title: "ItemHoe"
description: "Returns the name of the material this tool is made from as it is declared in EnumToolMaterial (meaning diamond would return \"EMERALD\")"
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemHoe.html"
sourceType: javadoc
---

# ItemHoe

## Class signature

```java
public class ItemHoe extends Item
```

## Constructors

- `public ItemHoe( Item.ToolMaterial material)`

## Methods

- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `protected boolean useHoe( ItemStack stack, EntityPlayer player, World worldIn, BlockPos target, IBlockState newState)`
- `public boolean isFull3D()`
- `public java.lang.String getMaterialName()`

## Description

Returns the name of the material this tool is made from as it is declared in EnumToolMaterial (meaning diamond would return "EMERALD")
