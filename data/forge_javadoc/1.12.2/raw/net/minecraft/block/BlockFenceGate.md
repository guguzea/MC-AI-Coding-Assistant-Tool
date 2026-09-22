---
title: "BlockFenceGate"
description: "public class BlockFenceGate extends BlockHorizontal"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockFenceGate.html"
sourceType: javadoc
---

# BlockFenceGate

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockHorizontal → net.minecraft.block.BlockFenceGate

## Class signature

```java
public class BlockFenceGate extends BlockHorizontal
```

## Constructors

- `BlockFenceGate(BlockPlanks.EnumType p_i46394_1_)`

## Methods

- `boolean canBeConnectedTo(IBlockAccess world, BlockPos pos, EnumFacing facing)` — Determines if another block can connect to this block
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB AABB_COLLISION_BOX_XAXIS`
- `protected static AxisAlignedBB AABB_COLLISION_BOX_ZAXIS`
- `protected static AxisAlignedBB AABB_HITBOX_XAXIS`
- `protected static AxisAlignedBB AABB_HITBOX_XAXIS_INWALL`
- `protected static AxisAlignedBB AABB_HITBOX_ZAXIS`
- `protected static AxisAlignedBB AABB_HITBOX_ZAXIS_INWALL`
- `static PropertyBool IN_WALL`
- `static PropertyBool OPEN`
- `static PropertyBool POWERED`
