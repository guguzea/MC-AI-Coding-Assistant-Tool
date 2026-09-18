# RangedWrapper

## Class signature

```java
public class RangedWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `public RangedWrapper( IItemHandlerModifiable compose, int minSlot, int maxSlotExclusive)`

## Methods

- `public int getSlots()`
- `@Nonnull public ItemStack getStackInSlot(int slot)`
- `@Nonnull public ItemStack insertItem(int slot, @Nonnull ItemStack stack, boolean simulate)`
- `@Nonnull public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public void setStackInSlot(int slot, @Nonnull ItemStack stack)`
- `public int getSlotLimit(int slot)`

## Description

A wrapper that composes another IItemHandlerModifiable, exposing only a range of the composed slots. Shifting of slot indices is handled automatically for you.