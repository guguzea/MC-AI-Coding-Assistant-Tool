---
title: "BlockOldLeaf"
description: "Gets the metadata of the item this Block can drop."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockOldLeaf.html"
sourceType: javadoc
---

# BlockOldLeaf

## Class signature

```java
public class BlockOldLeaf extends BlockLeaves
```

## Constructors

- `public BlockOldLeaf()`

## Methods

- `public int getRenderColor( IBlockState state)`
- `public int colorMultiplier( IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `protected void dropApple( World worldIn, BlockPos pos, IBlockState state, int chance)`
- `protected int getSaplingDropChance( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `protected ItemStack createStackedBlock( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public BlockPlanks.EnumType getWoodType(int meta)`
- `protected BlockState createBlockState()`
- `public int damageDropped( IBlockState state)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

Gets the metadata of the item this Block can drop.
