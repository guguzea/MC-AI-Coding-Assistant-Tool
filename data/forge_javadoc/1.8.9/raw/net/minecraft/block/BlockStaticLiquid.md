---
title: "BlockStaticLiquid"
description: "Called when a neighboring block changes."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockStaticLiquid.html"
sourceType: javadoc
---

# BlockStaticLiquid

## Class signature

```java
public class BlockStaticLiquid extends BlockLiquid
```

## Constructors

- `protected BlockStaticLiquid( Material materialIn)`

## Methods

- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `protected boolean isSurroundingBlockFlammable( World worldIn, BlockPos pos)`

## Description

Called when a neighboring block changes.
