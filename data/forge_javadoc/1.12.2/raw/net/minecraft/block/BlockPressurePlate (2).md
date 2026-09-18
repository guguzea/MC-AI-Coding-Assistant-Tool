---
title: "BlockPressurePlate"
description: "public class BlockPressurePlate extends BlockBasePressurePlate"
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockPressurePlate.html"
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
- `protected void playClickOnSound( World worldIn, BlockPos color)`
- `protected void playClickOffSound( World worldIn, BlockPos pos)`
- `protected int computeRedstoneStrength( World worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
