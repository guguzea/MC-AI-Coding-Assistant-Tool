---
title: "BlockSlab"
description: "Check if the face of a block should block rendering."
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockSlab.html"
sourceType: javadoc
---

# BlockSlab

## Class signature

```java
public abstract class BlockSlab extends Block
```

## Constructors

- `public BlockSlab( Material materialIn)`
- `public BlockSlab( Material p_i47249_1_, MapColor p_i47249_2_)`

## Methods

- `protected boolean canSilkHarvest()`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isTopSolid( IBlockState state)`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean doesSideBlockRendering( IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing face)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public int quantityDropped(java.util.Random random)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `protected static boolean isHalfSlab( IBlockState state)`
- `public abstract java.lang.String getUnlocalizedName(int meta)`
- `public abstract boolean isDouble()`
- `public abstract IProperty <?> getVariantProperty()`
- `public abstract java.lang.Comparable<?> getTypeForItem( ItemStack stack)`

## Description

Check if the face of a block should block rendering.
