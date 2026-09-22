# PlayerMainInvWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.items.wrapper.InvWrapper → net.minecraftforge.items.wrapper.PlayerMainInvWrapper

## Class signature

```java
public class PlayerMainInvWrapper extends InvWrapper
```

## Constructors

- `PlayerMainInvWrapper(InventoryPlayer inv)`

## Methods

- `ItemStack extractItem(int slot, int amount, boolean simulate)` — Extracts an ItemStack from the given slot.
- `int getSlots()` — Returns the number of slots available
- `ItemStack getStackInSlot(int slot)` — Returns the ItemStack in a given slot.
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)` — Inserts an ItemStack into the given slot and return the remainder.
- `void setStackInSlot(int slot, ItemStack stack)` — Overrides the stack in the given slot.

## Fields

- `InventoryPlayer inventoryPlayer`