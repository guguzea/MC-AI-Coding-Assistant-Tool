---
title: "BlockStoneSlabNew"
description: "Gets the metadata of the item this Block can drop."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockStoneSlabNew.html"
sourceType: javadoc
---

# BlockStoneSlabNew

## Class signature

```java
public abstract class BlockStoneSlabNew extends BlockSlab
```

## Constructors

- `public BlockStoneSlabNew()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public java.lang.String getUnlocalizedName(int meta)`
- `public IProperty <?> getVariantProperty()`
- `public java.lang.Object getVariant( ItemStack stack)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public MapColor getMapColor( IBlockState state)`
- `public int damageDropped( IBlockState state)`

## Description

Gets the metadata of the item this Block can drop.
