---
title: "ItemFluidContainer"
description: "public class ItemFluidContainer extends Item implements IFluidContainerItem"
package: "net/minecraftforge/fluids"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fluids/ItemFluidContainer.html"
sourceType: javadoc
---

# ItemFluidContainer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraftforge.fluids.ItemFluidContainer

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
