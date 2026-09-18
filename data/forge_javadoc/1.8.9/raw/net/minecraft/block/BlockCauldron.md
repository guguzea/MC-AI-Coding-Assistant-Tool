---
title: "BlockCauldron"
description: "Add all collision boxes of this Block to the list that intersect with the given mask."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockCauldron.html"
sourceType: javadoc
---

# BlockCauldron

## Class signature

```java
public class BlockCauldron extends Block
```

## Constructors

- `public BlockCauldron()`

## Methods

- `public void addCollisionBoxesToList( World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List< AxisAlignedBB > list, Entity collidingEntity)`
- `public void setBlockBoundsForItemRender()`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void setWaterLevel( World worldIn, BlockPos pos, IBlockState state, int level)`
- `public void fillWithRain( World worldIn, BlockPos pos)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public boolean hasComparatorInputOverride()`
- `public int getComparatorInputOverride( World worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Add all collision boxes of this Block to the list that intersect with the given mask.
