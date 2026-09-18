---
title: "BlockChorusPlant"
description: "public class BlockChorusPlant extends Block"
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockChorusPlant.html"
sourceType: javadoc
---

# BlockChorusPlant

## Class signature

```java
public class BlockChorusPlant extends Block
```

## Constructors

- `protected BlockChorusPlant()`

## Methods

- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, @Nullable Entity entityIn, boolean p_185477_7_)`
- `public int getMetaFromState( IBlockState state)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public boolean canSurviveAt( World wordIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public BlockRenderLayer getBlockLayer()`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
