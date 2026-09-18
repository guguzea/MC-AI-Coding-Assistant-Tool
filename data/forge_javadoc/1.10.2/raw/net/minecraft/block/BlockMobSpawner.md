---
title: "BlockMobSpawner"
description: "Gathers how much experience this block drops when broken."
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockMobSpawner.html"
sourceType: javadoc
---

# BlockMobSpawner

## Class signature

```java
public class BlockMobSpawner extends BlockContainer
```

## Constructors

- `protected BlockMobSpawner()`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public int getExpDrop( IBlockState state, IBlockAccess world, BlockPos pos, int fortune)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `@Nullable public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public BlockRenderLayer getBlockLayer()`

## Description

Gathers how much experience this block drops when broken.
