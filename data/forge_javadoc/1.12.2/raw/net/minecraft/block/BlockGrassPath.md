---
title: "BlockGrassPath"
description: "public class BlockGrassPath extends Block"
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockGrassPath.html"
sourceType: javadoc
---

# BlockGrassPath

## Class signature

```java
public class BlockGrassPath extends Block
```

## Constructors

- `protected BlockGrassPath()`

## Methods

- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
