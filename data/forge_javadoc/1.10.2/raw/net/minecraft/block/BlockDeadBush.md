---
title: "BlockDeadBush"
description: "Checks if the object is currently shearable Example: Sheep return false when they have no wool"
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockDeadBush.html"
sourceType: javadoc
---

# BlockDeadBush

## Class signature

```java
public class BlockDeadBush extends BlockBush implements IShearable
```

## Constructors

- `protected BlockDeadBush()`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public MapColor getMapColor( IBlockState state)`
- `protected boolean canSustainBush( IBlockState state)`
- `public boolean isReplaceable( IBlockAccess worldIn, BlockPos pos)`
- `public int quantityDropped(java.util.Random random)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, @Nullable ItemStack stack)`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

Checks if the object is currently shearable Example: Sheep return false when they have no wool
