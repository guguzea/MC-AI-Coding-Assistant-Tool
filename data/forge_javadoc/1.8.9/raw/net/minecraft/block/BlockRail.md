---
title: "BlockRail"
description: "Convert the BlockState into the correct metadata value"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockRail.html"
sourceType: javadoc
---

# BlockRail

## Class signature

```java
public class BlockRail extends BlockRailBase
```

## Constructors

- `protected BlockRail()`

## Methods

- `protected void onNeighborChangedInternal( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public IProperty < BlockRailBase.EnumRailDirection > getShapeProperty()`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Convert the BlockState into the correct metadata value
