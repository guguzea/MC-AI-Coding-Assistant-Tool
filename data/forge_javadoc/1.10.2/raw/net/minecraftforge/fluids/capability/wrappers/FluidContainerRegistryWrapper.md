---
title: "FluidContainerRegistryWrapper"
description: "Deprecated. will be removed along with FluidContainerRegistry"
package: "net/minecraftforge/fluids/capability/wrappers"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/capability/wrappers/FluidContainerRegistryWrapper.html"
sourceType: javadoc
---

# FluidContainerRegistryWrapper

## Constructors

- `public FluidContainerRegistryWrapper( ItemStack container)`

## Methods

- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `@Nullable public FluidStack drain( FluidStack resource, boolean doDrain)`
- `@Nullable public FluidStack drain(int maxDrain, boolean doDrain)`
- `public boolean hasCapability( Capability <?> capability, @Nullable EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, @Nullable EnumFacing facing)`

## Description

Deprecated. will be removed along with FluidContainerRegistry
