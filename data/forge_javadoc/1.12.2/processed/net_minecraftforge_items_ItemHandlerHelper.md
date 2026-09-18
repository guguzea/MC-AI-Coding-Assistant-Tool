# ItemHandlerHelper

## Class signature

```java
public class ItemHandlerHelper extends java.lang.Object
```

## Constructors

- `public ItemHandlerHelper()`

## Methods

- `public static ItemStack insertItem( IItemHandler dest, ItemStack stack, boolean simulate)`
- `public static boolean canItemStacksStack( ItemStack a, ItemStack b)`
- `public static boolean canItemStacksStackRelaxed( ItemStack a, ItemStack b)`
- `public static ItemStack copyStackWithSize( ItemStack itemStack, int size)`
- `public static ItemStack insertItemStacked( IItemHandler inventory, ItemStack stack, boolean simulate)`
- `public static void giveItemToPlayer( EntityPlayer player, ItemStack stack)`
- `public static void giveItemToPlayer( EntityPlayer player, ItemStack stack, int preferredSlot)`
- `public static int calcRedstoneFromInventory( IItemHandler inv)`

## Description

This method uses the standard vanilla algorithm to calculate a comparator output for how "full" the inventory is.