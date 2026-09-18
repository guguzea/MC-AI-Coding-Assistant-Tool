---
title: "ItemSeeds"
description: "public class ItemSeeds extends Item implements IPlantable"
package: "net/minecraft/item"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/ItemSeeds.html"
sourceType: javadoc
---

# ItemSeeds

## Class signature

```java
public class ItemSeeds extends Item implements IPlantable
```

## Constructors

- `public ItemSeeds( Block crops, Block soil)`

## Methods

- `public EnumActionResult onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public EnumPlantType getPlantType( IBlockAccess world, BlockPos pos)`
- `public IBlockState getPlant( IBlockAccess world, BlockPos pos)`
