---
title: "FluidUtil"
description: "public class FluidUtil extends java.lang.Object"
package: "net/minecraftforge/fluids"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fluids/FluidUtil.html"
sourceType: javadoc
---

# FluidUtil

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.FluidUtil

## Class signature

```java
public class FluidUtil extends java.lang.Object
```

## Methods

- `static boolean interactWithTank(ItemStack stack, EntityPlayer player, IFluidHandler tank, EnumFacing side)` — Returns true if interaction was successful.
- `@Deprecated static ItemStack tryEmptyBucket(ItemStack bucket, IFluidHandler tank, EnumFacing side)`
- `static ItemStack tryEmptyBucket(ItemStack bucket, IFluidHandler tank, EnumFacing side, EntityPlayer player)` — Takes a filled bucket and tries to empty it into the given tank.
- `static boolean tryEmptyFluidContainerItem(ItemStack container, IFluidHandler tank, EnumFacing side, EntityPlayer player)`
- `static boolean tryEmptyFluidContainerItem(ItemStack container, IFluidHandler tank, EnumFacing side, IItemHandler inventory, int max, EntityPlayer player)` — Takes an IFluidContainerItem and tries to empty it into the given tank.
- `@Deprecated static ItemStack tryFillBucket(ItemStack bucket, IFluidHandler tank, EnumFacing side)`
- `static ItemStack tryFillBucket(ItemStack bucket, IFluidHandler tank, EnumFacing side, EntityPlayer player)` — Fill an empty bucket from the given tank.
- `static boolean tryFillFluidContainerItem(ItemStack container, IFluidHandler tank, EnumFacing side, EntityPlayer player)` — Takes an IFluidContainerItem and tries to fill it from the given tank.
- `static boolean tryFillFluidContainerItem(ItemStack container, IFluidHandler tank, EnumFacing side, IItemHandler inventory, int max, EntityPlayer player)` — Takes an IFluidContainerItem and tries to fill it from the given tank.
