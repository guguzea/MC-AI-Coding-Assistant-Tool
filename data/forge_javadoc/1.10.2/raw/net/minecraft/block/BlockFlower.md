---
title: "BlockFlower"
description: "public abstract class BlockFlower extends BlockBush"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockFlower.html"
sourceType: javadoc
---

# BlockFlower

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockFlower

## Class signature

```java
public abstract class BlockFlower extends BlockBush
```

## Constructors

- `BlockFlower()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `abstract BlockFlower.EnumFlowerColor getBlockType()`
- `int getMetaFromState(IBlockState state)`
- `Block.EnumOffsetType getOffsetType()`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)`
- `IProperty<BlockFlower.EnumFlowerType> getTypeProperty()`

## Fields

- `protected PropertyEnum<BlockFlower.EnumFlowerType> type`
