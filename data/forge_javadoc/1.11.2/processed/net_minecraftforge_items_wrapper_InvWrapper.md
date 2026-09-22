# InvWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.items.wrapper.InvWrapper

## Class signature

```java
public class InvWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `InvWrapper(IInventory inv)`

## Methods

- `boolean equals(java.lang.Object o)`
- `ItemStack extractItem(int slot, int amount, boolean simulate)` — Extracts an ItemStack from the given slot.
- `IInventory getInv()`
- `int getSlotLimit(int slot)` — Retrieves the maximum stack size allowed to exist in the given slot.
- `int getSlots()` — Returns the number of slots available
- `ItemStack getStackInSlot(int slot)` — Returns the ItemStack in a given slot.
- `int hashCode()`
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)` — Inserts an ItemStack into the given slot and return the remainder.
- `void setStackInSlot(int slot, ItemStack stack)` — Overrides the stack in the given slot.