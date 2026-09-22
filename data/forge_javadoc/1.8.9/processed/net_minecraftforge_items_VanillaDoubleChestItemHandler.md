# VanillaDoubleChestItemHandler

**Inheritance:** java.lang.Object → java.lang.ref.Reference<T> → java.lang.ref.WeakReference<TileEntityChest> → net.minecraftforge.items.VanillaDoubleChestItemHandler

## Class signature

```java
public class VanillaDoubleChestItemHandler extends java.lang.ref.WeakReference<TileEntityChest> implements IItemHandler
```

## Constructors

- `VanillaDoubleChestItemHandler(TileEntityChest mainChest, TileEntityChest other, boolean mainChestIsUpper)`

## Methods

- `boolean equals(java.lang.Object o)`
- `ItemStack extractItem(int slot, int amount, boolean simulate)` — Extracts an ItemStack from the given slot.
- `static VanillaDoubleChestItemHandler get(TileEntityChest chest)`
- `TileEntityChest getChest(boolean accessingUpper)`
- `int getSlots()` — Returns the number of slots available
- `ItemStack getStackInSlot(int slot)` — Returns the ItemStack in a given slot.
- `int hashCode()`
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)` — Inserts an ItemStack into the given slot and return the remainder.
- `boolean needsRefresh()`

## Fields

- `static VanillaDoubleChestItemHandler NO_ADJACENT_CHESTS_INSTANCE`