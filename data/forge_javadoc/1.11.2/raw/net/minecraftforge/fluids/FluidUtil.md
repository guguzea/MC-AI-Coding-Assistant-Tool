---
title: "FluidUtil"
description: "public class FluidUtil extends java.lang.Object"
package: "net/minecraftforge/fluids"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/FluidUtil.html"
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
- `static IFluidHandlerItem getFluidHandler(ItemStack itemStack)` — Helper method to get an IFluidHandlerItem for an itemStack.
- `static IFluidHandler getFluidHandler(World world, BlockPos blockPos, EnumFacing side)` — Helper method to get an IFluidHandler for at a block position.
- `static FluidActionResult interactWithFluidHandler(ItemStack stack, IFluidHandler fluidHandler, EntityPlayer player)` — Used to handle the common case of a player holding a fluid item and right-clicking on a fluid handler.
- `static FluidActionResult tryEmptyContainer(ItemStack container, IFluidHandler fluidDestination, int maxAmount, EntityPlayer player, boolean doDrain)` — Takes a filled container and tries to empty it into the given tank.
- `static FluidActionResult tryEmptyContainerAndStow(ItemStack container, IFluidHandler fluidDestination, IItemHandler inventory, int maxAmount, EntityPlayer player)` — Takes an Fluid Container Item, tries to empty it into the fluid handler, and stows it in the given inventory.
- `static FluidActionResult tryFillContainer(ItemStack container, IFluidHandler fluidSource, int maxAmount, EntityPlayer player, boolean doFill)` — Fill a container from the given fluidSource.
- `static FluidActionResult tryFillContainerAndStow(ItemStack container, IFluidHandler fluidSource, IItemHandler inventory, int maxAmount, EntityPlayer player)` — Takes an Fluid Container Item and tries to fill it from the given tank.
- `static FluidStack tryFluidTransfer(IFluidHandler fluidDestination, IFluidHandler fluidSource, int maxAmount, boolean doTransfer)` — Fill a destination fluid handler from a source fluid handler.
- `static FluidActionResult tryPickUpFluid(ItemStack emptyContainer, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side)` — Attempts to pick up a fluid in the world and put it in an empty container item.
- `static FluidActionResult tryPlaceFluid(EntityPlayer player, World world, BlockPos pos, ItemStack container, FluidStack resource)` — Tries to place a fluid in the world in block form and drains the container.
