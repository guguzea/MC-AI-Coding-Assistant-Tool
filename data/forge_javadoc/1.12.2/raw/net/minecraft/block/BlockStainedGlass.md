---
title: "BlockStainedGlass"
description: "public class BlockStainedGlass extends BlockBreakable"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockStainedGlass.html"
sourceType: javadoc
---

# BlockStainedGlass

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBreakable → net.minecraft.block.BlockStainedGlass

## Class signature

```java
public class BlockStainedGlass extends BlockBreakable
```

## Constructors

- `BlockStainedGlass(Material materialIn)`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected boolean canSilkHarvest()`
- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `BlockRenderLayer getBlockLayer()`
- `MapColor getMapColor(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(CreativeTabs itemIn, NonNullList<ItemStack> items)`
- `boolean isFullCube(IBlockState state)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `int quantityDropped(java.util.Random random)`

## Fields

- `static PropertyEnum<EnumDyeColor> COLOR`
