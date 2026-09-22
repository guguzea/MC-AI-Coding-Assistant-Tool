---
title: "FluidTankProperties"
description: "public class FluidTankProperties extends java.lang.Object implements IFluidTankProperties"
package: "net/minecraftforge/fluids/capability"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/capability/FluidTankProperties.html"
sourceType: javadoc
---

# FluidTankProperties

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.FluidTankProperties

## Class signature

```java
public class FluidTankProperties extends java.lang.Object implements IFluidTankProperties
```

## Constructors

- `FluidTankProperties(FluidStack contents, int capacity)`
- `FluidTankProperties(FluidStack contents, int capacity, boolean canFill, boolean canDrain)`

## Methods

- `boolean canDrain()` — Returns true if the tank can be drained at any time (even if it is currently empty).
- `boolean canDrainFluidType(FluidStack fluidStack)` — Returns true if the tank can drain out this a specific of fluid.
- `boolean canFill()` — Returns true if the tank can be filled at any time (even if it is currently full).
- `boolean canFillFluidType(FluidStack fluidStack)` — Returns true if the tank can be filled with a specific type of fluid.
- `static FluidTankProperties [] convert(FluidTankInfo [] fluidTankInfos)`
- `int getCapacity()`
- `FluidStack getContents()`
