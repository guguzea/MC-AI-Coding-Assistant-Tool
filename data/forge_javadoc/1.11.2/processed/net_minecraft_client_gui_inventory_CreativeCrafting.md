# CreativeCrafting

**Inheritance:** java.lang.Object → net.minecraft.client.gui.inventory.CreativeCrafting

## Class signature

```java
public class CreativeCrafting extends java.lang.Object implements IContainerListener
```

## Constructors

- `CreativeCrafting(Minecraft mc)`

## Methods

- `void sendAllWindowProperties(Container containerIn, IInventory inventory)`
- `void sendProgressBarUpdate(Container containerIn, int varToUpdate, int newValue)`
- `void sendSlotContents(Container containerToSend, int slotInd, ItemStack stack)`
- `void updateCraftingInventory(Container containerToSend, NonNullList<ItemStack> itemsList)`