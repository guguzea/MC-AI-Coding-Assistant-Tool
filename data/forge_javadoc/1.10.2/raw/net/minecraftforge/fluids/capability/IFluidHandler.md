---
title: "IFluidHandler"
description: "public interface IFluidHandler"
package: "net/minecraftforge/fluids/capability"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/capability/IFluidHandler.html"
sourceType: javadoc
---

# IFluidHandler

## Class signature

```java
public interface IFluidHandler
```

## Methods

- `FluidStack drain(FluidStack resource, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidStack drain(int maxDrain, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `int fill(FluidStack resource, boolean doFill)` — Fills fluid into internal tanks, distribution is left entirely to the IFluidHandler.
- `IFluidTankProperties [] getTankProperties()` — Returns an array of objects which represent the internal tanks.
