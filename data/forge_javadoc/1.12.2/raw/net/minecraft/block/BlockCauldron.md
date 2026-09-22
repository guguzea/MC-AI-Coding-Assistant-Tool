---
title: "BlockCauldron"
description: "public class BlockCauldron extends Block"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockCauldron.html"
sourceType: javadoc
---

# BlockCauldron

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockCauldron

## Class signature

```java
public class BlockCauldron extends Block
```

## Constructors

- `BlockCauldron()`

## Methods

- `void addCollisionBoxToList(IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, Entity entityIn, boolean isActualState)`
- `protected BlockStateContainer createBlockState()`
- `void fillWithRain(World worldIn, BlockPos pos)`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `int getComparatorInputOverride(IBlockState blockState, World worldIn, BlockPos pos)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean hasComparatorInputOverride(IBlockState state)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `void setWaterLevel(World worldIn, BlockPos pos, IBlockState state, int level)`

## Fields

- `protected static AxisAlignedBB AABB_LEGS`
- `protected static AxisAlignedBB AABB_WALL_EAST`
- `protected static AxisAlignedBB AABB_WALL_NORTH`
- `protected static AxisAlignedBB AABB_WALL_SOUTH`
- `protected static AxisAlignedBB AABB_WALL_WEST`
- `static PropertyInteger LEVEL`
