---
title: "FluidUtil"
description: "public class FluidUtil extends java.lang.Object"
package: "net/minecraftforge/fluids"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/FluidUtil.html"
sourceType: javadoc
---

# FluidUtil

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.FluidUtil

## Class signature

```java
public class FluidUtil extends java.lang.Object
```

## Methods

- `static FluidStack getFluidContained(ItemStack container)` — Helper method to get the fluid contained in an itemStack
- `static IFluidHandler getFluidHandler(ItemStack itemStack)` — Helper method to get an IFluidHandler for an itemStack.
- `static IFluidHandler getFluidHandler(World world, BlockPos blockPos, EnumFacing side)` — Helper method to get an IFluidHandler for at a block position.
- `static boolean interactWithFluidHandler(ItemStack stack, IFluidHandler fluidHandler, EntityPlayer player)` — Used to handle the common case of a fluid item right-clicking on a fluid handler.
- `@Deprecated static boolean interactWithTank(ItemStack stack, EntityPlayer player, IFluidHandler tank, EnumFacing side)` — Deprecated. use interactWithFluidHandler(ItemStack, IFluidHandler, EntityPlayer)
- `@Deprecated static ItemStack tryEmptyBucket(ItemStack bucket, IFluidHandler tank, EnumFacing side)` — Deprecated. use tryEmptyContainer(ItemStack, IFluidHandler, int, EntityPlayer, boolean)
- `@Deprecated static ItemStack tryEmptyBucket(ItemStack bucket, IFluidHandler tank, EnumFacing side, EntityPlayer player)` — Deprecated. use tryFillContainer(ItemStack, IFluidHandler, int, EntityPlayer, boolean)
- `static ItemStack tryEmptyContainer(ItemStack container, IFluidHandler fluidDestination, int maxAmount, EntityPlayer player, boolean doDrain)` — Takes a filled container and tries to empty it into the given tank.
- `static boolean tryEmptyContainerAndStow(ItemStack container, IFluidHandler fluidDestination, IItemHandler inventory, int maxAmount, EntityPlayer player)` — Takes an Fluid Container Item, tries to empty it into the fluid handler, and stows it in the given inventory.
- `@Deprecated static boolean tryEmptyFluidContainerItem(ItemStack container, IFluidHandler tank, EnumFacing side, EntityPlayer player)` — Deprecated. use tryEmptyContainerAndStow(ItemStack, IFluidHandler, IItemHandler, int, EntityPlayer)
- `@Deprecated static boolean tryEmptyFluidContainerItem(ItemStack container, IFluidHandler tank, EnumFacing side, IItemHandler inventory, int max, EntityPlayer player)` — Deprecated. use tryEmptyContainerAndStow(ItemStack, IFluidHandler, IItemHandler, int, EntityPlayer)
- `@Deprecated static ItemStack tryFillBucket(ItemStack bucket, IFluidHandler tank, EnumFacing side)` — Deprecated. use tryFillContainer(ItemStack, IFluidHandler, int, EntityPlayer, boolean)
- `@Deprecated static ItemStack tryFillBucket(ItemStack bucket, IFluidHandler tank, EnumFacing side, EntityPlayer player)` — Deprecated. use tryFillContainer(ItemStack, IFluidHandler, int, EntityPlayer, boolean)
- `static ItemStack tryFillContainer(ItemStack container, IFluidHandler fluidSource, int maxAmount, EntityPlayer player, boolean doFill)` — Fill a container from the given fluidSource.
- `static boolean tryFillContainerAndStow(ItemStack container, IFluidHandler fluidSource, IItemHandler inventory, int maxAmount, EntityPlayer player)` — Takes an Fluid Container Item and tries to fill it from the given tank.
- `@Deprecated static boolean tryFillFluidContainerItem(ItemStack container, IFluidHandler tank, EnumFacing side, EntityPlayer player)` — Deprecated. use tryFillContainerAndStow(ItemStack, IFluidHandler, IItemHandler, int, EntityPlayer)
- `@Deprecated static boolean tryFillFluidContainerItem(ItemStack container, IFluidHandler tank, EnumFacing side, IItemHandler inventory, int max, EntityPlayer player)` — Deprecated. use tryFillContainerAndStow(ItemStack, IFluidHandler, IItemHandler, int, EntityPlayer)
- `static FluidStack tryFluidTransfer(IFluidHandler fluidDestination, IFluidHandler fluidSource, int maxAmount, boolean doTransfer)` — Fill a destination fluid handler from a source fluid handler.
- `static ItemStack tryPickUpFluid(ItemStack emptyContainer, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side)` — Attempts to pick up a fluid in the world and put it in an empty container item.
- `static boolean tryPlaceFluid(EntityPlayer player, World worldIn, FluidStack fluidStack, BlockPos pos)` — Tries to place a fluid in the world in block form.
