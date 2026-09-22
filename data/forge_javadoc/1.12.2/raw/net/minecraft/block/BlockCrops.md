---
title: "BlockCrops"
description: "public class BlockCrops extends BlockBush implements IGrowable"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockCrops.html"
sourceType: javadoc
---

# BlockCrops

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockCrops

## Class signature

```java
public class BlockCrops extends BlockBush implements IGrowable
```

## Constructors

- `BlockCrops()`

## Methods

- `boolean canBlockStay(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canGrow(World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `protected boolean canSustainBush(IBlockState state)`
- `boolean canUseBonemeal(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `protected int getAge(IBlockState state)`
- `protected PropertyInteger getAgeProperty()`
- `protected int getBonemealAgeIncrease(World worldIn)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `protected Item getCrop()`
- `void getDrops(NonNullList<ItemStack> drops, IBlockAccess world, BlockPos pos, IBlockState state, int fortune)` — This gets a complete list of items dropped from this block.
- `protected static float getGrowthChance(Block blockIn, World worldIn, BlockPos pos)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMaxAge()`
- `int getMetaFromState(IBlockState state)`
- `protected Item getSeed()`
- `IBlockState getStateFromMeta(int meta)`
- `void grow(World worldIn, BlockPos pos, IBlockState state)`
- `void grow(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `boolean isMaxAge(IBlockState state)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `IBlockState withAge(int age)`

## Fields

- `static PropertyInteger AGE`
