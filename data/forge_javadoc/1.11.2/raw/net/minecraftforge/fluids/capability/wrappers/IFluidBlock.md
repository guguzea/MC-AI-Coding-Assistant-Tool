---
title: "IFluidBlock"
description: "Implement this interface on Block classes which represent world-placeable Fluids. NOTE: Using/extending the reference implementations BlockFluidBase is encouraged."
package: "net/minecraftforge/fluids/capability/wrappers"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/IFluidBlock.html"
sourceType: javadoc
---

# IFluidBlock

## Class signature

```java
public interface IFluidBlock
```

## Methods

- `Fluid getFluid()`
- `int place( World world, BlockPos pos, @Nonnull FluidStack fluidStack, boolean doPlace)`
- `@Nullable FluidStack drain( World world, BlockPos pos, boolean doDrain)`
- `boolean canDrain( World world, BlockPos pos)`
- `float getFilledPercentage( World world, BlockPos pos)`

## Description

Implement this interface on Block classes which represent world-placeable Fluids. NOTE: Using/extending the reference implementations BlockFluidBase is encouraged.
