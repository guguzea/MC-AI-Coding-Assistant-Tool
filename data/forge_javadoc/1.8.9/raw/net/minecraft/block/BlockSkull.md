---
title: "BlockSkull"
description: "Returns a new instance of a block's tile entity class."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockSkull.html"
sourceType: javadoc
---

# BlockSkull

## Class signature

```java
public class BlockSkull extends BlockContainer
```

## Constructors

- `protected BlockSkull()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public int getDamageValue( World worldIn, BlockPos pos)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public java.util.List< ItemStack > getDrops( IBlockAccess worldIn, BlockPos pos, IBlockState state, int fortune)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean canDispenserPlace( World worldIn, BlockPos pos, ItemStack stack)`
- `public void checkWitherSpawn( World worldIn, BlockPos pos, TileEntitySkull te)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `protected BlockPattern getWitherBasePattern()`
- `protected BlockPattern getWitherPattern()`

## Description

Returns a new instance of a block's tile entity class.
