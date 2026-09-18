# FluidBlockWrapper

## Class signature

```java
public class FluidBlockWrapper extends java.lang.Object implements IFluidHandler
```

## Constructors

- `public FluidBlockWrapper( IFluidBlock fluidBlock, World world, BlockPos blockPos)`

## Methods

- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `@Nullable public FluidStack drain( FluidStack resource, boolean doDrain)`
- `@Nullable public FluidStack drain(int maxDrain, boolean doDrain)`

## Description

Wrapper to handle IFluidBlock as an IFluidHandler