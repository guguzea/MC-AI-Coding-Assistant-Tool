---
title: "BlockFence"
description: "public class BlockFence extends Block"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockFence.html"
sourceType: javadoc
---

# BlockFence

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockFence

## Class signature

```java
public class BlockFence extends Block
```

## Constructors

- `BlockFence(Material p_i46395_1_, MapColor p_i46395_2_)`

## Methods

- `void addCollisionBoxToList(IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, Entity entityIn, boolean p_185477_7_)`
- `boolean canBeConnectedTo(IBlockAccess world, BlockPos pos, EnumFacing facing)` — Determines if another block can connect to this block
- `boolean canConnectTo(IBlockAccess worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB [] BOUNDING_BOXES`
- `static PropertyBool EAST`
- `static AxisAlignedBB EAST_AABB`
- `static PropertyBool NORTH`
- `static AxisAlignedBB NORTH_AABB`
- `static AxisAlignedBB PILLAR_AABB`
- `static PropertyBool SOUTH`
- `static AxisAlignedBB SOUTH_AABB`
- `static PropertyBool WEST`
- `static AxisAlignedBB WEST_AABB`
