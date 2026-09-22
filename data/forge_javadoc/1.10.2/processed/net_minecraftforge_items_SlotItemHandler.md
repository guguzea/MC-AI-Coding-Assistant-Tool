# SlotItemHandler

**Inheritance:** java.lang.Object → net.minecraft.inventory.Slot → net.minecraftforge.items.SlotItemHandler

## Class signature

```java
public class SlotItemHandler extends Slot
```

## Methods

- `boolean canTakeStack(EntityPlayer playerIn)`
- `ItemStack decrStackSize(int amount)`
- `IItemHandler getItemHandler()`
- `int getItemStackLimit(ItemStack stack)`
- `ItemStack getStack()`
- `boolean isItemValid(ItemStack stack)`
- `boolean isSameInventory(Slot other)` — Checks if the other slot is in the same inventory, by comparing the inventory reference.
- `void onSlotChange(ItemStack p_75220_1_, ItemStack p_75220_2_)`
- `void putStack(ItemStack stack)`

## Fields

- `SlotItemHandler`