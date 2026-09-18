---
title: "ItemSeedFood"
description: "public class ItemSeedFood extends ItemFood implements IPlantable"
package: "net/minecraft/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/ItemSeedFood.html"
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

- `public EnumActionResult onItemUse( EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public EnumPlantType getPlantType( IBlockAccess world, BlockPos pos)`
- `public IBlockState getPlant( IBlockAccess world, BlockPos pos)`
