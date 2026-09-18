# EmptyHandler

## Class signature

```java
public class EmptyHandler extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `public EmptyHandler()`

## Methods

- `public int getSlots()`
- `@Nonnull public ItemStack getStackInSlot(int slot)`
- `@Nonnull public ItemStack insertItem(int slot, @Nonnull ItemStack stack, boolean simulate)`
- `@Nonnull public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public void setStackInSlot(int slot, @Nonnull ItemStack stack)`
- `public int getSlotLimit(int slot)`

## Description

Extracts an ItemStack from the given slot.