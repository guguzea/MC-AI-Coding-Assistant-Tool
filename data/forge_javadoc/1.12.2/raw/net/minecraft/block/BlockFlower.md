---
title: "BlockFlower"
description: "public abstract class BlockFlower extends BlockBush"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockFlower.html"
sourceType: javadoc
---

# BlockFlower

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockFlower

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
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `Block.EnumOffsetType getOffsetType()`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(CreativeTabs itemIn, NonNullList<ItemStack> items)`
- `IProperty<BlockFlower.EnumFlowerType> getTypeProperty()`

## Fields

- `protected PropertyEnum<BlockFlower.EnumFlowerType> type`
