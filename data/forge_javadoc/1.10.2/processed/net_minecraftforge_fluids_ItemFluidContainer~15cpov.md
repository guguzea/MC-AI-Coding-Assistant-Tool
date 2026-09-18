# ItemFluidContainer

## Constructors

- `public ItemFluidContainer(int itemID)`
- `public ItemFluidContainer(int itemID, int capacity)`

## Methods

- `public ItemFluidContainer setCapacity(int capacity)`
- `public FluidStack getFluid( ItemStack container)`
- `public int getCapacity( ItemStack container)`
- `public int fill( ItemStack container, FluidStack resource, boolean doFill)`
- `public FluidStack drain( ItemStack container, int maxDrain, boolean doDrain)`
- `public ICapabilityProvider initCapabilities( ItemStack stack, NBTTagCompound nbt)`

## Description

Deprecated. See ItemFluidContainer