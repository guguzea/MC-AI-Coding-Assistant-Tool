---
title: "BlockGrass"
description: "public class BlockGrass extends Block implements IGrowable"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockGrass.html"
sourceType: javadoc
---

# BlockGrass

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockGrass

## Class signature

```java
public class BlockGrass extends Block implements IGrowable
```

## Constructors

- `BlockGrass()`

## Methods

- `boolean canGrow(World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `boolean canUseBonemeal(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `BlockRenderLayer getBlockLayer()`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `void grow(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyBool SNOWY`
