# IFluidContainerItem

## Class signature

```java
public interface IFluidContainerItem
```

## Methods

- `FluidStack getFluid( ItemStack container)`
- `int getCapacity( ItemStack container)`
- `int fill( ItemStack container, FluidStack resource, boolean doFill)`
- `FluidStack drain( ItemStack container, int maxDrain, boolean doDrain)`

## Description

Implement this interface on Item classes that support external manipulation of their internal fluid storage. A reference implementation is provided ItemFluidContainer . NOTE: Use of NBT data on the co