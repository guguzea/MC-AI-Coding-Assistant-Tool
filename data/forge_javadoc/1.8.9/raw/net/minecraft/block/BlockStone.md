---
title: "BlockStone"
description: "Gets the metadata of the item this Block can drop."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockStone.html"
sourceType: javadoc
---

# BlockStone

## Class signature

```java
public class BlockStone extends Block
```

## Constructors

- `public BlockStone()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public MapColor getMapColor( IBlockState state)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int damageDropped( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Gets the metadata of the item this Block can drop.
