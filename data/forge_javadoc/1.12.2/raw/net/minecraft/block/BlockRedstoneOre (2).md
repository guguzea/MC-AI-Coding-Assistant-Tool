---
title: "BlockRedstoneOre"
description: "Gathers how much experience this block drops when broken."
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockRedstoneOre.html"
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
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `public int quantityDropped(java.util.Random random)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public int getExpDrop( IBlockState state, IBlockAccess world, BlockPos pos, int fortune)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `protected ItemStack getSilkTouchDrop( IBlockState state)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`

## Description

Gathers how much experience this block drops when broken.
