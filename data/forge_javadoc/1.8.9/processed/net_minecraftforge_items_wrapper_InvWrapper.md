# InvWrapper

## Class signature

```java
public class InvWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `public InvWrapper( IInventory inv)`

## Methods

- `public boolean equals(java.lang.Object o)`
- `public int hashCode()`
- `public int getSlots()`
- `public ItemStack getStackInSlot(int slot)`
- `public ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public void setStackInSlot(int slot, ItemStack stack)`

## Description

Extracts an ItemStack from the given slot.