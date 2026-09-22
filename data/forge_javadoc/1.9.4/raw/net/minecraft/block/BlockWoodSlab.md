---
title: "BlockWoodSlab"
description: "public abstract class BlockWoodSlab extends BlockSlab"
package: "net/minecraft/block"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockWoodSlab.html"
sourceType: javadoc
---

# BlockWoodSlab

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockSlab → net.minecraft.block.BlockWoodSlab

## Class signature

```java
public abstract class BlockWoodSlab extends BlockSlab
```

## Constructors

- `BlockWoodSlab()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `MapColor getMapColor(IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)`
- `java.lang.Comparable<?> getTypeForItem(ItemStack stack)`
- `java.lang.String getUnlocalizedName(int meta)`
- `IProperty<?> getVariantProperty()`

## Fields

- `static PropertyEnum<BlockPlanks.EnumType> VARIANT`
