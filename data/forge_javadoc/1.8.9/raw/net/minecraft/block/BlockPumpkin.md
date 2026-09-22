---
title: "BlockPumpkin"
description: "public class BlockPumpkin extends BlockDirectional"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockPumpkin.html"
sourceType: javadoc
---

# BlockPumpkin

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockDirectional → net.minecraft.block.BlockPumpkin

## Class signature

```java
public class BlockPumpkin extends BlockDirectional
```

## Methods

- `boolean canDispenserPlace(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockState createBlockState()`
- `protected BlockPattern getGolemBasePattern()`
- `protected BlockPattern getGolemPattern()`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `protected BlockPattern getSnowmanBasePattern()`
- `protected BlockPattern getSnowmanPattern()`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate

## Fields

- `protected BlockPumpkin`
