# ContainerMerchant

## Class signature

```java
public class ContainerMerchant extends Container
```

## Constructors

- `public ContainerMerchant( InventoryPlayer playerInventory, IMerchant merchant, World worldIn)`

## Methods

- `public InventoryMerchant getMerchantInventory()`
- `public void onCraftGuiOpened( ICrafting listener)`
- `public void detectAndSendChanges()`
- `public void onCraftMatrixChanged( IInventory inventoryIn)`
- `public void setCurrentRecipeIndex(int currentRecipeIndex)`
- `public void updateProgressBar(int id, int data)`
- `public boolean canInteractWith( EntityPlayer playerIn)`
- `public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`
- `public void onContainerClosed( EntityPlayer playerIn)`

## Description

Looks for changes made in the container, sends them to every listener.