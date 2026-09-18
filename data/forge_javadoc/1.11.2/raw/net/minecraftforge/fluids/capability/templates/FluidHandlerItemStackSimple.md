---
title: "FluidHandlerItemStackSimple"
description: "FluidHandlerItemStackSimple is a template capability provider for ItemStacks. Data is stored directly in the vanilla NBT, in the same way as the old ItemFluidContainer. This implementation only allows"
package: "net/minecraftforge/fluids/capability/templates"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/capability/templates/FluidHandlerItemStackSimple.html"
sourceType: javadoc
---

# FluidHandlerItemStackSimple

## Class signature

```java
public class FluidHandlerItemStackSimple extends java.lang.Object implements IFluidHandlerItem , ICapabilityProvider
```

## Constructors

- `public FluidHandlerItemStackSimple(@Nonnull ItemStack container, int capacity)`

## Methods

- `@Nonnull public ItemStack getContainer()`
- `@Nullable public FluidStack getFluid()`
- `protected void setFluid( FluidStack fluid)`
- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `public FluidStack drain( FluidStack resource, boolean doDrain)`
- `public FluidStack drain(int maxDrain, boolean doDrain)`
- `public boolean canFillFluidType( FluidStack fluid)`
- `public boolean canDrainFluidType( FluidStack fluid)`
- `protected void setContainerToEmpty()`
- `public boolean hasCapability(@Nonnull Capability <?> capability, @Nullable EnumFacing facing)`
- `@Nullable public <T> T getCapability(@Nonnull Capability <T> capability, @Nullable EnumFacing facing)`

## Description

FluidHandlerItemStackSimple is a template capability provider for ItemStacks. Data is stored directly in the vanilla NBT, in the same way as the old ItemFluidContainer. This implementation only allows
