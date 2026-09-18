---
title: "BlockDeadBush"
description: "is the block grass, dirt or farmland"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockDeadBush.html"
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

- `public MapColor getMapColor( IBlockState state)`
- `protected boolean canPlaceBlockOn( Block ground)`
- `public boolean isReplaceable( World worldIn, BlockPos pos)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

is the block grass, dirt or farmland
