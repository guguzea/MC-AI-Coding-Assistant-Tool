---
title: "BlockBush"
description: "is the block grass, dirt or farmland"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockBush.html"
sourceType: javadoc
---

# BlockBush

## Class signature

```java
public class BlockBush extends Block implements IPlantable
```

## Constructors

- `protected BlockBush()`
- `protected BlockBush( Material materialIn)`
- `protected BlockBush( Material p_i46452_1_, MapColor p_i46452_2_)`

## Methods

- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `protected boolean canPlaceBlockOn( Block ground)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `protected void checkAndDropBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public EnumPlantType getPlantType( IBlockAccess world, BlockPos pos)`
- `public IBlockState getPlant( IBlockAccess world, BlockPos pos)`

## Description

is the block grass, dirt or farmland
