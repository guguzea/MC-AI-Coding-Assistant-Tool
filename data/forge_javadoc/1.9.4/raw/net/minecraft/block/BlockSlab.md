---
title: "BlockSlab"
description: "Check if the face of a block should block rendering."
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockSlab.html"
sourceType: javadoc
---

# BlockSlab

## Class signature

```java
public abstract class BlockSlab extends Block
```

## Constructors

- `public BlockSlab( Material materialIn)`

## Methods

- `protected boolean canSilkHarvest()`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isFullyOpaque( IBlockState state)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean doesSideBlockRendering( IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing face)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
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
