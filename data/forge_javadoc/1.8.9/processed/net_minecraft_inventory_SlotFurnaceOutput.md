# SlotFurnaceOutput

## Class signature

```java
public class SlotFurnaceOutput extends Slot
```

## Constructors

- `public SlotFurnaceOutput( EntityPlayer player, IInventory inventoryIn, int slotIndex, int xPosition, int yPosition)`

## Methods

- `public boolean isItemValid( ItemStack stack)`
- `public ItemStack decrStackSize(int amount)`
- `public void onPickupFromSlot( EntityPlayer playerIn, ItemStack stack)`
- `protected void onCrafting( ItemStack stack, int amount)`
- `protected void onCrafting( ItemStack stack)`

## Description

Decrease the size of the stack in slot (first int arg) by the amount of the second int arg.