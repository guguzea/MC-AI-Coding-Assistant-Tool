---
title: "FluidTankProperties"
description: "Basic implementation of IFluidTankProperties ."
package: "net/minecraftforge/fluids/capability"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/capability/FluidTankProperties.html"
sourceType: javadoc
---

# FluidTankProperties

## Class signature

```java
public class FluidTankProperties extends java.lang.Object implements IFluidTankProperties
```

## Constructors

- `public FluidTankProperties( FluidStack contents, int capacity)`
- `public FluidTankProperties( FluidStack contents, int capacity, boolean canFill, boolean canDrain)`

## Methods

- `public static FluidTankProperties [] convert( FluidTankInfo [] fluidTankInfos)`
- `public FluidStack getContents()`
- `public int getCapacity()`
- `public boolean canFill()`
- `public boolean canDrain()`
- `public boolean canFillFluidType( FluidStack fluidStack)`
- `public boolean canDrainFluidType( FluidStack fluidStack)`

## Description

Basic implementation of IFluidTankProperties .
