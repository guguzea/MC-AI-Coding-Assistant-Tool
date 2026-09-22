# ContainerWorkbench

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container → net.minecraft.inventory.ContainerWorkbench

## Class signature

```java
public class ContainerWorkbench extends Container
```

## Constructors

- `ContainerWorkbench(InventoryPlayer playerInventory, World worldIn, BlockPos posIn)`

## Methods

- `boolean canInteractWith(EntityPlayer playerIn)`
- `boolean canMergeSlot(ItemStack stack, Slot slotIn)`
- `void onContainerClosed(EntityPlayer playerIn)`
- `void onCraftMatrixChanged(IInventory inventoryIn)`
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)`

## Fields

- `InventoryCrafting craftMatrix`
- `InventoryCraftResult craftResult`