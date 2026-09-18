---
title: "BlockQuartz"
description: "Rotate the block."
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockQuartz.html"
sourceType: javadoc
---

# BlockQuartz

## Class signature

```java
public class BlockQuartz extends Block
```

## Constructors

- `public BlockQuartz()`

## Methods

- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public int damageDropped( IBlockState state)`
- `protected ItemStack getSilkTouchDrop( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, NonNullList < ItemStack > list)`
- `public MapColor getMapColor( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `protected BlockStateContainer createBlockState()`
- `public boolean rotateBlock( World world, BlockPos pos, EnumFacing axis)`

## Description

Rotate the block.
