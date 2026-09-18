---
title: "BlockRedstoneOre"
description: "Gathers how much experience this block drops when broken."
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockRedstoneOre.html"
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
- `public void onEntityWalk( World worldIn, BlockPos pos, Entity entityIn)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, @Nullable ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `public int quantityDropped(java.util.Random random)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public int getExpDrop( IBlockState state, IBlockAccess world, BlockPos pos, int fortune)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `protected ItemStack createStackedBlock( IBlockState state)`
- `@Nullable public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`

## Description

Gathers how much experience this block drops when broken.
