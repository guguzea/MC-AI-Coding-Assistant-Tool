---
title: "IFluidBlock"
description: "Implement this interface on Block classes which represent world-placeable Fluids. NOTE: Using/extending the reference implementations BlockFluidBase is encouraged."
package: "net/minecraftforge/fluids"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fluids/IFluidBlock.html"
sourceType: javadoc
---

# IFluidBlock

## Class signature

```java
public interface IFluidBlock
```

## Methods

- `Fluid getFluid()`
- `FluidStack drain( World world, BlockPos pos, boolean doDrain)`
- `boolean canDrain( World world, BlockPos pos)`
- `float getFilledPercentage( World world, BlockPos pos)`

## Description

Implement this interface on Block classes which represent world-placeable Fluids. NOTE: Using/extending the reference implementations BlockFluidBase is encouraged.
