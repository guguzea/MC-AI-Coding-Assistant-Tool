# CombinedInvWrapper

## Class signature

```java
public class CombinedInvWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `public CombinedInvWrapper( IItemHandlerModifiable ... itemHandler)`

## Methods

- `protected int getIndexForSlot(int slot)`
- `protected IItemHandlerModifiable getHandlerFromIndex(int index)`
- `protected int getSlotFromIndex(int slot, int index)`
- `public void setStackInSlot(int slot, ItemStack stack)`
- `public int getSlots()`
- `public ItemStack getStackInSlot(int slot)`
- `public ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `public ItemStack extractItem(int slot, int amount, boolean simulate)`

## Description

Extracts an ItemStack from the given slot.