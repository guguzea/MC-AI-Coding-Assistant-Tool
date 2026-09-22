---
title: "FluidHandlerWrapper"
description: "public class FluidHandlerWrapper extends java.lang.Object implements IFluidHandler"
package: "net/minecraftforge/fluids/capability/wrappers"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/capability/wrappers/FluidHandlerWrapper.html"
sourceType: javadoc
---

# FluidHandlerWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.wrappers.FluidHandlerWrapper

## Class signature

```java
public class FluidHandlerWrapper extends java.lang.Object implements IFluidHandler
```

## Constructors

- `@Deprecated FluidHandlerWrapper(IFluidHandler handler, EnumFacing side)`

## Methods

- `@Deprecated FluidStack drain(FluidStack resource, boolean doDrain)`
- `@Deprecated FluidStack drain(int maxDrain, boolean doDrain)`
- `@Deprecated int fill(FluidStack resource, boolean doFill)`
- `@Deprecated IFluidTankProperties [] getTankProperties()`

## Fields

- `protected IFluidHandler handler`
- `protected EnumFacing side`
