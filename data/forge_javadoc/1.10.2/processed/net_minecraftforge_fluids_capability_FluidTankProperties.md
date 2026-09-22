# FluidTankProperties

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.FluidTankProperties

## Class signature

```java
public class FluidTankProperties extends java.lang.Object implements IFluidTankProperties
```

## Constructors

- `FluidTankProperties(FluidStack contents, int capacity)`
- `FluidTankProperties(FluidStack contents, int capacity, boolean canFill, boolean canDrain)`

## Methods

- `boolean canDrain()` — Returns true if the tank can be drained at any time (even if it is currently empty).
- `boolean canDrainFluidType(FluidStack fluidStack)` — Returns true if the tank can drain out this a specific of fluid.
- `boolean canFill()` — Returns true if the tank can be filled at any time (even if it is currently full).
- `boolean canFillFluidType(FluidStack fluidStack)` — Returns true if the tank can be filled with a specific type of fluid.
- `static FluidTankProperties [] convert(FluidTankInfo [] fluidTankInfos)`
- `int getCapacity()`
- `FluidStack getContents()`