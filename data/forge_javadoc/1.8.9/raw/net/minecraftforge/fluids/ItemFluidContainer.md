---
title: "ItemFluidContainer"
description: "public class ItemFluidContainer extends Item implements IFluidContainerItem"
package: "net/minecraftforge/fluids"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fluids/ItemFluidContainer.html"
sourceType: javadoc
---

# ItemFluidContainer

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraftforge.fluids.ItemFluidContainer

## Class signature

```java
public class ItemFluidContainer extends Item implements IFluidContainerItem
```

## Constructors

- `ItemFluidContainer(int itemID)`
- `ItemFluidContainer(int itemID, int capacity)`

## Methods

- `FluidStack drain(ItemStack container, int maxDrain, boolean doDrain)`
- `int fill(ItemStack container, FluidStack resource, boolean doFill)`
- `int getCapacity(ItemStack container)`
- `FluidStack getFluid(ItemStack container)`
- `ItemFluidContainer setCapacity(int capacity)`

## Fields

- `protected int capacity`
