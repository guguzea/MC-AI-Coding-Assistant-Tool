---
title: "BlockStainedGlass"
description: "public class BlockStainedGlass extends BlockBreakable"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockStainedGlass.html"
sourceType: javadoc
---

# BlockStainedGlass

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBreakable → net.minecraft.block.BlockStainedGlass

## Class signature

```java
public class BlockStainedGlass extends BlockBreakable
```

## Constructors

- `BlockStainedGlass(Material materialIn)`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected boolean canSilkHarvest()`
- `protected BlockState createBlockState()`
- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `EnumWorldBlockLayer getBlockLayer()`
- `MapColor getMapColor(IBlockState state)` — Get the MapColor for this Block and the given BlockState
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)
- `boolean isFullCube()`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.

## Fields

- `static PropertyEnum<EnumDyeColor> COLOR`
