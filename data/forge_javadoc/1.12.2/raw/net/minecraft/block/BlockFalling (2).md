---
title: "BlockFalling"
description: "public class BlockFalling extends Block"
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockFalling.html"
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
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `protected void onStartFalling( EntityFallingBlock fallingEntity)`
- `public int tickRate( World worldIn)`
- `public static boolean canFallThrough( IBlockState state)`
- `public void onEndFalling( World worldIn, BlockPos pos, IBlockState p_176502_3_, IBlockState p_176502_4_)`
- `public void onBroken( World worldIn, BlockPos pos)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public int getDustColor( IBlockState state)`
