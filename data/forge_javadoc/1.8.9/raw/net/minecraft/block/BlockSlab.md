---
title: "BlockSlab"
description: "Add all collision boxes of this Block to the list that intersect with the given mask."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockSlab.html"
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
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public void setBlockBoundsForItemRender()`
- `public void addCollisionBoxesToList( World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List< AxisAlignedBB > list, Entity collidingEntity)`
- `public boolean isOpaqueCube()`
- `public boolean doesSideBlockRendering( IBlockAccess world, BlockPos pos, EnumFacing face)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public int quantityDropped(java.util.Random random)`
- `public boolean isFullCube()`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `protected static boolean isSlab( Block blockIn)`
- `public abstract java.lang.String getUnlocalizedName(int meta)`
- `public int getDamageValue( World worldIn, BlockPos pos)`
- `public abstract boolean isDouble()`
- `public abstract IProperty <?> getVariantProperty()`
- `public abstract java.lang.Object getVariant( ItemStack stack)`

## Description

Add all collision boxes of this Block to the list that intersect with the given mask.
