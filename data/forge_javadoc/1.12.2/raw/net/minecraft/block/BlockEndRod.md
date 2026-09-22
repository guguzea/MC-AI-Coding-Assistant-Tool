---
title: "BlockEndRod"
description: "public class BlockEndRod extends BlockDirectional"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockEndRod.html"
sourceType: javadoc
---

# BlockEndRod

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockDirectional → net.minecraft.block.BlockEndRod

## Class signature

```java
public class BlockEndRod extends BlockDirectional
```

## Constructors

- `BlockEndRod()`

## Methods

- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `EnumPushReaction getMobilityFlag(IBlockState state)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB END_ROD_EW_AABB`
- `protected static AxisAlignedBB END_ROD_NS_AABB`
- `protected static AxisAlignedBB END_ROD_VERTICAL_AABB`
