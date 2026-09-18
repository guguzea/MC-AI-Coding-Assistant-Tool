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
- `public void addListener( IContainerListener listener)`
- `public void updateProgressBar(int id, int data)`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `public boolean canInteractWith( EntityPlayer playerIn)`
- `@Nullable public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`
- `public void updateItemName(java.lang.String newName)`