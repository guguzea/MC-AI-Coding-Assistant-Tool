# FluidTank

## Class signature

```java
public class FluidTank extends java.lang.Object implements IFluidTank
```

## Constructors

- `public FluidTank(int capacity)`
- `public FluidTank( FluidStack stack, int capacity)`
- `public FluidTank( Fluid fluid, int amount, int capacity)`

## Methods

- `public FluidTank readFromNBT( NBTTagCompound nbt)`
- `public NBTTagCompound writeToNBT( NBTTagCompound nbt)`
- `public void setFluid( FluidStack fluid)`
- `public void setCapacity(int capacity)`
- `public FluidStack getFluid()`
- `public int getFluidAmount()`
- `public int getCapacity()`
- `public FluidTankInfo getInfo()`
- `public int fill( FluidStack resource, boolean doFill)`
- `public FluidStack drain(int maxDrain, boolean doDrain)`

## Description

Reference implementation of IFluidTank . Use/extend this or implement your own.