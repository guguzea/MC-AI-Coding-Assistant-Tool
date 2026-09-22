---
title: "ContainerMerchant"
description: "public class ContainerMerchant extends Container"
package: "net/minecraft/inventory"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/ContainerMerchant.html"
sourceType: javadoc
---

# ContainerMerchant

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container → net.minecraft.inventory.ContainerMerchant

## Class signature

```java
public class ContainerMerchant extends Container
```

## Methods

- `boolean canInteractWith(EntityPlayer playerIn)`
- `void detectAndSendChanges()` — Looks for changes made in the container, sends them to every listener.
- `InventoryMerchant getMerchantInventory()`
- `void onContainerClosed(EntityPlayer playerIn)` — Called when the container is closed.
- `void onCraftGuiOpened(ICrafting listener)`
- `void onCraftMatrixChanged(IInventory inventoryIn)` — Callback for when the crafting matrix is changed.
- `void setCurrentRecipeIndex(int currentRecipeIndex)`
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)` — Take a stack from the specified inventory slot.
- `void updateProgressBar(int id, int data)`

## Fields

- `ContainerMerchant`
