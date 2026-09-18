---
title: "BlockFlower"
description: "Gets the metadata of the item this Block can drop."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockFlower.html"
sourceType: javadoc
---

# BlockFlower

## Class signature

```java
public abstract class BlockFlower extends BlockBush
```

## Constructors

- `protected BlockFlower()`

## Methods

- `public int damageDropped( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public IBlockState getStateFromMeta(int meta)`
- `public abstract BlockFlower.EnumFlowerColor getBlockType()`
- `public IProperty < BlockFlower.EnumFlowerType > getTypeProperty()`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public Block.EnumOffsetType getOffsetType()`

## Description

Gets the metadata of the item this Block can drop.
