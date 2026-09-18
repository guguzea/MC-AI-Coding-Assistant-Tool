---
title: "BlockPistonBase"
description: "public class BlockPistonBase extends BlockDirectional"
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockPistonBase.html"
sourceType: javadoc
---

# BlockPistonBase

## Class signature

```java
public class BlockPistonBase extends BlockDirectional
```

## Constructors

- `public BlockPistonBase(boolean isSticky)`

## Methods

- `public boolean causesSuffocation( IBlockState state)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isFullyOpaque( IBlockState state)`
- `public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, @Nullable Entity entityIn, boolean p_185477_7_)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public boolean eventReceived( IBlockState state, World worldIn, BlockPos pos, int id, int param)`
- `public boolean isFullCube( IBlockState state)`
- `@Nullable public static EnumFacing getFacing(int meta)`
- `public static boolean canPush( IBlockState blockStateIn, World worldIn, BlockPos pos, EnumFacing facing, boolean destroyBlocks)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
