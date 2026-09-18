# IItemHandler

## Class signature

```java
public interface IItemHandler
```

## Methods

- `int getSlots()`
- `ItemStack getStackInSlot(int slot)`
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `ItemStack extractItem(int slot, int amount, boolean simulate)`

## Description

Extracts an ItemStack from the given slot.