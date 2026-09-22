---
title: "BlockDirt"
description: "public class BlockDirt extends Block"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockDirt.html"
sourceType: javadoc
---

# BlockDirt

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockDirt

## Class signature

```java
public class BlockDirt extends Block
```

## Constructors

- `BlockDirt()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `MapColor getMapColor(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(CreativeTabs itemIn, NonNullList<ItemStack> items)`

## Fields

- `static PropertyBool SNOWY`
- `static PropertyEnum<BlockDirt.DirtType> VARIANT`
