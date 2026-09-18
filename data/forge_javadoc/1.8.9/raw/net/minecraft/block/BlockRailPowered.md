---
title: "BlockRailPowered"
description: "Convert the BlockState into the correct metadata value"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockRailPowered.html"
sourceType: javadoc
---

# BlockRailPowered

## Class signature

```java
public class BlockRailPowered extends BlockRailBase
```

## Constructors

- `protected BlockRailPowered()`

## Methods

- `protected boolean func_176566_a( World worldIn, BlockPos pos, IBlockState state, boolean p_176566_4_, int p_176566_5_)`
- `protected boolean func_176567_a( World worldIn, BlockPos p_176567_2_, boolean p_176567_3_, int distance, BlockRailBase.EnumRailDirection p_176567_5_)`
- `protected void onNeighborChangedInternal( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public IProperty < BlockRailBase.EnumRailDirection > getShapeProperty()`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Convert the BlockState into the correct metadata value
