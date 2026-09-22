---
title: "ContainerPlayer"
description: "public class ContainerPlayer extends Container"
package: "net/minecraft/inventory"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/ContainerPlayer.html"
sourceType: javadoc
---

# ContainerPlayer

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container → net.minecraft.inventory.ContainerPlayer

## Class signature

```java
public class ContainerPlayer extends Container
```

## Constructors

- `ContainerPlayer(InventoryPlayer playerInventory, boolean localWorld, EntityPlayer player)`

## Methods

- `boolean canInteractWith(EntityPlayer playerIn)`
- `boolean canMergeSlot(ItemStack stack, Slot p_94530_2_)` — Called to determine if the current slot is valid for the stack merging (double-click) code.
- `void onContainerClosed(EntityPlayer playerIn)` — Called when the container is closed.
- `void onCraftMatrixChanged(IInventory inventoryIn)` — Callback for when the crafting matrix is changed.
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)` — Take a stack from the specified inventory slot.

## Fields

- `InventoryCrafting craftMatrix` — The crafting matrix inventory.
- `IInventory craftResult`
- `boolean isLocalWorld` — Determines if inventory manipulation should be handled.
