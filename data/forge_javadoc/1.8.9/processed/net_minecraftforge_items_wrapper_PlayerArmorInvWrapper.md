# PlayerArmorInvWrapper

## Class signature

```java
public class PlayerArmorInvWrapper extends InvWrapper
```

## Constructors

- `public PlayerArmorInvWrapper( InventoryPlayer inv)`

## Methods

- `public int getSlots()`
- `public ItemStack getStackInSlot(int slot)`
- `public ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `public void setStackInSlot(int slot, ItemStack stack)`
- `public ItemStack extractItem(int slot, int amount, boolean simulate)`

## Description

Extracts an ItemStack from the given slot.