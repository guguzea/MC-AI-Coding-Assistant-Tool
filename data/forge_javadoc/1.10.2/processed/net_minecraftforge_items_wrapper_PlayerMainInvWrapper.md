# PlayerMainInvWrapper

## Class signature

```java
public class PlayerMainInvWrapper extends RangedWrapper
```

## Constructors

- `public PlayerMainInvWrapper( InventoryPlayer inv)`

## Methods

- `public ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `public InventoryPlayer getInventoryPlayer()`

## Description

Exposes the player inventory WITHOUT the armor inventory as IItemHandler. Also takes core of inserting/extracting having the same logic as picking up items.