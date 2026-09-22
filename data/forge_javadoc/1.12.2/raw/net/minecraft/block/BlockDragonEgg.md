---
title: "BlockDragonEgg"
description: "public class BlockDragonEgg extends Block"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockDragonEgg.html"
sourceType: javadoc
---

# BlockDragonEgg

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockDragonEgg

## Class signature

```java
public class BlockDragonEgg extends Block
```

## Constructors

- `BlockDragonEgg()`

## Methods

- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockClicked(World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `int tickRate(World worldIn)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected static AxisAlignedBB DRAGON_EGG_AABB`
