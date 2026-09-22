# ISidedInventory

## Class signature

```java
public interface ISidedInventory extends IInventory
```

## Methods

- `boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)` — Returns true if automation can extract the given item in the given slot from the given side.
- `boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)` — Returns true if automation can insert the given item in the given slot from the given side.
- `int[] getSlotsForFace(EnumFacing side)`