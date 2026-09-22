# IContainerListener

## Class signature

```java
public interface IContainerListener
```

## Methods

- `void sendAllContents(Container containerToSend, NonNullList<ItemStack> itemsList)`
- `void sendAllWindowProperties(Container containerIn, IInventory inventory)`
- `void sendSlotContents(Container containerToSend, int slotInd, ItemStack stack)`
- `void sendWindowProperty(Container containerIn, int varToUpdate, int newValue)`