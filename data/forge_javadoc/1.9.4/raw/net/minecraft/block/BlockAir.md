---
title: "BlockAir"
description: "public class BlockAir extends Block"
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockAir.html"
sourceType: javadoc
---

# BlockAir

## Class signature

```java
public class BlockAir extends Block
```

## Constructors

- `protected BlockAir()`

## Methods

- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, World worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean canCollideCheck( IBlockState state, boolean hitIfLiquid)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public boolean isReplaceable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isFullCube( IBlockState state)`
