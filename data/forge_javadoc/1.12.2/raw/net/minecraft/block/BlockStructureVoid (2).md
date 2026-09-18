---
title: "BlockStructureVoid"
description: "public class BlockStructureVoid extends Block"
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockStructureVoid.html"
sourceType: javadoc
---

# BlockStructureVoid

## Class signature

```java
public class BlockStructureVoid extends Block
```

## Constructors

- `protected BlockStructureVoid()`

## Methods

- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public float getAmbientOcclusionLightValue( IBlockState state)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public EnumPushReaction getMobilityFlag( IBlockState state)`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
