# IFluidTankProperties

## Class signature

```java
public interface IFluidTankProperties
```

## Methods

- `FluidStack getContents()`
- `int getCapacity()`
- `boolean canFill()`
- `boolean canDrain()`
- `boolean canFillFluidType( FluidStack fluidStack)`
- `boolean canDrainFluidType( FluidStack fluidStack)`

## Description

Simplified Read-only Information about the internals of an IFluidHandler . This is useful for displaying information, and as hints for interacting with it. These properties are constant and do not dep