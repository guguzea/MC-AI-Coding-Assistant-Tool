# CreativeCrafting

**Inheritance:** java.lang.Object → net.minecraft.client.gui.inventory.CreativeCrafting

## Class signature

```java
public class CreativeCrafting extends java.lang.Object implements ICrafting
```

## Constructors

- `CreativeCrafting(Minecraft mc)`

## Methods

- `void sendAllWindowProperties(Container p_175173_1_, IInventory p_175173_2_)`
- `void sendProgressBarUpdate(Container containerIn, int varToUpdate, int newValue)` — Sends two ints to the client-side Container.
- `void sendSlotContents(Container containerToSend, int slotInd, ItemStack stack)` — Sends the contents of an inventory slot to the client-side Container.
- `void updateCraftingInventory(Container containerToSend, java.util.List<ItemStack> itemsList)` — update the crafting window inventory with the items in the list