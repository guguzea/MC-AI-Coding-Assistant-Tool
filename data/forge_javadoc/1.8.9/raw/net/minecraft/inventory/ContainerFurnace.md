---
title: "ContainerFurnace"
description: "Looks for changes made in the container, sends them to every listener."
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/ContainerFurnace.html"
sourceType: javadoc
---

# ContainerFurnace

## Class signature

```java
public class ContainerFurnace extends Container
```

## Constructors

- `public ContainerFurnace( InventoryPlayer playerInventory, IInventory furnaceInventory)`

## Methods

- `public void onCraftGuiOpened( ICrafting listener)`
- `public void detectAndSendChanges()`
- `public void updateProgressBar(int id, int data)`
- `public boolean canInteractWith( EntityPlayer playerIn)`
- `public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`

## Description

Looks for changes made in the container, sends them to every listener.
