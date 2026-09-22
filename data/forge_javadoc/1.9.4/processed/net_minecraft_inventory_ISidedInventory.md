# ISidedInventory

## Class signature

```java
public interface ISidedInventory extends IInventory
```

## Methods

- `boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)`
- `boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)`
- `int[] getSlotsForFace(EnumFacing side)`