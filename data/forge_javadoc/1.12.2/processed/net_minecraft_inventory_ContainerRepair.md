# ContainerRepair

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container → net.minecraft.inventory.ContainerRepair

## Class signature

```java
public class ContainerRepair extends Container
```

## Constructors

- `ContainerRepair(InventoryPlayer playerInventory, World worldIn, BlockPos blockPosIn, EntityPlayer player)`
- `ContainerRepair(InventoryPlayer playerInventory, World worldIn, EntityPlayer player)`

## Methods

- `void addListener(IContainerListener listener)`
- `boolean canInteractWith(EntityPlayer playerIn)`
- `void onContainerClosed(EntityPlayer playerIn)`
- `void onCraftMatrixChanged(IInventory inventoryIn)`
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)`
- `void updateItemName(java.lang.String newName)`
- `void updateProgressBar(int id, int data)`
- `void updateRepairOutput()`

## Fields

- `int materialCost`
- `int maximumCost`