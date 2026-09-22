---
title: "BlockTorch"
description: "public class BlockTorch extends Block"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockTorch.html"
sourceType: javadoc
---

# BlockTorch

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockTorch

## Class signature

```java
public class BlockTorch extends Block
```

## Constructors

- `BlockTorch()`

## Methods

- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected boolean checkForDrop(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `protected boolean onNeighborChangeInternal(World worldIn, BlockPos pos, IBlockState state)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyDirection FACING`
- `protected static AxisAlignedBB STANDING_AABB`
- `protected static AxisAlignedBB TORCH_EAST_AABB`
- `protected static AxisAlignedBB TORCH_NORTH_AABB`
- `protected static AxisAlignedBB TORCH_SOUTH_AABB`
- `protected static AxisAlignedBB TORCH_WEST_AABB`
