# FluidHandlerItemStack

## Class signature

```java
public class FluidHandlerItemStack extends java.lang.Object implements IFluidHandler , ICapabilityProvider
```

## Constructors

- `public FluidHandlerItemStack( ItemStack container, int capacity)`

## Methods

- `@Nullable public FluidStack getFluid()`
- `protected void setFluid( FluidStack fluid)`
- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `public FluidStack drain( FluidStack resource, boolean doDrain)`
- `public FluidStack drain(int maxDrain, boolean doDrain)`
- `public boolean canFillFluidType( FluidStack fluid)`
- `public boolean canDrainFluidType( FluidStack fluid)`
- `protected void setContainerToEmpty()`
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`

## Description

FluidHandlerItemStack is a template capability provider for ItemStacks. Data is stored directly in the vanilla NBT, in the same way as the old deprecated ItemFluidContainer . This class allows an item