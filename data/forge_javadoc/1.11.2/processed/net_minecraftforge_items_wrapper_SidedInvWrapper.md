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
- `@Nonnull public ItemStack getStackInSlot(int slot)`
- `@Nonnull public ItemStack insertItem(int slot, @Nonnull ItemStack stack, boolean simulate)`
- `public void setStackInSlot(int slot, @Nonnull ItemStack stack)`
- `@Nonnull public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public int getSlotLimit(int slot)`

## Description

Extracts an ItemStack from the given slot.