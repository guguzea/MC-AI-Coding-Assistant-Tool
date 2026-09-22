---
title: "IFluidTankProperties"
description: "public interface IFluidTankProperties"
package: "net/minecraftforge/fluids/capability"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/capability/IFluidTankProperties.html"
sourceType: javadoc
---

# IFluidTankProperties

## Class signature

```java
public interface IFluidTankProperties
```

## Methods

- `boolean canDrain()` — Returns true if the tank can be drained at any time (even if it is currently empty).
- `boolean canDrainFluidType(FluidStack fluidStack)` — Returns true if the tank can drain out this a specific of fluid.
- `boolean canFill()` — Returns true if the tank can be filled at any time (even if it is currently full).
- `boolean canFillFluidType(FluidStack fluidStack)` — Returns true if the tank can be filled with a specific type of fluid.
- `int getCapacity()`
- `FluidStack getContents()`
