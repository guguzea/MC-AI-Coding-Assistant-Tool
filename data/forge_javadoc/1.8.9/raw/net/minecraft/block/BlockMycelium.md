---
title: "BlockMycelium"
description: "public class BlockMycelium extends Block"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockMycelium.html"
sourceType: javadoc
---

# BlockMycelium

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockMycelium

## Class signature

```java
public class BlockMycelium extends Block
```

## Constructors

- `BlockMycelium()`

## Methods

- `protected BlockState createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyBool SNOWY`
