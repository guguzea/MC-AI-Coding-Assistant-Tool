---
title: "BlockRedstoneComparator"
description: "If this block should be notified of weak changes."
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockRedstoneComparator.html"
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
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `protected int getDelay( IBlockState state)`
- `protected IBlockState getPoweredState( IBlockState unpoweredState)`
- `protected IBlockState getUnpoweredState( IBlockState poweredState)`
- `protected boolean isPowered( IBlockState state)`
- `protected int getActiveSignal( IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `protected boolean shouldBePowered( World worldIn, BlockPos pos, IBlockState state)`
- `protected int calculateInputStrength( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `protected void updateState( World worldIn, BlockPos pos, IBlockState state)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean eventReceived( IBlockState state, World worldIn, BlockPos pos, int id, int param)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onNeighborChange( IBlockAccess world, BlockPos pos, BlockPos neighbor)`
- `public boolean getWeakChanges( IBlockAccess world, BlockPos pos)`

## Description

If this block should be notified of weak changes.
