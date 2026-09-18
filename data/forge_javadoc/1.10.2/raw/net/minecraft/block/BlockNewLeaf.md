---
title: "BlockNewLeaf"
description: "Performs the shear function on this object."
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockNewLeaf.html"
sourceType: javadoc
---

# BlockNewLeaf

## Class signature

```java
public class BlockNewLeaf extends BlockLeaves
```

## Constructors

- `public BlockNewLeaf()`

## Methods

- `protected void dropApple( World worldIn, BlockPos pos, IBlockState state, int chance)`
- `public int damageDropped( IBlockState state)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `protected ItemStack createStackedBlock( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public BlockPlanks.EnumType getWoodType(int meta)`
- `protected BlockStateContainer createBlockState()`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, @Nullable ItemStack stack)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

Performs the shear function on this object.
