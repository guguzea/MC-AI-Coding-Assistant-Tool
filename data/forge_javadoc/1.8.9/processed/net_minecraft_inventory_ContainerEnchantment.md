# ContainerEnchantment

## Class signature

```java
public class ContainerEnchantment extends Container
```

## Constructors

- `public ContainerEnchantment( InventoryPlayer playerInv, World worldIn)`
- `public ContainerEnchantment( InventoryPlayer playerInv, World worldIn, BlockPos pos)`

## Methods

- `public void onCraftGuiOpened( ICrafting listener)`
- `public void detectAndSendChanges()`
- `public void updateProgressBar(int id, int data)`
- `public void onCraftMatrixChanged( IInventory inventoryIn)`
- `public boolean enchantItem( EntityPlayer playerIn, int id)`
- `public int getLapisAmount()`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `public boolean canInteractWith( EntityPlayer playerIn)`
- `public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`

## Description

3-member array storing the enchantment levels of each slot