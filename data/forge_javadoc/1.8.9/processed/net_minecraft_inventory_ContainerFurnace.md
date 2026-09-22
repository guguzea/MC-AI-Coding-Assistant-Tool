# ContainerFurnace

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container → net.minecraft.inventory.ContainerFurnace

## Class signature

```java
public class ContainerFurnace extends Container
```

## Methods

- `boolean canInteractWith(EntityPlayer playerIn)`
- `void detectAndSendChanges()` — Looks for changes made in the container, sends them to every listener.
- `void onCraftGuiOpened(ICrafting listener)`
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)` — Take a stack from the specified inventory slot.
- `void updateProgressBar(int id, int data)`

## Fields

- `ContainerFurnace`