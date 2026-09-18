---
title: "BlockRedstoneLight"
description: "Get the Item that this Block should drop when harvested."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockRedstoneLight.html"
sourceType: javadoc
---

# BlockRedstoneLight

## Class signature

```java
public class BlockRedstoneLight extends Block
```

## Constructors

- `public BlockRedstoneLight(boolean isOn)`

## Methods

- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `protected ItemStack createStackedBlock( IBlockState state)`

## Description

Get the Item that this Block should drop when harvested.
