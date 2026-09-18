---
title: "ContainerEnchantment"
description: "3-member array storing the enchantment levels of each slot"
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/ContainerEnchantment.html"
sourceType: javadoc
---

# ContainerEnchantment

## Class signature

```java
public class ContainerEnchantment extends Container
```

## Constructors

- `public ContainerEnchantment( InventoryPlayer playerInv, World worldIn)`
- `public ContainerEnchantment( InventoryPlayer playerInv, World worldIn, BlockPos pos)`

## Methods

- `public void onCraftGuiOpened( ICrafting listener)`
- `public void detectAndSendChanges()`
- `public void updateProgressBar(int id, int data)`
- `public void onCraftMatrixChanged( IInventory inventoryIn)`
- `public boolean enchantItem( EntityPlayer playerIn, int id)`
- `public int getLapisAmount()`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `public boolean canInteractWith( EntityPlayer playerIn)`
- `public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`

## Description

3-member array storing the enchantment levels of each slot
