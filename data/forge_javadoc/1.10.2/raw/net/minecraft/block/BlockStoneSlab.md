---
title: "BlockStoneSlab"
description: "public abstract class BlockStoneSlab extends BlockSlab"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockStoneSlab.html"
sourceType: javadoc
---

# BlockStoneSlab

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockSlab → net.minecraft.block.BlockStoneSlab

## Class signature

```java
public abstract class BlockStoneSlab extends BlockSlab
```

## Constructors

- `BlockStoneSlab()`

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

- `static PropertyBool SEAMLESS`
- `static PropertyEnum<BlockStoneSlab.EnumType> VARIANT`
