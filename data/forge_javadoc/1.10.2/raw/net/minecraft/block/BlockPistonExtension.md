---
title: "BlockPistonExtension"
description: "public class BlockPistonExtension extends BlockDirectional"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockPistonExtension.html"
sourceType: javadoc
---

# BlockPistonExtension

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockDirectional → net.minecraft.block.BlockPistonExtension

## Class signature

```java
public class BlockPistonExtension extends BlockDirectional
```

## Constructors

- `BlockPistonExtension()`

## Methods

- `void addCollisionBoxToList(IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, Entity entityIn)`
- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side)`
- `protected BlockStateContainer createBlockState()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `static EnumFacing getFacing(int meta)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isFullyOpaque(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `int quantityDropped(java.util.Random random)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB DOWN_ARM_AABB`
- `protected static AxisAlignedBB EAST_ARM_AABB`
- `protected static AxisAlignedBB NORTH_ARM_AABB`
- `protected static AxisAlignedBB PISTON_EXTENSION_DOWN_AABB`
- `protected static AxisAlignedBB PISTON_EXTENSION_EAST_AABB`
- `protected static AxisAlignedBB PISTON_EXTENSION_NORTH_AABB`
- `protected static AxisAlignedBB PISTON_EXTENSION_SOUTH_AABB`
- `protected static AxisAlignedBB PISTON_EXTENSION_UP_AABB`
- `protected static AxisAlignedBB PISTON_EXTENSION_WEST_AABB`
- `static PropertyBool SHORT`
- `protected static AxisAlignedBB SOUTH_ARM_AABB`
- `static PropertyEnum<BlockPistonExtension.EnumPistonType> TYPE`
- `protected static AxisAlignedBB UP_ARM_AABB`
- `protected static AxisAlignedBB WEST_ARM_AABB`
