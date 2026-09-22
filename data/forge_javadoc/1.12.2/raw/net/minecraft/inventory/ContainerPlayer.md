---
title: "ContainerPlayer"
description: "public class ContainerPlayer extends Container"
package: "net/minecraft/inventory"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/inventory/ContainerPlayer.html"
sourceType: javadoc
---

# ContainerPlayer

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container → net.minecraft.inventory.ContainerPlayer

## Class signature

```java
public class ContainerPlayer extends Container
```

## Constructors

- `ContainerPlayer(InventoryPlayer playerInventory, boolean localWorld, EntityPlayer playerIn)`

## Methods

- `boolean canInteractWith(EntityPlayer playerIn)`
- `boolean canMergeSlot(ItemStack stack, Slot slotIn)`
- `void onContainerClosed(EntityPlayer playerIn)`
- `void onCraftMatrixChanged(IInventory inventoryIn)`
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)`

## Fields

- `InventoryCrafting craftMatrix`
- `InventoryCraftResult craftResult`
- `boolean isLocalWorld`
