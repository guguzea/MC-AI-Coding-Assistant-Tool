---
title: "BlockPortal"
description: "public class BlockPortal extends BlockBreakable"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockPortal.html"
sourceType: javadoc
---

# BlockPortal

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBreakable → net.minecraft.block.BlockPortal

## Class signature

```java
public class BlockPortal extends BlockBreakable
```

## Constructors

- `BlockPortal()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `BlockPattern.PatternHelper createPatternHelper(World worldIn, BlockPos p_181089_2_)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `static int getMetaForAxis(EnumFacing.Axis axis)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `int quantityDropped(java.util.Random random)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `boolean trySpawnPortal(World worldIn, BlockPos pos)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyEnum<EnumFacing.Axis> AXIS`
- `protected static AxisAlignedBB X_AABB`
- `protected static AxisAlignedBB Y_AABB`
- `protected static AxisAlignedBB Z_AABB`
