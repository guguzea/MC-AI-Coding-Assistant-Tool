# ContainerRepair

## Class signature

```java
public class ContainerRepair extends Container
```

## Constructors

- `public ContainerRepair( InventoryPlayer playerInventory, World worldIn, EntityPlayer player)`
- `public ContainerRepair( InventoryPlayer playerInventory, World worldIn, BlockPos blockPosIn, EntityPlayer player)`

## Methods

- `public void onCraftMatrixChanged( IInventory inventoryIn)`
- `public void updateRepairOutput()`
- `public void onCraftGuiOpened( ICrafting listener)`
- `public void updateProgressBar(int id, int data)`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `public boolean canInteractWith( EntityPlayer playerIn)`
- `public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`
- `public void updateItemName(java.lang.String newName)`

## Description

determined by damage of input item and stackSize of repair materials