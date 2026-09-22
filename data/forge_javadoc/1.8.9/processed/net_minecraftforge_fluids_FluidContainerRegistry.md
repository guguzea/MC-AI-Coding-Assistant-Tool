# FluidContainerRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.FluidContainerRegistry

## Class signature

```java
public abstract class FluidContainerRegistry extends java.lang.Object
```

## Methods

- `static boolean containsFluid(ItemStack container, FluidStack fluid)` — Determines if a container holds a specific fluid.
- `static ItemStack drainFluidContainer(ItemStack container)` — Attempts to empty a full container.
- `static ItemStack fillFluidContainer(FluidStack fluid, ItemStack container)` — Attempts to fill an empty container with a fluid.
- `static int getContainerCapacity(FluidStack fluid, ItemStack container)` — Determines the capacity of a container.
- `static int getContainerCapacity(ItemStack container)` — Determines the capacity of a full container.
- `static FluidStack getFluidForFilledItem(ItemStack container)` — Determines the fluid type and amount inside a container.
- `static FluidContainerRegistry.FluidContainerData [] getRegisteredFluidContainerData()`
- `static boolean isBucket(ItemStack container)`
- `static boolean isContainer(ItemStack container)`
- `static boolean isEmptyContainer(ItemStack container)`
- `static boolean isFilledContainer(ItemStack container)`
- `static boolean registerFluidContainer(FluidContainerRegistry.FluidContainerData data)` — Register a new fluid containing item.
- `static boolean registerFluidContainer(Fluid fluid, ItemStack filledContainer)` — Register a new fluid containing item that does not have an empty container.
- `static boolean registerFluidContainer(Fluid fluid, ItemStack filledContainer, ItemStack emptyContainer)` — Register a new fluid containing item.
- `static boolean registerFluidContainer(FluidStack stack, ItemStack filledContainer)` — Register a new fluid containing item that does not have an empty container.
- `static boolean registerFluidContainer(FluidStack stack, ItemStack filledContainer, ItemStack emptyContainer)` — Register a new fluid containing item.

## Fields

- `static int BUCKET_VOLUME`
- `static ItemStack EMPTY_BOTTLE`
- `static ItemStack EMPTY_BUCKET`