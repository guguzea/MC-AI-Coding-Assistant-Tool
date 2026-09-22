---
title: "BlockTripWireHook"
description: "public class BlockTripWireHook extends Block"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockTripWireHook.html"
sourceType: javadoc
---

# BlockTripWireHook

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockTripWireHook

## Class signature

```java
public class BlockTripWireHook extends Block
```

## Constructors

- `BlockTripWireHook()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `void calculateState(World worldIn, BlockPos pos, IBlockState hookState, boolean p_176260_4_, boolean p_176260_5_, int p_176260_6_, IBlockState p_176260_7_)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side)`
- `boolean canProvidePower(IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState getStateFromMeta(int meta)`
- `int getStrongPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `int getWeakPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyBool ATTACHED`
- `static PropertyDirection FACING`
- `protected static AxisAlignedBB HOOK_EAST_AABB`
- `protected static AxisAlignedBB HOOK_NORTH_AABB`
- `protected static AxisAlignedBB HOOK_SOUTH_AABB`
- `protected static AxisAlignedBB HOOK_WEST_AABB`
- `static PropertyBool POWERED`
