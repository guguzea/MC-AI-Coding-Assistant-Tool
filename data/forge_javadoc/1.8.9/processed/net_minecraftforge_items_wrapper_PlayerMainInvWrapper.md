# PlayerMainInvWrapper

## Class signature

```java
public class PlayerMainInvWrapper extends InvWrapper
```

## Constructors

- `public PlayerMainInvWrapper( InventoryPlayer inv)`

## Methods

- `public int getSlots()`
- `public void setStackInSlot(int slot, ItemStack stack)`
- `public ItemStack getStackInSlot(int slot)`
- `public ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `public ItemStack extractItem(int slot, int amount, boolean simulate)`

## Description

Exposes the player inventory WITHOUT the armor inventory as IItemHandler. Also takes core of inserting/extracting having the same logic as picking up items.