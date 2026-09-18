# ISidedInventory

## Class signature

```java
public interface ISidedInventory extends IInventory
```

## Methods

- `int[] getSlotsForFace( EnumFacing side)`
- `boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)`
- `boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)`

## Description

Returns true if automation can extract the given item in the given slot from the given side.