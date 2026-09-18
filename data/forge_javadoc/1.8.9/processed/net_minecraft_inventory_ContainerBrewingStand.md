# ContainerBrewingStand

## Class signature

```java
public class ContainerBrewingStand extends Container
```

## Constructors

- `public ContainerBrewingStand( InventoryPlayer playerInventory, IInventory tileBrewingStandIn)`

## Methods

- `public void onCraftGuiOpened( ICrafting listener)`
- `public void detectAndSendChanges()`
- `public void updateProgressBar(int id, int data)`
- `public boolean canInteractWith( EntityPlayer playerIn)`
- `public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`

## Description

Looks for changes made in the container, sends them to every listener.