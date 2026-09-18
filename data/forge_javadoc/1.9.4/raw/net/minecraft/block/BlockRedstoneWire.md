---
title: "BlockRedstoneWire"
description: "public class BlockRedstoneWire extends Block"
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockRedstoneWire.html"
sourceType: javadoc
---

# BlockRedstoneWire

## Class signature

```java
public class BlockRedstoneWire extends Block
```

## Constructors

- `public BlockRedstoneWire()`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, World worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int getStrongPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public int getWeakPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `protected static boolean canConnectUpwardsTo( IBlockAccess worldIn, BlockPos pos)`
- `protected static boolean canConnectTo( IBlockState blockState, @Nullable EnumFacing side, IBlockAccess world, BlockPos pos)`
- `public boolean canProvidePower( IBlockState state)`
- `public static int colorMultiplier(int p_176337_0_)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public BlockRenderLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
