# FluidUtil

## Class signature

```java
public class FluidUtil extends java.lang.Object
```

## Methods

- `public static boolean interactWithFluidHandler( ItemStack stack, IFluidHandler fluidHandler, EntityPlayer player)`
- `public static ItemStack tryFillContainer( ItemStack container, IFluidHandler fluidSource, int maxAmount, @Nullable EntityPlayer player, boolean doFill)`
- `@Nullable public static ItemStack tryEmptyContainer( ItemStack container, IFluidHandler fluidDestination, int maxAmount, @Nullable EntityPlayer player, boolean doDrain)`
- `public static boolean tryFillContainerAndStow( ItemStack container, IFluidHandler fluidSource, IItemHandler inventory, int maxAmount, @Nullable EntityPlayer player)`
- `public static boolean tryEmptyContainerAndStow( ItemStack container, IFluidHandler fluidDestination, IItemHandler inventory, int maxAmount, @Nullable EntityPlayer player)`
- `@Nullable public static FluidStack tryFluidTransfer( IFluidHandler fluidDestination, IFluidHandler fluidSource, int maxAmount, boolean doTransfer)`
- `@Nullable public static IFluidHandler getFluidHandler( ItemStack itemStack)`
- `@Nullable public static FluidStack getFluidContained( ItemStack container)`
- `@Nullable public static IFluidHandler getFluidHandler( World world, BlockPos blockPos, @Nullable EnumFacing side)`
- `public static boolean tryPlaceFluid(@Nullable EntityPlayer player, World worldIn, FluidStack fluidStack, BlockPos pos)`
- `@Nullable public static ItemStack tryPickUpFluid( ItemStack emptyContainer, @Nullable EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side)`
- `@Deprecated public static boolean interactWithTank( ItemStack stack, EntityPlayer player, IFluidHandler tank, EnumFacing side)`
- `@Deprecated public static ItemStack tryFillBucket( ItemStack bucket, IFluidHandler tank, EnumFacing side)`
- `@Deprecated public static ItemStack tryFillBucket( ItemStack bucket, IFluidHandler tank, EnumFacing side, EntityPlayer player)`
- `@Deprecated public static ItemStack tryEmptyBucket( ItemStack bucket, IFluidHandler tank, EnumFacing side)`
- `@Deprecated public static ItemStack tryEmptyBucket( ItemStack bucket, IFluidHandler tank, EnumFacing side, EntityPlayer player)`
- `@Deprecated public static boolean tryFillFluidContainerItem( ItemStack container, IFluidHandler tank, EnumFacing side, EntityPlayer player)`
- `@Deprecated public static boolean tryEmptyFluidContainerItem( ItemStack container, IFluidHandler tank, EnumFacing side, EntityPlayer player)`
- `@Deprecated public static boolean tryFillFluidContainerItem( ItemStack container, IFluidHandler tank, EnumFacing side, IItemHandler inventory, int max, @Nullable EntityPlayer player)`
- `@Deprecated public static boolean tryEmptyFluidContainerItem( ItemStack container, IFluidHandler tank, EnumFacing side, IItemHandler inventory, int max, EntityPlayer player)`

## Description

Helper method to get the fluid contained in an itemStack