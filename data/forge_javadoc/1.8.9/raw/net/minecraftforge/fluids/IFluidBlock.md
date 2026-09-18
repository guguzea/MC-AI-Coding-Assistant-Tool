---
title: "IFluidBlock"
description: "Implement this interface on Block classes which represent world-placeable Fluids. NOTE: Using/extending the reference implementations BlockFluidBase is encouraged."
package: "net/minecraftforge/fluids"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fluids/IFluidBlock.html"
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
