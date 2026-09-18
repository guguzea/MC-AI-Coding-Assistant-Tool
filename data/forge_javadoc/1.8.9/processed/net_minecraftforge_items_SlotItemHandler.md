# SlotItemHandler

## Class signature

```java
public class SlotItemHandler extends Slot
```

## Constructors

- `public SlotItemHandler( IItemHandler itemHandler, int index, int xPosition, int yPosition)`

## Methods

- `public boolean isItemValid( ItemStack stack)`
- `public ItemStack getStack()`
- `public void putStack( ItemStack stack)`
- `public void onSlotChange( ItemStack p_75220_1_, ItemStack p_75220_2_)`
- `public int getItemStackLimit( ItemStack stack)`
- `public boolean canTakeStack( EntityPlayer playerIn)`
- `public ItemStack decrStackSize(int amount)`

## Description

Return whether this slot's stack can be taken from this slot.