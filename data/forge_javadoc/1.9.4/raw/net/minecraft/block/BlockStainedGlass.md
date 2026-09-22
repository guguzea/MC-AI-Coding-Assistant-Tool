---
title: "BlockStainedGlass"
description: "public class BlockStainedGlass extends BlockBreakable"
package: "net/minecraft/block"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockStainedGlass.html"
sourceType: javadoc
---

# BlockStainedGlass

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBreakable → net.minecraft.block.BlockStainedGlass

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
- `MapColor getMapColor(IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)`
- `boolean isFullCube(IBlockState state)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `int quantityDropped(java.util.Random random)`

## Fields

- `static PropertyEnum<EnumDyeColor> COLOR`
