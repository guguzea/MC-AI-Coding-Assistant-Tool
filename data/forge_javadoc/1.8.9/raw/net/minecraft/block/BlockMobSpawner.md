---
title: "BlockMobSpawner"
description: "public class BlockMobSpawner extends BlockContainer"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockMobSpawner.html"
sourceType: javadoc
---

# BlockMobSpawner

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockMobSpawner

## Class signature

```java
public class BlockMobSpawner extends BlockContainer
```

## Methods

- `TileEntity createNewTileEntity(World worldIn, int meta)` — Returns a new instance of a block's tile entity class.
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)` — Spawns this Block's drops into the World as EntityItems.
- `EnumWorldBlockLayer getBlockLayer()`
- `int getExpDrop(IBlockAccess world, BlockPos pos, int fortune)` — Gathers how much experience this block drops when broken.
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getRenderType()` — The type of render function called. 3 for standard block models, 2 for TESR's, 1 for liquids, -1 is no render
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.

## Fields

- `protected BlockMobSpawner`
