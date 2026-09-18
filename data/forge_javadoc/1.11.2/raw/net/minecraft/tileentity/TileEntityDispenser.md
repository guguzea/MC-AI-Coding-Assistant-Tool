---
title: "TileEntityDispenser"
description: "public class TileEntityDispenser extends TileEntityLockableLoot"
package: "net/minecraft/tileentity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntityDispenser.html"
sourceType: javadoc
---

# TileEntityDispenser

## Class signature

```java
public class TileEntityDispenser extends TileEntityLockableLoot
```

## Constructors

- `public TileEntityDispenser()`

## Methods

- `public int getSizeInventory()`
- `public boolean isEmpty()`
- `public int getDispenseSlot()`
- `public int addItemStack( ItemStack stack)`
- `public java.lang.String getName()`
- `public static void registerFixes( DataFixer fixer)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public int getInventoryStackLimit()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `protected NonNullList < ItemStack > getItems()`
