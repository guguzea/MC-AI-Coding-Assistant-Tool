# SlotMerchantResult

**Inheritance:** java.lang.Object → net.minecraft.inventory.Slot → net.minecraft.inventory.SlotMerchantResult

## Class signature

```java
public class SlotMerchantResult extends Slot
```

## Methods

- `ItemStack decrStackSize(int amount)` — Decrease the size of the stack in slot (first int arg) by the amount of the second int arg.
- `boolean isItemValid(ItemStack stack)` — Check if the stack is a valid item for this slot.
- `protected void onCrafting(ItemStack stack)` — the itemStack passed in is the output - ie, iron ingots, and pickaxes, not ore and wood.
- `protected void onCrafting(ItemStack stack, int amount)` — the itemStack passed in is the output - ie, iron ingots, and pickaxes, not ore and wood.
- `void onPickupFromSlot(EntityPlayer playerIn, ItemStack stack)`

## Fields

- `SlotMerchantResult`