---
title: "BlockDirt"
description: "Gets the metadata of the item this Block can drop."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockDirt.html"
sourceType: javadoc
---

# BlockDirt

## Class signature

```java
public class BlockDirt extends Block
```

## Constructors

- `protected BlockDirt()`

## Methods

- `public MapColor getMapColor( IBlockState state)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public int getDamageValue( World worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public int damageDropped( IBlockState state)`

## Description

Gets the metadata of the item this Block can drop.
