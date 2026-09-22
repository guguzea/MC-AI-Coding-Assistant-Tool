---
title: "BlockFalling"
description: "public class BlockFalling extends Block"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockFalling.html"
sourceType: javadoc
---

# BlockFalling

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockFalling

## Class signature

```java
public class BlockFalling extends Block
```

## Constructors

- `BlockFalling()`
- `BlockFalling(Material materialIn)`

## Methods

- `static boolean canFallInto(World worldIn, BlockPos pos)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onEndFalling(World worldIn, BlockPos pos)`
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `protected void onStartFalling(EntityFallingBlock fallingEntity)`
- `int tickRate(World worldIn)` — How many world ticks before ticking
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static boolean fallInstantly`
