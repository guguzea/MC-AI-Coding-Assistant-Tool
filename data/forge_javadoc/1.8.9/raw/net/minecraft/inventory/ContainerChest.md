---
title: "ContainerChest"
description: "Return this chest container's lower chest inventory."
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/ContainerChest.html"
sourceType: javadoc
---

# ContainerChest

## Class signature

```java
public class ContainerChest extends Container
```

## Constructors

- `public ContainerChest( IInventory playerInventory, IInventory chestInventory, EntityPlayer player)`

## Methods

- `public boolean canInteractWith( EntityPlayer playerIn)`
- `public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `public IInventory getLowerChestInventory()`

## Description

Return this chest container's lower chest inventory.
