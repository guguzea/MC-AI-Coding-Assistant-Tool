---
title: "BlockRedstoneOre"
description: "Spawns this Block's drops into the World as EntityItems."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockRedstoneOre.html"
sourceType: javadoc
---

# BlockRedstoneOre

## Class signature

```java
public class BlockRedstoneOre extends Block
```

## Constructors

- `public BlockRedstoneOre(boolean isOn)`

## Methods

- `public int tickRate( World worldIn)`
- `public void onBlockClicked( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, Entity entityIn)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `public int quantityDropped(java.util.Random random)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public int getExpDrop( IBlockAccess world, BlockPos pos, int fortune)`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `protected ItemStack createStackedBlock( IBlockState state)`

## Description

Spawns this Block's drops into the World as EntityItems.
