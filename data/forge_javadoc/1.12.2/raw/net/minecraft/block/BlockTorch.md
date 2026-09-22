---
title: "BlockTorch"
description: "public class BlockTorch extends Block"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockTorch.html"
sourceType: javadoc
---

# BlockTorch

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockTorch

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
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
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
