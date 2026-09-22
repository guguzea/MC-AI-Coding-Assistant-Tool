---
title: "BlockFluidClassic"
description: "public class BlockFluidClassic extends BlockFluidBase"
package: "net/minecraftforge/fluids"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/BlockFluidClassic.html"
sourceType: javadoc
---

# BlockFluidClassic

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraftforge.fluids.BlockFluidBase → net.minecraftforge.fluids.BlockFluidClassic

## Class signature

```java
public class BlockFluidClassic extends BlockFluidBase
```

## Constructors

- `BlockFluidClassic(Fluid fluid, Material material)`

## Methods

- `protected int calculateFlowCost(World world, BlockPos pos, int recurseDepth, int side)`
- `boolean canCollideCheck(IBlockState state, boolean fullHit)`
- `boolean canDrain(World world, BlockPos pos)` — Check to see if a block can be drained.
- `protected boolean canFlowInto(IBlockAccess world, BlockPos pos)`
- `FluidStack drain(World world, BlockPos pos, boolean doDrain)` — Attempt to drain the block.
- `protected void flowIntoBlock(World world, BlockPos pos, int meta)`
- `protected int getLargerQuanta(IBlockAccess world, BlockPos pos, int compare)`
- `int getLightValue(IBlockState state, IBlockAccess world, BlockPos pos)` — Get a light value for the block at the specified coordinates, normal ranges are between 0 and 15
- `int getMaxRenderHeightMeta()`
- `protected boolean[] getOptimalFlowDirections(World world, BlockPos pos)`
- `int getQuantaValue(IBlockAccess world, BlockPos pos)`
- `boolean isFlowingVertically(IBlockAccess world, BlockPos pos)`
- `boolean isSourceBlock(IBlockAccess world, BlockPos pos)`
- `int place(World world, BlockPos pos, FluidStack fluidStack, boolean doPlace)` — Attempts to place the block at a given position.
- `BlockFluidClassic setFluidStack(FluidStack stack)`
- `BlockFluidClassic setFluidStackAmount(int amount)`
- `void updateTick(World world, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected int[] flowCost`
- `protected boolean[] isOptimalFlowDirection`
- `protected FluidStack stack`
