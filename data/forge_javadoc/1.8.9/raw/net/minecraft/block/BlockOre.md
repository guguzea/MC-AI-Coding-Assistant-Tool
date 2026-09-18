---
title: "BlockOre"
description: "Gets the metadata of the item this Block can drop."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockOre.html"
sourceType: javadoc
---

# BlockOre

## Class signature

```java
public class BlockOre extends Block
```

## Constructors

- `public BlockOre()`
- `public BlockOre( MapColor p_i46390_1_)`

## Methods

- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `public int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public int getExpDrop( IBlockAccess world, BlockPos pos, int fortune)`
- `public int getDamageValue( World worldIn, BlockPos pos)`
- `public int damageDropped( IBlockState state)`

## Description

Gets the metadata of the item this Block can drop.
