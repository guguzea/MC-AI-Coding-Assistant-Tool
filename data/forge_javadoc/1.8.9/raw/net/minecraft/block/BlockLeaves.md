---
title: "BlockLeaves"
description: "public abstract class BlockLeaves extends BlockLeavesBase implements IShearable"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockLeaves.html"
sourceType: javadoc
---

# BlockLeaves

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockLeavesBase → net.minecraft.block.BlockLeaves

## Class signature

```java
public abstract class BlockLeaves extends BlockLeavesBase implements IShearable
```

## Constructors

- `BlockLeaves()`

## Methods

- `void beginLeavesDecay(World world, BlockPos pos)` — Called when a leaf should start its decay process.
- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `int colorMultiplier(IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `protected void dropApple(World worldIn, BlockPos pos, IBlockState state, int chance)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)` — Spawns this Block's drops into the World as EntityItems.
- `int getBlockColor()`
- `EnumWorldBlockLayer getBlockLayer()`
- `java.util.List<ItemStack> getDrops(IBlockAccess world, BlockPos pos, IBlockState state, int fortune)` — This returns a complete list of items dropped from this block.
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getRenderColor(IBlockState state)`
- `protected int getSaplingDropChance(IBlockState state)`
- `abstract BlockPlanks.EnumType getWoodType(int meta)`
- `boolean isLeaves(IBlockAccess world, BlockPos pos)` — Determines if this block is considered a leaf block, used to apply the leaf decay and generation system.
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean isShearable(ItemStack item, IBlockAccess world, BlockPos pos)` — Checks if the object is currently shearable Example: Sheep return false when they have no wool
- `boolean isVisuallyOpaque()`
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `void setGraphicsLevel(boolean fancy)` — Pass true to draw this block using fancy graphics, or false for fast graphics.
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyBool CHECK_DECAY`
- `static PropertyBool DECAYABLE`
- `protected int iconIndex`
- `protected boolean isTransparent`
