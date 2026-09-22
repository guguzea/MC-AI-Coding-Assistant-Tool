---
title: "BlockPressurePlate"
description: "public class BlockPressurePlate extends BlockBasePressurePlate"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockPressurePlate.html"
sourceType: javadoc
---

# BlockPressurePlate

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBasePressurePlate → net.minecraft.block.BlockPressurePlate

## Class signature

```java
public class BlockPressurePlate extends BlockBasePressurePlate
```

## Constructors

- `BlockPressurePlate(Material materialIn, BlockPressurePlate.Sensitivity sensitivityIn)`

## Methods

- `protected int computeRedstoneStrength(World worldIn, BlockPos pos)`
- `protected BlockState createBlockState()`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `protected int getRedstoneStrength(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `protected IBlockState setRedstoneStrength(IBlockState state, int strength)`

## Fields

- `static PropertyBool POWERED`
