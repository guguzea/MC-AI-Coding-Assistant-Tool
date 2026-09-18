---
title: "ItemSeedFood"
description: "public class ItemSeedFood extends ItemFood implements IPlantable"
package: "net/minecraft/item"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/ItemSeedFood.html"
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

- `public EnumActionResult onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public EnumPlantType getPlantType( IBlockAccess world, BlockPos pos)`
- `public IBlockState getPlant( IBlockAccess world, BlockPos pos)`
