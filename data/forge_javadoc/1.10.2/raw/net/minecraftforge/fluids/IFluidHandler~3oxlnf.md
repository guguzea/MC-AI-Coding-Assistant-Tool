---
title: "IFluidHandler"
description: "public interface IFluidHandler"
package: "net/minecraftforge/fluids"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/IFluidHandler.html"
sourceType: javadoc
---

# IFluidHandler

## Class signature

```java
public interface IFluidHandler
```

## Methods

- `@Deprecated boolean canDrain(EnumFacing from, Fluid fluid)`
- `@Deprecated boolean canFill(EnumFacing from, Fluid fluid)`
- `@Deprecated FluidStack drain(EnumFacing from, FluidStack resource, boolean doDrain)`
- `@Deprecated FluidStack drain(EnumFacing from, int maxDrain, boolean doDrain)`
- `@Deprecated int fill(EnumFacing from, FluidStack resource, boolean doFill)`
- `@Deprecated FluidTankInfo [] getTankInfo(EnumFacing from)`
