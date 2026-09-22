---
title: "BlockPressurePlate"
description: "public class BlockPressurePlate extends BlockBasePressurePlate"
package: "net/minecraft/block"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockPressurePlate.html"
sourceType: javadoc
---

# BlockPressurePlate

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBasePressurePlate → net.minecraft.block.BlockPressurePlate

## Class signature

```java
public class BlockPressurePlate extends BlockBasePressurePlate
```

## Constructors

- `BlockPressurePlate(Material materialIn, BlockPressurePlate.Sensitivity sensitivityIn)`

## Methods

- `protected int computeRedstoneStrength(World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `int getMetaFromState(IBlockState state)`
- `protected int getRedstoneStrength(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `protected void playClickOffSound(World worldIn, BlockPos pos)`
- `protected void playClickOnSound(World worldIn, BlockPos color)`
- `protected IBlockState setRedstoneStrength(IBlockState state, int strength)`

## Fields

- `static PropertyBool POWERED`
