# FluidUtil

## Class signature

```java
public class FluidUtil extends java.lang.Object
```

## Methods

- `@Nonnull public static FluidActionResult interactWithFluidHandler(@Nonnull ItemStack stack, IFluidHandler fluidHandler, EntityPlayer player)`
- `@Nonnull public static FluidActionResult tryFillContainer(@Nonnull ItemStack container, IFluidHandler fluidSource, int maxAmount, @Nullable EntityPlayer player, boolean doFill)`
- `@Nonnull public static FluidActionResult tryEmptyContainer(@Nonnull ItemStack container, IFluidHandler fluidDestination, int maxAmount, @Nullable EntityPlayer player, boolean doDrain)`
- `@Nonnull public static FluidActionResult tryFillContainerAndStow(@Nonnull ItemStack container, IFluidHandler fluidSource, IItemHandler inventory, int maxAmount, @Nullable EntityPlayer player)`
- `@Nonnull public static FluidActionResult tryEmptyContainerAndStow(@Nonnull ItemStack container, IFluidHandler fluidDestination, IItemHandler inventory, int maxAmount, @Nullable EntityPlayer player)`
- `@Nullable public static FluidStack tryFluidTransfer( IFluidHandler fluidDestination, IFluidHandler fluidSource, int maxAmount, boolean doTransfer)`
- `@Nullable public static IFluidHandlerItem getFluidHandler(@Nonnull ItemStack itemStack)`
- `@Nullable public static FluidStack getFluidContained(@Nonnull ItemStack container)`
- `@Nullable public static IFluidHandler getFluidHandler( World world, BlockPos blockPos, @Nullable EnumFacing side)`
- `@Nonnull public static FluidActionResult tryPickUpFluid(@Nonnull ItemStack emptyContainer, @Nullable EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side)`
- `@Nonnull public static FluidActionResult tryPlaceFluid(@Nullable EntityPlayer player, World world, BlockPos pos, @Nonnull ItemStack container, FluidStack resource)`

## Description

Helper method to get the fluid contained in an itemStack