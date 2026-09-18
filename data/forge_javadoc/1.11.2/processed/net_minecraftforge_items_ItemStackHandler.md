# ItemStackHandler

## Class signature

```java
public class ItemStackHandler extends java.lang.Object implements IItemHandler , IItemHandlerModifiable , INBTSerializable < NBTTagCompound >
```

## Constructors

- `public ItemStackHandler()`
- `public ItemStackHandler(int size)`
- `public ItemStackHandler( NonNullList < ItemStack > stacks)`

## Methods

- `public void setSize(int size)`
- `public void setStackInSlot(int slot, @Nonnull ItemStack stack)`
- `public int getSlots()`
- `@Nonnull public ItemStack getStackInSlot(int slot)`
- `@Nonnull public ItemStack insertItem(int slot, @Nonnull ItemStack stack, boolean simulate)`
- `@Nonnull public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public int getSlotLimit(int slot)`
- `protected int getStackLimit(int slot, @Nonnull ItemStack stack)`
- `public NBTTagCompound serializeNBT()`
- `public void deserializeNBT( NBTTagCompound nbt)`
- `protected void validateSlotIndex(int slot)`
- `protected void onLoad()`
- `protected void onContentsChanged(int slot)`

## Description

Extracts an ItemStack from the given slot.