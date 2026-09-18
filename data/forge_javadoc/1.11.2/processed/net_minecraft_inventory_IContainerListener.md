# IContainerListener

## Class signature

```java
public interface IContainerListener
```

## Methods

- `void updateCraftingInventory( Container containerToSend, NonNullList < ItemStack > itemsList)`
- `void sendSlotContents( Container containerToSend, int slotInd, ItemStack stack)`
- `void sendProgressBarUpdate( Container containerIn, int varToUpdate, int newValue)`
- `void sendAllWindowProperties( Container containerIn, IInventory inventory)`