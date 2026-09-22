---
title: "BlockFalling"
description: "public class BlockFalling extends Block"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockFalling.html"
sourceType: javadoc
---

# BlockFalling

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockFalling

## Class signature

```java
public class BlockFalling extends Block
```

## Constructors

- `BlockFalling()`
- `BlockFalling(Material materialIn)`

## Methods

- `static boolean canFallThrough(IBlockState state)`
- `int getDustColor(IBlockState p_189876_1_)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onEndFalling(World worldIn, BlockPos pos)`
- `protected void onStartFalling(EntityFallingBlock fallingEntity)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `int tickRate(World worldIn)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static boolean fallInstantly`
