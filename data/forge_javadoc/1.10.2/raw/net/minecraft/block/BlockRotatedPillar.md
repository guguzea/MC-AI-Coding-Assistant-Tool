---
title: "BlockRotatedPillar"
description: "Rotate the block."
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockRotatedPillar.html"
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
- `protected ItemStack createStackedBlock( IBlockState state)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`

## Description

Rotate the block.
