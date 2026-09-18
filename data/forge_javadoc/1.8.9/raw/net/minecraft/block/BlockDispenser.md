---
title: "BlockDispenser"
description: "Returns a new instance of a block's tile entity class."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockDispenser.html"
sourceType: javadoc
---

# BlockDispenser

## Class signature

```java
public class BlockDispenser extends BlockContainer
```

## Constructors

- `protected BlockDispenser()`

## Methods

- `public int tickRate( World worldIn)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `protected void dispense( World worldIn, BlockPos pos)`
- `protected IBehaviorDispenseItem getBehavior( ItemStack stack)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public static IPosition getDispensePosition( IBlockSource coords)`
- `public static EnumFacing getFacing(int meta)`
- `public boolean hasComparatorInputOverride()`
- `public int getComparatorInputOverride( World worldIn, BlockPos pos)`
- `public int getRenderType()`
- `public IBlockState getStateForEntityRender( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Returns a new instance of a block's tile entity class.
