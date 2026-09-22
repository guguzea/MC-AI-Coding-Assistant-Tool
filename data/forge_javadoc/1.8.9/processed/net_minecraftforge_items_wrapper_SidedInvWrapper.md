# SidedInvWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.items.wrapper.SidedInvWrapper

## Class signature

```java
public class SidedInvWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `SidedInvWrapper(ISidedInventory inv, EnumFacing side)`

## Methods

- `boolean equals(java.lang.Object o)`
- `ItemStack extractItem(int slot, int amount, boolean simulate)` — Extracts an ItemStack from the given slot.
- `static int getSlot(ISidedInventory inv, int slot, EnumFacing side)`
- `int getSlots()` — Returns the number of slots available
- `ItemStack getStackInSlot(int slot)` — Returns the ItemStack in a given slot.
- `int hashCode()`
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)` — Inserts an ItemStack into the given slot and return the remainder.
- `void setStackInSlot(int slot, ItemStack stack)` — Overrides the stack in the given slot.

## Fields

- `protected ISidedInventory inv`
- `protected EnumFacing side`