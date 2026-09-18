# CreativeCrafting

## Class signature

```java
public class CreativeCrafting extends java.lang.Object implements IContainerListener
```

## Constructors

- `public CreativeCrafting( Minecraft mc)`

## Methods

- `public void updateCraftingInventory( Container containerToSend, java.util.List< ItemStack > itemsList)`
- `public void sendSlotContents( Container containerToSend, int slotInd, ItemStack stack)`
- `public void sendProgressBarUpdate( Container containerIn, int varToUpdate, int newValue)`
- `public void sendAllWindowProperties( Container containerIn, IInventory inventory)`