# GuiRepair

## Class signature

```java
public class GuiRepair extends GuiContainer implements ICrafting
```

## Constructors

- `public GuiRepair( InventoryPlayer inventoryIn, World worldIn)`

## Methods

- `public void initGui()`
- `public void onGuiClosed()`
- `protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)`
- `protected void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)`
- `public void updateCraftingInventory( Container containerToSend, java.util.List< ItemStack > itemsList)`
- `public void sendSlotContents( Container containerToSend, int slotInd, ItemStack stack)`
- `public void sendProgressBarUpdate( Container containerIn, int varToUpdate, int newValue)`
- `public void sendAllWindowProperties( Container p_175173_1_, IInventory p_175173_2_)`

## Description

Args : renderPartialTicks, mouseX, mouseY