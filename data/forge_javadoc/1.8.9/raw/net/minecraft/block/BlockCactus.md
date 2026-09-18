---
title: "BlockCactus"
description: "Convert the BlockState into the correct metadata value"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockCactus.html"
sourceType: javadoc
---

# BlockCactus

## Class signature

```java
public class BlockCactus extends Block implements IPlantable
```

## Constructors

- `protected BlockCactus()`

## Methods

- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public AxisAlignedBB getSelectedBoundingBox( World worldIn, BlockPos pos)`
- `public boolean isFullCube()`
- `public boolean isOpaqueCube()`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public boolean canBlockStay( World worldIn, BlockPos pos)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public IBlockState getStateFromMeta(int meta)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public EnumPlantType getPlantType( IBlockAccess world, BlockPos pos)`
- `public IBlockState getPlant( IBlockAccess world, BlockPos pos)`

## Description

Convert the BlockState into the correct metadata value
