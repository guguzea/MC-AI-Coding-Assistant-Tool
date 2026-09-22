# FluidContainerRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.FluidContainerRegistry

## Class signature

```java
public abstract class FluidContainerRegistry extends java.lang.Object
```

## Methods

- `@Deprecated static boolean containsFluid(ItemStack container, FluidStack fluid)`
- `@Deprecated static ItemStack drainFluidContainer(ItemStack container)`
- `@Deprecated static ItemStack fillFluidContainer(FluidStack fluid, ItemStack container)`
- `@Deprecated static int getContainerCapacity(FluidStack fluid, ItemStack container)`
- `@Deprecated static int getContainerCapacity(ItemStack container)`
- `@Deprecated static FluidStack getFluidForFilledItem(ItemStack container)`
- `@Deprecated static FluidContainerRegistry.FluidContainerData [] getRegisteredFluidContainerData()`
- `@Deprecated static boolean hasNullEmptyContainer(ItemStack container)`
- `@Deprecated static boolean isBucket(ItemStack container)`
- `@Deprecated static boolean isContainer(ItemStack container)`
- `@Deprecated static boolean isEmptyContainer(ItemStack container)`
- `@Deprecated static boolean isFilledContainer(ItemStack container)`
- `@Deprecated static boolean registerFluidContainer(FluidContainerRegistry.FluidContainerData data)`
- `@Deprecated static boolean registerFluidContainer(Fluid fluid, ItemStack filledContainer)`
- `@Deprecated static boolean registerFluidContainer(Fluid fluid, ItemStack filledContainer, ItemStack emptyContainer)`
- `@Deprecated static boolean registerFluidContainer(FluidStack stack, ItemStack filledContainer)`
- `@Deprecated static boolean registerFluidContainer(FluidStack stack, ItemStack filledContainer, ItemStack emptyContainer)`

## Fields

- `static int BUCKET_VOLUME`
- `static ItemStack EMPTY_BOTTLE`
- `static ItemStack EMPTY_BUCKET`