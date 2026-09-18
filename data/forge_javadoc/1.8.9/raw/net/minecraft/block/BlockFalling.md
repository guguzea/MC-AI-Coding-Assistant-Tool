---
title: "BlockFalling"
description: "Called when a neighboring block changes."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockFalling.html"
sourceType: javadoc
---

# BlockFalling

## Class signature

```java
public class BlockFalling extends Block
```

## Constructors

- `public BlockFalling()`
- `public BlockFalling( Material materialIn)`

## Methods

- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `protected void onStartFalling( EntityFallingBlock fallingEntity)`
- `public int tickRate( World worldIn)`
- `public static boolean canFallInto( World worldIn, BlockPos pos)`
- `public void onEndFalling( World worldIn, BlockPos pos)`

## Description

Called when a neighboring block changes.
