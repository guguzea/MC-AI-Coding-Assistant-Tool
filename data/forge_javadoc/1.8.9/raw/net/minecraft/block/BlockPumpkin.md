---
title: "BlockPumpkin"
description: "Convert the BlockState into the correct metadata value"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockPumpkin.html"
sourceType: javadoc
---

# BlockPumpkin

## Class signature

```java
public class BlockPumpkin extends BlockDirectional
```

## Constructors

- `protected BlockPumpkin()`

## Methods

- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canDispenserPlace( World worldIn, BlockPos pos)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `protected BlockPattern getSnowmanBasePattern()`
- `protected BlockPattern getSnowmanPattern()`
- `protected BlockPattern getGolemBasePattern()`
- `protected BlockPattern getGolemPattern()`

## Description

Convert the BlockState into the correct metadata value
