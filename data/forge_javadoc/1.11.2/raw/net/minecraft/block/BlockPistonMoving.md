---
title: "BlockPistonMoving"
description: "This returns a complete list of items dropped from this block."
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockPistonMoving.html"
sourceType: javadoc
---

# BlockPistonMoving

## Class signature

```java
public class BlockPistonMoving extends BlockContainer
```

## Constructors

- `public BlockPistonMoving()`

## Methods

- `@Nullable public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public static TileEntity createTilePiston( IBlockState blockStateIn, EnumFacing facingIn, boolean extendingIn, boolean shouldHeadBeRenderedIn)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side)`
- `public void onBlockDestroyedByPlayer( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `@Nullable public RayTraceResult collisionRayTrace( IBlockState blockState, World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, @Nullable Entity entityIn, boolean p_185477_7_)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`

## Description

This returns a complete list of items dropped from this block.
