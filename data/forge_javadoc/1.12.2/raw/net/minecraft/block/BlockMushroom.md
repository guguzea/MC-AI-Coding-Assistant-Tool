---
title: "BlockMushroom"
description: "public class BlockMushroom extends BlockBush implements IGrowable"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockMushroom.html"
sourceType: javadoc
---

# BlockMushroom

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockMushroom

## Class signature

```java
public class BlockMushroom extends BlockBush implements IGrowable
```

## Constructors

- `BlockMushroom()`

## Methods

- `boolean canBlockStay(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canGrow(World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected boolean canSustainBush(IBlockState state)`
- `boolean canUseBonemeal(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `boolean generateBigMushroom(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `void grow(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected static AxisAlignedBB MUSHROOM_AABB`
