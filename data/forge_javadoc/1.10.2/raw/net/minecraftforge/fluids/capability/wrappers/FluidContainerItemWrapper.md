---
title: "FluidContainerItemWrapper"
description: "public class FluidContainerItemWrapper extends java.lang.Object implements IFluidHandler, ICapabilityProvider"
package: "net/minecraftforge/fluids/capability/wrappers"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/capability/wrappers/FluidContainerItemWrapper.html"
sourceType: javadoc
---

# FluidContainerItemWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.wrappers.FluidContainerItemWrapper

## Class signature

```java
public class FluidContainerItemWrapper extends java.lang.Object implements IFluidHandler, ICapabilityProvider
```

## Constructors

- `@Deprecated FluidContainerItemWrapper(IFluidContainerItem handler, ItemStack container)`

## Methods

- `@Deprecated FluidStack drain(FluidStack resource, boolean doDrain)`
- `@Deprecated FluidStack drain(int maxDrain, boolean doDrain)`
- `@Deprecated int fill(FluidStack resource, boolean doFill)`
- `@Deprecated <T> T getCapability(Capability<T> capability, EnumFacing facing)`
- `@Deprecated FluidTankProperties [] getTankProperties()`
- `@Deprecated boolean hasCapability(Capability<?> capability, EnumFacing facing)`

## Fields

- `protected ItemStack container`
- `protected IFluidContainerItem handler`
