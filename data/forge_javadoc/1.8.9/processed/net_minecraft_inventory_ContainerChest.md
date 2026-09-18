# ContainerChest

## Class signature

```java
public class ContainerChest extends Container
```

## Constructors

- `public ContainerChest( IInventory playerInventory, IInventory chestInventory, EntityPlayer player)`

## Methods

- `public boolean canInteractWith( EntityPlayer playerIn)`
- `public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `public IInventory getLowerChestInventory()`

## Description

Return this chest container's lower chest inventory.