---
title: "ContainerEnchantment"
description: "public class ContainerEnchantment extends Container"
package: "net/minecraft/inventory"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/inventory/ContainerEnchantment.html"
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

- `protected void broadcastData( IContainerListener crafting)`
- `public void addListener( IContainerListener listener)`
- `public void detectAndSendChanges()`
- `public void updateProgressBar(int id, int data)`
- `public void onCraftMatrixChanged( IInventory inventoryIn)`
- `public boolean enchantItem( EntityPlayer playerIn, int id)`
- `public int getLapisAmount()`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `public boolean canInteractWith( EntityPlayer playerIn)`
- `@Nullable public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`
