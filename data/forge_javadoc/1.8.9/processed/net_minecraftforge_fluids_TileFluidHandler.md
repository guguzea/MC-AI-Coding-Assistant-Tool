# TileFluidHandler

## Class signature

```java
public class TileFluidHandler extends TileEntity implements IFluidHandler
```

## Constructors

- `public TileFluidHandler()`

## Methods

- `public void readFromNBT( NBTTagCompound tag)`
- `public void writeToNBT( NBTTagCompound tag)`
- `public int fill( EnumFacing from, FluidStack resource, boolean doFill)`
- `public FluidStack drain( EnumFacing from, FluidStack resource, boolean doDrain)`
- `public FluidStack drain( EnumFacing from, int maxDrain, boolean doDrain)`
- `public boolean canFill( EnumFacing from, Fluid fluid)`
- `public boolean canDrain( EnumFacing from, Fluid fluid)`
- `public FluidTankInfo [] getTankInfo( EnumFacing from)`

## Description

Reference Tile Entity implementation of IFluidHandler . Use/extend this or write your own.