# IContainerListener

## Class signature

```java
public interface IContainerListener
```

## Methods

- `void sendAllWindowProperties(Container containerIn, IInventory inventory)`
- `void sendProgressBarUpdate(Container containerIn, int varToUpdate, int newValue)`
- `void sendSlotContents(Container containerToSend, int slotInd, ItemStack stack)`
- `void updateCraftingInventory(Container containerToSend, NonNullList<ItemStack> itemsList)`