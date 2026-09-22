---
title: "ContainerWorkbench"
description: "public class ContainerWorkbench extends Container"
package: "net/minecraft/inventory"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/inventory/ContainerWorkbench.html"
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
