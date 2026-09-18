---
title: "BlockRotatedPillar"
description: "Rotate the block."
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockRotatedPillar.html"
sourceType: javadoc
---

# BlockRotatedPillar

## Class signature

```java
public class BlockRotatedPillar extends Block
```

## Constructors

- `protected BlockRotatedPillar( Material materialIn)`
- `protected BlockRotatedPillar( Material materialIn, MapColor color)`

## Methods

- `public boolean rotateBlock( World world, BlockPos pos, EnumFacing axis)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `protected ItemStack getSilkTouchDrop( IBlockState state)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`

## Description

Rotate the block.
