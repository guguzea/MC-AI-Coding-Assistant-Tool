---
title: "BlockFluidFinite"
description: "public class BlockFluidFinite extends BlockFluidBase"
package: "net/minecraftforge/fluids"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/BlockFluidFinite.html"
sourceType: javadoc
---

# BlockFluidFinite

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraftforge.fluids.BlockFluidBase → net.minecraftforge.fluids.BlockFluidFinite

## Class signature

```java
public class BlockFluidFinite extends BlockFluidBase
```

## Methods

- `boolean canCollideCheck(IBlockState state, boolean fullHit)`
- `boolean canDrain(World world, BlockPos pos)` — Check to see if a block can be drained.
- `FluidStack drain(World world, BlockPos pos, boolean doDrain)` — Attempt to drain the block.
- `int getMaxRenderHeightMeta()`
- `int getQuantaValue(IBlockAccess world, BlockPos pos)`
- `int place(World world, BlockPos pos, FluidStack fluidStack, boolean doPlace)` — Attempts to place the block at a given position.
- `int tryToFlowVerticallyInto(World world, BlockPos pos, int amtToInput)`
- `void updateTick(World world, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `BlockFluidFinite`
