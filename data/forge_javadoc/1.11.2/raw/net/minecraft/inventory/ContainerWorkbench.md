---
title: "ContainerWorkbench"
description: "public class ContainerWorkbench extends Container"
package: "net/minecraft/inventory"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/inventory/ContainerWorkbench.html"
sourceType: javadoc
---

# ContainerWorkbench

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container → net.minecraft.inventory.ContainerWorkbench

## Class signature

```java
public class ContainerWorkbench extends Container
```

## Constructors

- `ContainerWorkbench(InventoryPlayer playerInventory, World worldIn, BlockPos posIn)`

## Methods

- `boolean canInteractWith(EntityPlayer playerIn)`
- `boolean canMergeSlot(ItemStack stack, Slot slotIn)`
- `void onContainerClosed(EntityPlayer playerIn)`
- `void onCraftMatrixChanged(IInventory inventoryIn)`
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)`

## Fields

- `InventoryCrafting craftMatrix`
- `IInventory craftResult`
