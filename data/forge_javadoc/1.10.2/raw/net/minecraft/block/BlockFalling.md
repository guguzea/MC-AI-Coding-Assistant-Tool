---
title: "BlockFalling"
description: "public class BlockFalling extends Block"
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockFalling.html"
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
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `protected void onStartFalling( EntityFallingBlock fallingEntity)`
- `public int tickRate( World worldIn)`
- `public static boolean canFallThrough( IBlockState state)`
- `public void onEndFalling( World worldIn, BlockPos pos)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public int getDustColor( IBlockState p_189876_1_)`
