---
title: "BlockFenceGate"
description: "public class BlockFenceGate extends BlockHorizontal"
package: "net/minecraft/block"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockFenceGate.html"
sourceType: javadoc
---

# BlockFenceGate

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockHorizontal → net.minecraft.block.BlockFenceGate

## Class signature

```java
public class BlockFenceGate extends BlockHorizontal
```

## Constructors

- `BlockFenceGate(BlockPlanks.EnumType p_i46394_1_)`

## Methods

- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB AABB_CLOSED_SELECTED_XAXIS`
- `protected static AxisAlignedBB AABB_CLOSED_SELECTED_ZAXIS`
- `protected static AxisAlignedBB AABB_COLLIDE_XAXIS`
- `protected static AxisAlignedBB AABB_COLLIDE_XAXIS_INWALL`
- `protected static AxisAlignedBB AABB_COLLIDE_ZAXIS`
- `protected static AxisAlignedBB AABB_COLLIDE_ZAXIS_INWALL`
- `static PropertyBool IN_WALL`
- `static PropertyBool OPEN`
- `static PropertyBool POWERED`
