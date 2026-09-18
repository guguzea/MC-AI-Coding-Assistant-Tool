# FluidContainerRegistry

## Class signature

```java
public abstract class FluidContainerRegistry extends java.lang.Object
```

## Methods

- `public static boolean registerFluidContainer( FluidStack stack, ItemStack filledContainer, ItemStack emptyContainer)`
- `public static boolean registerFluidContainer( Fluid fluid, ItemStack filledContainer, ItemStack emptyContainer)`
- `public static boolean registerFluidContainer( FluidStack stack, ItemStack filledContainer)`
- `public static boolean registerFluidContainer( Fluid fluid, ItemStack filledContainer)`
- `public static boolean registerFluidContainer( FluidContainerRegistry.FluidContainerData data)`
- `public static FluidStack getFluidForFilledItem( ItemStack container)`
- `public static ItemStack fillFluidContainer( FluidStack fluid, ItemStack container)`
- `public static ItemStack drainFluidContainer( ItemStack container)`
- `public static int getContainerCapacity( ItemStack container)`
- `public static int getContainerCapacity( FluidStack fluid, ItemStack container)`
- `public static boolean containsFluid( ItemStack container, FluidStack fluid)`
- `public static boolean isBucket( ItemStack container)`
- `public static boolean isContainer( ItemStack container)`
- `public static boolean isEmptyContainer( ItemStack container)`
- `public static boolean isFilledContainer( ItemStack container)`
- `public static FluidContainerRegistry.FluidContainerData [] getRegisteredFluidContainerData()`

## Description

Register simple items that contain fluids here. Useful for buckets, bottles, and things that have ID/metadata mappings. For more complex items, use IFluidContainerItem instead.