# GuiDispenser

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.inventory.GuiContainer → net.minecraft.client.gui.inventory.GuiDispenser

## Class signature

```java
public class GuiDispenser extends GuiContainer
```

## Constructors

- `GuiDispenser(InventoryPlayer playerInv, IInventory dispenserInv)`

## Methods

- `protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)` — Args : renderPartialTicks, mouseX, mouseY
- `protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)` — Draw the foreground layer for the GuiContainer (everything in front of the items).

## Fields

- `IInventory dispenserInventory` — The inventory contained within the corresponding Dispenser.