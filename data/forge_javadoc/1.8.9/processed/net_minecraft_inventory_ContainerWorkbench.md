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
- `boolean canMergeSlot(ItemStack stack, Slot p_94530_2_)` — Called to determine if the current slot is valid for the stack merging (double-click) code.
- `void onContainerClosed(EntityPlayer playerIn)` — Called when the container is closed.
- `void onCraftMatrixChanged(IInventory inventoryIn)` — Callback for when the crafting matrix is changed.
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)` — Take a stack from the specified inventory slot.

## Fields

- `InventoryCrafting craftMatrix` — The crafting matrix inventory (3x3).
- `IInventory craftResult`