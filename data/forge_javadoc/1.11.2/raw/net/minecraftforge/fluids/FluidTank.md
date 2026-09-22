---
title: "FluidTank"
description: "public class FluidTank extends java.lang.Object implements IFluidTank, IFluidHandler"
package: "net/minecraftforge/fluids"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/FluidTank.html"
sourceType: javadoc
---

# FluidTank

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.FluidTank

## Class signature

```java
public class FluidTank extends java.lang.Object implements IFluidTank, IFluidHandler
```

## Constructors

- `FluidTank(Fluid fluid, int amount, int capacity)`
- `FluidTank(FluidStack fluidStack, int capacity)`
- `FluidTank(int capacity)`

## Methods

- `boolean canDrain()` — Whether this tank can be drained with IFluidHandler
- `boolean canDrainFluidType(FluidStack fluid)` — Returns true if the tank can drain out this type of fluid.
- `boolean canFill()` — Whether this tank can be filled with IFluidHandler
- `boolean canFillFluidType(FluidStack fluid)` — Returns true if the tank can be filled with this type of fluid.
- `FluidStack drain(FluidStack resource, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidStack drain(int maxDrain, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidStack drainInternal(FluidStack resource, boolean doDrain)` — Use this method to bypass the restrictions from canDrainFluidType(FluidStack) Meant for use by the owner of the tank when they have canDrain() set to false}.
- `FluidStack drainInternal(int maxDrain, boolean doDrain)` — Use this method to bypass the restrictions from canDrainFluidType(FluidStack) Meant for use by the owner of the tank when they have canDrain() set to false}.
- `int fill(FluidStack resource, boolean doFill)` — Fills fluid into internal tanks, distribution is left entirely to the IFluidHandler.
- `int fillInternal(FluidStack resource, boolean doFill)` — Use this method to bypass the restrictions from canFillFluidType(FluidStack) Meant for use by the owner of the tank when they have set to false .
- `int getCapacity()`
- `FluidStack getFluid()`
- `int getFluidAmount()`
- `FluidTankInfo getInfo()` — Returns a wrapper object FluidTankInfo containing the capacity of the tank and the FluidStack it holds.
- `IFluidTankProperties [] getTankProperties()` — Returns an array of objects which represent the internal tanks.
- `protected void onContentsChanged()`
- `FluidTank readFromNBT(NBTTagCompound nbt)`
- `void setCanDrain(boolean canDrain)` — Set whether this tank can be drained with IFluidHandler
- `void setCanFill(boolean canFill)` — Set whether this tank can be filled with IFluidHandler
- `void setCapacity(int capacity)`
- `void setFluid(FluidStack fluid)`
- `void setTileEntity(TileEntity tile)`
- `NBTTagCompound writeToNBT(NBTTagCompound nbt)`

## Fields

- `protected boolean canDrain`
- `protected boolean canFill`
- `protected int capacity`
- `protected FluidStack fluid`
- `protected IFluidTankProperties [] tankProperties`
- `protected TileEntity tile`
