---
title: "ContainerBrewingStand"
description: "Looks for changes made in the container, sends them to every listener."
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/ContainerBrewingStand.html"
sourceType: javadoc
---

# ContainerBrewingStand

## Class signature

```java
public class ContainerBrewingStand extends Container
```

## Constructors

- `public ContainerBrewingStand( InventoryPlayer playerInventory, IInventory tileBrewingStandIn)`

## Methods

- `public void onCraftGuiOpened( ICrafting listener)`
- `public void detectAndSendChanges()`
- `public void updateProgressBar(int id, int data)`
- `public boolean canInteractWith( EntityPlayer playerIn)`
- `public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`

## Description

Looks for changes made in the container, sends them to every listener.
