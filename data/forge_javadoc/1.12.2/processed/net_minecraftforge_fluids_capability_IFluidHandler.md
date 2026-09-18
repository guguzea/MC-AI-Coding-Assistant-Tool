# IFluidHandler

## Class signature

```java
public interface IFluidHandler
```

## Methods

- `IFluidTankProperties [] getTankProperties()`
- `int fill( FluidStack resource, boolean doFill)`
- `FluidStack drain( FluidStack resource, boolean doDrain)`
- `FluidStack drain(int maxDrain, boolean doDrain)`

## Description

Implement this interface as a capability which should handle fluids, generally storing them in one or more internal IFluidTank objects. A reference implementation is provided TileFluidHandler .