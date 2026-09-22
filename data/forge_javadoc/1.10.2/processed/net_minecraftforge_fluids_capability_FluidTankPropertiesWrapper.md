# FluidTankPropertiesWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.FluidTankPropertiesWrapper

## Class signature

```java
public class FluidTankPropertiesWrapper extends java.lang.Object implements IFluidTankProperties
```

## Constructors

- `FluidTankPropertiesWrapper(FluidTank tank)`

## Methods

- `boolean canDrain()` — Returns true if the tank can be drained at any time (even if it is currently empty).
- `boolean canDrainFluidType(FluidStack fluidStack)` — Returns true if the tank can drain out this a specific of fluid.
- `boolean canFill()` — Returns true if the tank can be filled at any time (even if it is currently full).
- `boolean canFillFluidType(FluidStack fluidStack)` — Returns true if the tank can be filled with a specific type of fluid.
- `int getCapacity()`
- `FluidStack getContents()`

## Fields

- `protected FluidTank tank`