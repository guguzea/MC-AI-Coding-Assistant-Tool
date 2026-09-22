---
title: "BlockCactus"
description: "public class BlockCactus extends Block implements IPlantable"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockCactus.html"
sourceType: javadoc
---

# BlockCactus

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockCactus

## Class signature

```java
public class BlockCactus extends Block implements IPlantable
```

## Constructors

- `BlockCactus()`

## Methods

- `boolean canBlockStay(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getPlant(IBlockAccess world, BlockPos pos)`
- `EnumPlantType getPlantType(IBlockAccess world, BlockPos pos)`
- `AxisAlignedBB getSelectedBoundingBox(IBlockState state, World worldIn, BlockPos pos)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger AGE`
- `protected static AxisAlignedBB CACTUS_AABB`
- `protected static AxisAlignedBB CACTUS_COLLISION_AABB`
