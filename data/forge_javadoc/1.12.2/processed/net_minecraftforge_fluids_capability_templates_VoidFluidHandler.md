# VoidFluidHandler

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.templates.VoidFluidHandler

## Class signature

```java
public class VoidFluidHandler extends java.lang.Object implements IFluidHandler, IFluidTank
```

## Constructors

- `VoidFluidHandler()`

## Methods

- `FluidStack drain(FluidStack resource, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidStack drain(int maxDrain, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `int fill(FluidStack resource, boolean doFill)` — Fills fluid into internal tanks, distribution is left entirely to the IFluidHandler.
- `int getCapacity()`
- `FluidStack getFluid()`
- `int getFluidAmount()`
- `FluidTankInfo getInfo()` — Returns a wrapper object FluidTankInfo containing the capacity of the tank and the FluidStack it holds.
- `IFluidTankProperties [] getTankProperties()` — Returns an array of objects which represent the internal tanks.

## Fields

- `static EmptyFluidHandler INSTANCE`