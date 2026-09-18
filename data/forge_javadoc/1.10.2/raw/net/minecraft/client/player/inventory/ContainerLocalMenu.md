---
title: "ContainerLocalMenu"
description: "public class ContainerLocalMenu extends InventoryBasic implements ILockableContainer"
package: "net/minecraft/client/player/inventory"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/player/inventory/ContainerLocalMenu.html"
sourceType: javadoc
---

# ContainerLocalMenu

## Class signature

```java
public class ContainerLocalMenu extends InventoryBasic implements ILockableContainer
```

## Constructors

- `public ContainerLocalMenu(java.lang.String id, ITextComponent title, int slotCount)`

## Methods

- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public boolean isLocked()`
- `public void setLockCode( LockCode code)`
- `public LockCode getLockCode()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
