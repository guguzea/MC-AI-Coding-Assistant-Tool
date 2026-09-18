# FluidContainerItemWrapper

## Constructors

- `public FluidContainerItemWrapper( IFluidContainerItem handler, ItemStack container)`

## Methods

- `public FluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `public FluidStack drain( FluidStack resource, boolean doDrain)`
- `public FluidStack drain(int maxDrain, boolean doDrain)`
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`

## Description

Deprecated. will be removed along with IFluidContainerItem