# FluidUtil

## Class signature

```java
public class FluidUtil extends java.lang.Object
```

## Methods

- `public static boolean interactWithTank( ItemStack stack, EntityPlayer player, IFluidHandler tank, EnumFacing side)`
- `public static ItemStack tryFillBucket( ItemStack bucket, IFluidHandler tank, EnumFacing side)`
- `public static ItemStack tryEmptyBucket( ItemStack bucket, IFluidHandler tank, EnumFacing side)`
- `public static boolean tryFillFluidContainerItem( ItemStack container, IFluidHandler tank, EnumFacing side, EntityPlayer player)`
- `public static boolean tryEmptyFluidContainerItem( ItemStack container, IFluidHandler tank, EnumFacing side, EntityPlayer player)`
- `public static boolean tryFillFluidContainerItem( ItemStack container, IFluidHandler tank, EnumFacing side, IItemHandler inventory, int max, EntityPlayer player)`
- `public static boolean tryEmptyFluidContainerItem( ItemStack container, IFluidHandler tank, EnumFacing side, IItemHandler inventory, int max, EntityPlayer player)`

## Description

Returns true if intercation was successful.