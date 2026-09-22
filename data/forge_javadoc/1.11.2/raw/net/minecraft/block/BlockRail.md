---
title: "BlockRail"
description: "public class BlockRail extends BlockRailBase"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockRail.html"
sourceType: javadoc
---

# BlockRail

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockRailBase → net.minecraft.block.BlockRail

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
- `protected void updateState(IBlockState p_189541_1_, World p_189541_2_, BlockPos p_189541_3_, Block p_189541_4_)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyEnum<BlockRailBase.EnumRailDirection> SHAPE`
