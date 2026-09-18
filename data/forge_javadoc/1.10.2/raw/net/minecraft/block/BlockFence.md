---
title: "BlockFence"
description: "public class BlockFence extends Block"
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockFence.html"
sourceType: javadoc
---

# BlockFence

## Class signature

```java
public class BlockFence extends Block
```

## Constructors

- `public BlockFence( Material p_i46395_1_, MapColor p_i46395_2_)`

## Methods

- `public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, @Nullable Entity entityIn)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean canConnectTo( IBlockAccess worldIn, BlockPos pos)`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, @Nullable ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
