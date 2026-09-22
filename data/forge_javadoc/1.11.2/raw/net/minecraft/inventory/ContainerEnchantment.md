---
title: "ContainerEnchantment"
description: "public class ContainerEnchantment extends Container"
package: "net/minecraft/inventory"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/inventory/ContainerEnchantment.html"
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

- `void addListener(IContainerListener listener)`
- `protected void broadcastData(IContainerListener crafting)`
- `boolean canInteractWith(EntityPlayer playerIn)`
- `void detectAndSendChanges()`
- `boolean enchantItem(EntityPlayer playerIn, int id)`
- `int getLapisAmount()`
- `void onContainerClosed(EntityPlayer playerIn)`
- `void onCraftMatrixChanged(IInventory inventoryIn)`
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)`
- `void updateProgressBar(int id, int data)`

## Fields

- `int[] enchantClue`
- `int[] enchantLevels`
- `IInventory tableInventory`
- `int[] worldClue`
- `int xpSeed`
