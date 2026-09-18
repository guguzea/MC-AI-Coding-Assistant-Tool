---
title: "BlockPressurePlate"
description: "Convert the BlockState into the correct metadata value"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockPressurePlate.html"
sourceType: javadoc
---

# BlockPressurePlate

## Class signature

```java
public class BlockPressurePlate extends BlockBasePressurePlate
```

## Constructors

- `protected BlockPressurePlate( Material materialIn, BlockPressurePlate.Sensitivity sensitivityIn)`

## Methods

- `protected int getRedstoneStrength( IBlockState state)`
- `protected IBlockState setRedstoneStrength( IBlockState state, int strength)`
- `protected int computeRedstoneStrength( World worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Convert the BlockState into the correct metadata value
