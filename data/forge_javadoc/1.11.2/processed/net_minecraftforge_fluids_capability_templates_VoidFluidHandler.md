# VoidFluidHandler

## Class signature

```java
public class VoidFluidHandler extends java.lang.Object implements IFluidHandler , IFluidTank
```

## Constructors

- `public VoidFluidHandler()`

## Methods

- `public IFluidTankProperties [] getTankProperties()`
- `@Nullable public FluidStack getFluid()`
- `public int getFluidAmount()`
- `public int getCapacity()`
- `public FluidTankInfo getInfo()`
- `public int fill( FluidStack resource, boolean doFill)`
- `public FluidStack drain( FluidStack resource, boolean doDrain)`
- `public FluidStack drain(int maxDrain, boolean doDrain)`

## Description

VoidFluidHandler is a template fluid handler that can be filled indefinitely without ever getting full. It does not store fluid that gets filled into it, but "destroys" it upon receiving it.