---
title: "FluidTank"
description: "Reference implementation of IFluidTank . Use/extend this or implement your own."
package: "net/minecraftforge/fluids/capability"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/FluidTank.html"
sourceType: javadoc
---

# FluidTank

## Class signature

```java
public class FluidTank extends java.lang.Object implements IFluidTank , IFluidHandler
```

## Constructors

- `public FluidTank(int capacity)`
- `public FluidTank( FluidStack fluidStack, int capacity)`
- `public FluidTank( Fluid fluid, int amount, int capacity)`

## Methods

- `public FluidTank readFromNBT( NBTTagCompound nbt)`
- `public NBTTagCompound writeToNBT( NBTTagCompound nbt)`
- `public FluidStack getFluid()`
- `public void setFluid( FluidStack fluid)`
- `public int getFluidAmount()`
- `public int getCapacity()`
- `public void setCapacity(int capacity)`
- `public void setTileEntity( TileEntity tile)`
- `public FluidTankInfo getInfo()`
- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `public int fillInternal( FluidStack resource, boolean doFill)`
- `public FluidStack drain( FluidStack resource, boolean doDrain)`
- `public FluidStack drain(int maxDrain, boolean doDrain)`
- `public FluidStack drainInternal( FluidStack resource, boolean doDrain)`
- `public FluidStack drainInternal(int maxDrain, boolean doDrain)`
- `public boolean canFill()`
- `public boolean canDrain()`
- `public void setCanFill(boolean canFill)`
- `public void setCanDrain(boolean canDrain)`
- `public boolean canFillFluidType( FluidStack fluid)`
- `public boolean canDrainFluidType( FluidStack fluid)`
- `protected void onContentsChanged()`

## Description

Reference implementation of IFluidTank . Use/extend this or implement your own.
