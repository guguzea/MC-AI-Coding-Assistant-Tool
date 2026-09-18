---
title: "BlockMycelium"
description: "Get the actual Block state of this Block at the given position."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockMycelium.html"
sourceType: javadoc
---

# BlockMycelium

## Class signature

```java
public class BlockMycelium extends Block
```

## Constructors

- `protected BlockMycelium()`

## Methods

- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Get the actual Block state of this Block at the given position.
