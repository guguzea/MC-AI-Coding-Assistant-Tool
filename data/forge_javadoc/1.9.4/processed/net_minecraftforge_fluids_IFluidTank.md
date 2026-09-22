# IFluidTank

## Class signature

```java
public interface IFluidTank
```

## Methods

- `FluidStack drain(int maxDrain, boolean doDrain)`
- `int fill(FluidStack resource, boolean doFill)`
- `int getCapacity()`
- `FluidStack getFluid()`
- `int getFluidAmount()`
- `FluidTankInfo getInfo()` — Returns a wrapper object FluidTankInfo containing the capacity of the tank and the FluidStack it holds.