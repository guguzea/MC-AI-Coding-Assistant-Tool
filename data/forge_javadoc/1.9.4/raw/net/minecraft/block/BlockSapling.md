---
title: "BlockSapling"
description: "public class BlockSapling extends BlockBush implements IGrowable"
package: "net/minecraft/block"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockSapling.html"
sourceType: javadoc
---

# BlockSapling

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockSapling

## Class signature

```java
public class BlockSapling extends BlockBush implements IGrowable
```

## Constructors

- `BlockSapling()`

## Methods

- `boolean canGrow(World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `boolean canUseBonemeal(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `void generateTree(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `java.lang.String getLocalizedName()`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)`
- `void grow(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `void grow(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `boolean isTypeAt(World worldIn, BlockPos pos, BlockPlanks.EnumType type)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected static AxisAlignedBB SAPLING_AABB`
- `static PropertyInteger STAGE`
- `static PropertyEnum<BlockPlanks.EnumType> TYPE`
