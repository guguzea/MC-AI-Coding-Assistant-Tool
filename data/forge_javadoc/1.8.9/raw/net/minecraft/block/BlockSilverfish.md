---
title: "BlockSilverfish"
description: "Spawns this Block's drops into the World as EntityItems."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockSilverfish.html"
sourceType: javadoc
---

# BlockSilverfish

## Class signature

```java
public class BlockSilverfish extends Block
```

## Constructors

- `public BlockSilverfish()`

## Methods

- `public int quantityDropped(java.util.Random random)`
- `public static boolean canContainSilverfish( IBlockState blockState)`
- `protected ItemStack createStackedBlock( IBlockState state)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public int getDamageValue( World worldIn, BlockPos pos)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Spawns this Block's drops into the World as EntityItems.
