---
title: "BlockRail"
description: "public class BlockRail extends BlockRailBase"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockRail.html"
sourceType: javadoc
---

# BlockRail

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockRailBase → net.minecraft.block.BlockRail

## Class signature

```java
public class BlockRail extends BlockRailBase
```

## Constructors

- `BlockRail()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `int getMetaFromState(IBlockState state)`
- `IProperty<BlockRailBase.EnumRailDirection> getShapeProperty()`
- `IBlockState getStateFromMeta(int meta)`
- `protected void updateState(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyEnum<BlockRailBase.EnumRailDirection> SHAPE`
