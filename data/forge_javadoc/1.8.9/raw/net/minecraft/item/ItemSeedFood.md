---
title: "ItemSeedFood"
description: "Called when a Block is right-clicked with this Item"
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemSeedFood.html"
sourceType: javadoc
---

# ItemSeedFood

## Class signature

```java
public class ItemSeedFood extends ItemFood implements IPlantable
```

## Constructors

- `public ItemSeedFood(int healAmount, float saturation, Block crops, Block soil)`

## Methods

- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public EnumPlantType getPlantType( IBlockAccess world, BlockPos pos)`
- `public IBlockState getPlant( IBlockAccess world, BlockPos pos)`

## Description

Called when a Block is right-clicked with this Item
