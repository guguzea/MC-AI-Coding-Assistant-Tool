# GuiBeacon

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.inventory.GuiContainer → net.minecraft.client.gui.inventory.GuiBeacon

## Class signature

```java
public class GuiBeacon extends GuiContainer
```

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)` — Args : renderPartialTicks, mouseX, mouseY
- `protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)` — Draw the foreground layer for the GuiContainer (everything in front of the items).
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `GuiBeacon`