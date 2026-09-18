# SidedInvWrapper

## Class signature

```java
public class SidedInvWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `public SidedInvWrapper( ISidedInventory inv, EnumFacing side)`

## Methods

- `public static int getSlot( ISidedInventory inv, int slot, EnumFacing side)`
- `public boolean equals(java.lang.Object o)`
- `public int hashCode()`
- `public int getSlots()`
- `public ItemStack getStackInSlot(int slot)`
- `public ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `public void setStackInSlot(int slot, ItemStack stack)`
- `public ItemStack extractItem(int slot, int amount, boolean simulate)`

## Description

Extracts an ItemStack from the given slot.