---
title: "BlockOldLeaf"
description: "Performs the shear function on this object."
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockOldLeaf.html"
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

- `protected void dropApple( World worldIn, BlockPos pos, IBlockState state, int chance)`
- `protected int getSaplingDropChance( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, NonNullList < ItemStack > list)`
- `protected ItemStack getSilkTouchDrop( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public BlockPlanks.EnumType getWoodType(int meta)`
- `protected BlockStateContainer createBlockState()`
- `public int damageDropped( IBlockState state)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, ItemStack stack)`
- `public NonNullList < ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

Performs the shear function on this object.
