# ItemFluidContainer

## Class signature

```java
public class ItemFluidContainer extends Item implements IFluidContainerItem
```

## Constructors

- `public ItemFluidContainer(int itemID)`
- `public ItemFluidContainer(int itemID, int capacity)`

## Methods

- `public ItemFluidContainer setCapacity(int capacity)`
- `public FluidStack getFluid( ItemStack container)`
- `public int getCapacity( ItemStack container)`
- `public int fill( ItemStack container, FluidStack resource, boolean doFill)`
- `public FluidStack drain( ItemStack container, int maxDrain, boolean doDrain)`

## Description

Reference implementation of IFluidContainerItem . Use/extend this or implement your own.