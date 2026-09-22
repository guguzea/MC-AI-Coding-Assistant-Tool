---
title: "IFluidBlock"
description: "public interface IFluidBlock"
package: "net/minecraftforge/fluids"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/IFluidBlock.html"
sourceType: javadoc
---

# IFluidBlock

## Class signature

```java
public interface IFluidBlock
```

## Methods

- `boolean canDrain(World world, BlockPos pos)` — Check to see if a block can be drained.
- `FluidStack drain(World world, BlockPos pos, boolean doDrain)` — Attempt to drain the block.
- `float getFilledPercentage(World world, BlockPos pos)` — Returns the amount of a single block is filled.
- `Fluid getFluid()` — Returns the Fluid associated with this Block.
- `int place(World world, BlockPos pos, FluidStack fluidStack, boolean doPlace)` — Attempts to place the block at a given position.
