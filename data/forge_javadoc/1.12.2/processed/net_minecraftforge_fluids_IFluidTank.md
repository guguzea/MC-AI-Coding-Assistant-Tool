# IFluidTank

## Class signature

```java
public interface IFluidTank
```

## Methods

- `FluidStack getFluid()`
- `int getFluidAmount()`
- `int getCapacity()`
- `FluidTankInfo getInfo()`
- `int fill( FluidStack resource, boolean doFill)`
- `FluidStack drain(int maxDrain, boolean doDrain)`

## Description

A tank is the unit of interaction with Fluid inventories. A reference implementation can be found at FluidTank .