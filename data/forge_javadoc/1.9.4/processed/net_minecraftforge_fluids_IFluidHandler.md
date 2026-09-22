# IFluidHandler

## Class signature

```java
public interface IFluidHandler
```

## Methods

- `boolean canDrain(EnumFacing from, Fluid fluid)` — Returns true if the given fluid can be extracted from the given direction.
- `boolean canFill(EnumFacing from, Fluid fluid)` — Returns true if the given fluid can be inserted into the given direction.
- `FluidStack drain(EnumFacing from, FluidStack resource, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidStack drain(EnumFacing from, int maxDrain, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `int fill(EnumFacing from, FluidStack resource, boolean doFill)` — Fills fluid into internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidTankInfo [] getTankInfo(EnumFacing from)` — Returns an array of objects which represent the internal tanks.