---
title: "BlockRail"
description: "public class BlockRail extends BlockRailBase"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockRail.html"
sourceType: javadoc
---

# BlockRail

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockRailBase → net.minecraft.block.BlockRail

## Class signature

```java
public class BlockRail extends BlockRailBase
```

## Constructors

- `BlockRail()`

## Methods

- `protected BlockState createBlockState()`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IProperty<BlockRailBase.EnumRailDirection> getShapeProperty()`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `protected void onNeighborChangedInternal(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`

## Fields

- `static PropertyEnum<BlockRailBase.EnumRailDirection> SHAPE`
