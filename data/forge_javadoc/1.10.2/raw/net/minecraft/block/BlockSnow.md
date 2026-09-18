---
title: "BlockSnow"
description: "State and fortune sensitive version, this replaces the old (int meta, Random rand) version in 1.1."
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockSnow.html"
sourceType: javadoc
---

# BlockSnow

## Class signature

```java
public class BlockSnow extends Block
```

## Constructors

- `protected BlockSnow()`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isFullyOpaque( IBlockState state)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, World worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, @Nullable ItemStack stack)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public IBlockState getStateFromMeta(int meta)`
- `public boolean isReplaceable( IBlockAccess worldIn, BlockPos pos)`
- `public int getMetaFromState( IBlockState state)`
- `public int quantityDropped( IBlockState state, int fortune, java.util.Random random)`
- `protected BlockStateContainer createBlockState()`

## Description

State and fortune sensitive version, this replaces the old (int meta, Random rand) version in 1.1.
