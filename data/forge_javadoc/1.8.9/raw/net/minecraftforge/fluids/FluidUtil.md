---
title: "FluidUtil"
description: "public class FluidUtil extends java.lang.Object"
package: "net/minecraftforge/fluids"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fluids/FluidUtil.html"
sourceType: javadoc
---

# FluidUtil

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.FluidUtil

## Class signature

```java
public class FluidUtil extends java.lang.Object
```

## Methods

- `static boolean interactWithTank(ItemStack stack, EntityPlayer player, IFluidHandler tank, EnumFacing side)` — Returns true if intercation was successful.
- `static ItemStack tryEmptyBucket(ItemStack bucket, IFluidHandler tank, EnumFacing side)` — Takes a filled bucket and tries to empty it into the given tank.
- `static boolean tryEmptyFluidContainerItem(ItemStack container, IFluidHandler tank, EnumFacing side, EntityPlayer player)`
- `static boolean tryEmptyFluidContainerItem(ItemStack container, IFluidHandler tank, EnumFacing side, IItemHandler inventory, int max, EntityPlayer player)` — Takes an IFluidContainerItem and tries to empty it into the given tank.
- `static ItemStack tryFillBucket(ItemStack bucket, IFluidHandler tank, EnumFacing side)` — Fill an empty bucket from the given tank.
- `static boolean tryFillFluidContainerItem(ItemStack container, IFluidHandler tank, EnumFacing side, EntityPlayer player)` — Takes an IFluidContainerItem and tries to fill it from the given tank.
- `static boolean tryFillFluidContainerItem(ItemStack container, IFluidHandler tank, EnumFacing side, IItemHandler inventory, int max, EntityPlayer player)` — Takes an IFluidContainerItem and tries to fill it from the given tank.
