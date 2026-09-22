---
title: "ContainerRepair"
description: "public class ContainerRepair extends Container"
package: "net/minecraft/inventory"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/ContainerRepair.html"
sourceType: javadoc
---

# ContainerRepair

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container → net.minecraft.inventory.ContainerRepair

## Class signature

```java
public class ContainerRepair extends Container
```

## Constructors

- `ContainerRepair(InventoryPlayer playerInventory, World worldIn, BlockPos blockPosIn, EntityPlayer player)`
- `ContainerRepair(InventoryPlayer playerInventory, World worldIn, EntityPlayer player)`

## Methods

- `boolean canInteractWith(EntityPlayer playerIn)`
- `void onContainerClosed(EntityPlayer playerIn)` — Called when the container is closed.
- `void onCraftGuiOpened(ICrafting listener)`
- `void onCraftMatrixChanged(IInventory inventoryIn)` — Callback for when the crafting matrix is changed.
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)` — Take a stack from the specified inventory slot.
- `void updateItemName(java.lang.String newName)` — used by the Anvil GUI to update the Item Name being typed by the player
- `void updateProgressBar(int id, int data)`
- `void updateRepairOutput()` — called when the Anvil Input Slot changes, calculates the new result and puts it in the output slot

## Fields

- `int materialCost` — determined by damage of input item and stackSize of repair materials
- `int maximumCost` — The maximum cost of repairing/renaming in the anvil.
