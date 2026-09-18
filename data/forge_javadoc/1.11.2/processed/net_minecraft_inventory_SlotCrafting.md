# SlotCrafting

## Class signature

```java
public class SlotCrafting extends Slot
```

## Constructors

- `public SlotCrafting( EntityPlayer player, InventoryCrafting craftingInventory, IInventory inventoryIn, int slotIndex, int xPosition, int yPosition)`

## Methods

- `public boolean isItemValid( ItemStack stack)`
- `public ItemStack decrStackSize(int amount)`
- `protected void onCrafting( ItemStack stack, int amount)`
- `protected void onSwapCraft(int p_190900_1_)`
- `protected void onCrafting( ItemStack stack)`
- `public ItemStack onTake( EntityPlayer thePlayer, ItemStack stack)`