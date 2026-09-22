---
title: "BlockRedstoneTorch"
description: "public class BlockRedstoneTorch extends BlockTorch"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockRedstoneTorch.html"
sourceType: javadoc
---

# BlockRedstoneTorch

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockTorch → net.minecraft.block.BlockRedstoneTorch

## Class signature

```java
public class BlockRedstoneTorch extends BlockTorch
```

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canProvidePower()` — Can this block provide power.
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getStrongPower(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `int getWeakPower(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `boolean isAssociatedBlock(Block other)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)` — Called randomly when setTickRandomly is set to true (used by e.g. crops to grow, etc.)
- `int tickRate(World worldIn)` — How many world ticks before ticking
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected BlockRedstoneTorch`
