---
title: "IFluidContainerItem"
description: "Implement this interface on Item classes that support external manipulation of their internal fluid storage. A reference implementation is provided ItemFluidContainer . NOTE: Use of NBT data on the co"
package: "net/minecraftforge/fluids"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fluids/IFluidContainerItem.html"
sourceType: javadoc
---

# IFluidContainerItem

## Class signature

```java
public interface IFluidContainerItem
```

## Methods

- `FluidStack getFluid( ItemStack container)`
- `int getCapacity( ItemStack container)`
- `int fill( ItemStack container, FluidStack resource, boolean doFill)`
- `FluidStack drain( ItemStack container, int maxDrain, boolean doDrain)`

## Description

Implement this interface on Item classes that support external manipulation of their internal fluid storage. A reference implementation is provided ItemFluidContainer . NOTE: Use of NBT data on the co
