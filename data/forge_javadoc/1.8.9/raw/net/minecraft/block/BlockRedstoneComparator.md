---
title: "BlockRedstoneComparator"
description: "Returns a new instance of a block's tile entity class."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockRedstoneComparator.html"
sourceType: javadoc
---

# BlockRedstoneComparator

## Class signature

```java
public class BlockRedstoneComparator extends BlockRedstoneDiode implements ITileEntityProvider
```

## Constructors

- `public BlockRedstoneComparator(boolean powered)`

## Methods

- `public java.lang.String getLocalizedName()`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `protected int getDelay( IBlockState state)`
- `protected IBlockState getPoweredState( IBlockState unpoweredState)`
- `protected IBlockState getUnpoweredState( IBlockState poweredState)`
- `protected boolean isPowered( IBlockState state)`
- `protected int getActiveSignal( IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `protected boolean shouldBePowered( World worldIn, BlockPos pos, IBlockState state)`
- `protected int calculateInputStrength( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `protected void updateState( World worldIn, BlockPos pos, IBlockState state)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean onBlockEventReceived( World worldIn, BlockPos pos, IBlockState state, int eventID, int eventParam)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onNeighborChange( IBlockAccess world, BlockPos pos, BlockPos neighbor)`
- `public boolean getWeakChanges( IBlockAccess world, BlockPos pos)`

## Description

Returns a new instance of a block's tile entity class.
