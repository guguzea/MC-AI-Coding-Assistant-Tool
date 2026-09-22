# ContainerPlayer

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container → net.minecraft.inventory.ContainerPlayer

## Class signature

```java
public class ContainerPlayer extends Container
```

## Constructors

- `ContainerPlayer(InventoryPlayer playerInventory, boolean localWorld, EntityPlayer player)`

## Methods

- `boolean canInteractWith(EntityPlayer playerIn)`
- `boolean canMergeSlot(ItemStack stack, Slot slotIn)`
- `void onContainerClosed(EntityPlayer playerIn)`
- `void onCraftMatrixChanged(IInventory inventoryIn)`
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)`

## Fields

- `InventoryCrafting craftMatrix`
- `IInventory craftResult`
- `boolean isLocalWorld`