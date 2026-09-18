# ItemHandlerHelper

## Class signature

```java
public class ItemHandlerHelper extends java.lang.Object
```

## Constructors

- `public ItemHandlerHelper()`

## Methods

- `@Nonnull public static ItemStack insertItem( IItemHandler dest, @Nonnull ItemStack stack, boolean simulate)`
- `public static boolean canItemStacksStack(@Nonnull ItemStack a, @Nonnull ItemStack b)`
- `public static boolean canItemStacksStackRelaxed(@Nonnull ItemStack a, @Nonnull ItemStack b)`
- `@Nonnull public static ItemStack copyStackWithSize(@Nonnull ItemStack itemStack, int size)`
- `@Nonnull public static ItemStack insertItemStacked( IItemHandler inventory, @Nonnull ItemStack stack, boolean simulate)`
- `public static void giveItemToPlayer( EntityPlayer player, @Nonnull ItemStack stack)`
- `public static void giveItemToPlayer( EntityPlayer player, @Nonnull ItemStack stack, int preferredSlot)`
- `public static int calcRedstoneFromInventory(@Nullable IItemHandler inv)`

## Description

This method uses the standard vanilla algorithm to calculate a comparator output for how "full" the inventory is.