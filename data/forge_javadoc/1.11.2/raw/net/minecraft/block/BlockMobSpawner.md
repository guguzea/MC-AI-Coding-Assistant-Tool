---
title: "BlockMobSpawner"
description: "public class BlockMobSpawner extends BlockContainer"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockMobSpawner.html"
sourceType: javadoc
---

# BlockMobSpawner

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockMobSpawner

## Class signature

```java
public class BlockMobSpawner extends BlockContainer
```

## Methods

- `TileEntity createNewTileEntity(World worldIn, int meta)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `BlockRenderLayer getBlockLayer()`
- `int getExpDrop(IBlockState state, IBlockAccess world, BlockPos pos, int fortune)` — Gathers how much experience this block drops when broken.
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `EnumBlockRenderType getRenderType(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `int quantityDropped(java.util.Random random)`

## Fields

- `protected BlockMobSpawner`
