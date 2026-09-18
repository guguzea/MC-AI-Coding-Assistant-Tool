# ContainerPlayer

## Class signature

```java
public class ContainerPlayer extends Container
```

## Constructors

- `public ContainerPlayer( InventoryPlayer playerInventory, boolean localWorld, EntityPlayer player)`

## Methods

- `public void onCraftMatrixChanged( IInventory inventoryIn)`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `public boolean canInteractWith( EntityPlayer playerIn)`
- `@Nullable public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`
- `public boolean canMergeSlot( ItemStack stack, Slot slotIn)`