# IFluidHandler

## Class signature

```java
public interface IFluidHandler
```

## Methods

- `int fill( EnumFacing from, FluidStack resource, boolean doFill)`
- `FluidStack drain( EnumFacing from, FluidStack resource, boolean doDrain)`
- `FluidStack drain( EnumFacing from, int maxDrain, boolean doDrain)`
- `boolean canFill( EnumFacing from, Fluid fluid)`
- `boolean canDrain( EnumFacing from, Fluid fluid)`
- `FluidTankInfo [] getTankInfo( EnumFacing from)`

## Description

Implement this interface on TileEntities which should handle fluids, generally storing them in one or more internal IFluidTank objects. A reference implementation is provided TileFluidHandler .