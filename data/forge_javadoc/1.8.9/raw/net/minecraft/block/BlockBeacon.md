---
title: "BlockBeacon"
description: "Returns a new instance of a block's tile entity class."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockBeacon.html"
sourceType: javadoc
---

# BlockBeacon

## Class signature

```java
public class BlockBeacon extends BlockContainer
```

## Constructors

- `public BlockBeacon()`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public int getRenderType()`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public static void updateColorAsync( World worldIn, BlockPos glassPos)`

## Description

Returns a new instance of a block's tile entity class.
