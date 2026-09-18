---
title: "ContainerBeacon"
description: "public class ContainerBeacon extends Container"
package: "net/minecraft/inventory"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/inventory/ContainerBeacon.html"
sourceType: javadoc
---

# ContainerBeacon

## Class signature

```java
public class ContainerBeacon extends Container
```

## Constructors

- `public ContainerBeacon( IInventory playerInventory, IInventory tileBeaconIn)`

## Methods

- `public void addListener( IContainerListener listener)`
- `public void updateProgressBar(int id, int data)`
- `public IInventory getTileEntity()`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `public boolean canInteractWith( EntityPlayer playerIn)`
- `public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`
