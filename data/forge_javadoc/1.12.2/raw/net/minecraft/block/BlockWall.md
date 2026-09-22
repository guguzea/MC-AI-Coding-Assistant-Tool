---
title: "BlockWall"
description: "public class BlockWall extends Block"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockWall.html"
sourceType: javadoc
---

# BlockWall

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockWall

## Class signature

```java
public class BlockWall extends Block
```

## Constructors

- `BlockWall(Block modelBlock)`

## Methods

- `void addCollisionBoxToList(IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, Entity entityIn, boolean isActualState)`
- `boolean canBeConnectedTo(IBlockAccess world, BlockPos pos, EnumFacing facing)` — Determines if another block can connect to this block
- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `java.lang.String getLocalizedName()`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(CreativeTabs itemIn, NonNullList<ItemStack> items)`
- `protected static boolean isExcepBlockForAttachWithPiston(Block p_194143_0_)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`

## Fields

- `protected static AxisAlignedBB [] AABB_BY_INDEX`
- `protected static AxisAlignedBB [] CLIP_AABB_BY_INDEX`
- `static PropertyBool EAST`
- `static PropertyBool NORTH`
- `static PropertyBool SOUTH`
- `static PropertyBool UP`
- `static PropertyEnum<BlockWall.EnumType> VARIANT`
- `static PropertyBool WEST`
