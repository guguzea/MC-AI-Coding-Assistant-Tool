---
title: "BlockLeaves"
description: "public abstract class BlockLeaves extends Block implements IShearable"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockLeaves.html"
sourceType: javadoc
---

# BlockLeaves

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockLeaves

## Class signature

```java
public abstract class BlockLeaves extends Block implements IShearable
```

## Constructors

- `BlockLeaves()`

## Methods

- `void beginLeavesDecay(IBlockState state, World world, BlockPos pos)` — Called when a leaf should start its decay process.
- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected void dropApple(World worldIn, BlockPos pos, IBlockState state, int chance)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `BlockRenderLayer getBlockLayer()`
- `java.util.List<ItemStack> getDrops(IBlockAccess world, BlockPos pos, IBlockState state, int fortune)` — This returns a complete list of items dropped from this block.
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `protected int getSaplingDropChance(IBlockState state)`
- `abstract BlockPlanks.EnumType getWoodType(int meta)`
- `boolean isLeaves(IBlockState state, IBlockAccess world, BlockPos pos)` — Determines if this block is considered a leaf block, used to apply the leaf decay and generation system.
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isShearable(ItemStack item, IBlockAccess world, BlockPos pos)` — Checks if the object is currently shearable Example: Sheep return false when they have no wool
- `boolean isVisuallyOpaque()`
- `int quantityDropped(java.util.Random random)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `void setGraphicsLevel(boolean fancy)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyBool CHECK_DECAY`
- `static PropertyBool DECAYABLE`
- `protected boolean leavesFancy`
