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
- `@Nonnull public ItemStack getStackInSlot(int slot)`
- `@Nonnull public ItemStack insertItem(int slot, @Nonnull ItemStack stack, boolean simulate)`
- `@Nonnull public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public void setStackInSlot(int slot, @Nonnull ItemStack stack)`
- `public int getSlotLimit(int slot)`
- `public IInventory getInv()`

## Description

Extracts an ItemStack from the given slot.