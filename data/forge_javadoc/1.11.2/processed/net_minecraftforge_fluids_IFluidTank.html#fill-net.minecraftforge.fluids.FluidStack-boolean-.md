# IFluidTank.html#fill-net.minecraftforge.fluids.FluidStack-boolean-

## Class signature

```java
public interface IFluidTank
```

## Methods

- `@Nullable FluidStack getFluid()`
- `int getFluidAmount()`
- `int getCapacity()`
- `FluidTankInfo getInfo()`
- `int fill( FluidStack resource, boolean doFill)`
- `@Nullable FluidStack drain(int maxDrain, boolean doDrain)`

## Description

A tank is the unit of interaction with Fluid inventories. A reference implementation can be found at FluidTank .