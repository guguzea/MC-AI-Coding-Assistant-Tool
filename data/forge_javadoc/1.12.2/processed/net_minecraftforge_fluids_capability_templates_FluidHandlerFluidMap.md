# FluidHandlerFluidMap

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.templates.FluidHandlerFluidMap

## Class signature

```java
public class FluidHandlerFluidMap extends java.lang.Object implements IFluidHandler
```

## Constructors

- `FluidHandlerFluidMap()`
- `FluidHandlerFluidMap(java.util.Map<Fluid, IFluidHandler> handlers)`

## Methods

- `FluidHandlerFluidMap addHandler(Fluid fluid, IFluidHandler handler)`
- `FluidStack drain(FluidStack resource, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidStack drain(int maxDrain, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `int fill(FluidStack resource, boolean doFill)` — Fills fluid into internal tanks, distribution is left entirely to the IFluidHandler.
- `IFluidTankProperties [] getTankProperties()` — Returns an array of objects which represent the internal tanks.

## Fields

- `protected java.util.Map<Fluid, IFluidHandler> handlers`