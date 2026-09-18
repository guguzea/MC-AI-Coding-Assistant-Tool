# IItemHandler

## Class signature

```java
public interface IItemHandler
```

## Methods

- `int getSlots()`
- `@Nonnull ItemStack getStackInSlot(int slot)`
- `@Nonnull ItemStack insertItem(int slot, @Nonnull ItemStack stack, boolean simulate)`
- `@Nonnull ItemStack extractItem(int slot, int amount, boolean simulate)`
- `int getSlotLimit(int slot)`

## Description

Extracts an ItemStack from the given slot.