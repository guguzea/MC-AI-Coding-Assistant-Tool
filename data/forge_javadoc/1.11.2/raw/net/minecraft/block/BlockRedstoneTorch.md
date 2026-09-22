---
title: "BlockRedstoneTorch"
description: "public class BlockRedstoneTorch extends BlockTorch"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockRedstoneTorch.html"
sourceType: javadoc
---

# BlockRedstoneTorch

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockTorch → net.minecraft.block.BlockRedstoneTorch

## Class signature

```java
public class BlockRedstoneTorch extends BlockTorch
```

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canProvidePower(IBlockState state)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getStrongPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `int getWeakPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `boolean isAssociatedBlock(Block other)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `int tickRate(World worldIn)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected BlockRedstoneTorch`
