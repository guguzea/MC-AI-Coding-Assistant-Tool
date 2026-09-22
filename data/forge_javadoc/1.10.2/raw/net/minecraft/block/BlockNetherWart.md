---
title: "BlockNetherWart"
description: "public class BlockNetherWart extends BlockBush"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockNetherWart.html"
sourceType: javadoc
---

# BlockNetherWart

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockNetherWart

## Class signature

```java
public class BlockNetherWart extends BlockBush
```

## Constructors

- `BlockNetherWart()`

## Methods

- `boolean canBlockStay(World worldIn, BlockPos pos, IBlockState state)`
- `protected boolean canSustainBush(IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `java.util.List<ItemStack> getDrops(IBlockAccess world, BlockPos pos, IBlockState state, int fortune)` — This returns a complete list of items dropped from this block.
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `int quantityDropped(java.util.Random random)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger AGE`
