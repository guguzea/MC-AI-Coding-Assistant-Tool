---
title: "ContainerEnchantment"
description: "public class ContainerEnchantment extends Container"
package: "net/minecraft/inventory"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/ContainerEnchantment.html"
sourceType: javadoc
---

# ContainerEnchantment

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container → net.minecraft.inventory.ContainerEnchantment

## Class signature

```java
public class ContainerEnchantment extends Container
```

## Constructors

- `ContainerEnchantment(InventoryPlayer playerInv, World worldIn)`
- `ContainerEnchantment(InventoryPlayer playerInv, World worldIn, BlockPos pos)`

## Methods

- `boolean canInteractWith(EntityPlayer playerIn)`
- `void detectAndSendChanges()` — Looks for changes made in the container, sends them to every listener.
- `boolean enchantItem(EntityPlayer playerIn, int id)` — Handles the given Button-click on the server, currently only used by enchanting.
- `int getLapisAmount()`
- `void onContainerClosed(EntityPlayer playerIn)` — Called when the container is closed.
- `void onCraftGuiOpened(ICrafting listener)`
- `void onCraftMatrixChanged(IInventory inventoryIn)` — Callback for when the crafting matrix is changed.
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)` — Take a stack from the specified inventory slot.
- `void updateProgressBar(int id, int data)`

## Fields

- `int[] enchantLevels` — 3-member array storing the enchantment levels of each slot
- `int[] field_178151_h`
- `IInventory tableInventory` — SlotEnchantmentTable object with ItemStack to be enchanted
- `int xpSeed`
