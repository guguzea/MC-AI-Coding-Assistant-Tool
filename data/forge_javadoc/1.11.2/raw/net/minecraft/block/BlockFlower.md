---
title: "BlockFlower"
description: "public abstract class BlockFlower extends BlockBush"
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockFlower.html"
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

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public int damageDropped( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, NonNullList < ItemStack > list)`
- `public IBlockState getStateFromMeta(int meta)`
- `public abstract BlockFlower.EnumFlowerColor getBlockType()`
- `public IProperty < BlockFlower.EnumFlowerType > getTypeProperty()`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public Block.EnumOffsetType getOffsetType()`
