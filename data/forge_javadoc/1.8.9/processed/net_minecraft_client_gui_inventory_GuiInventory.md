# GuiInventory

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.inventory.GuiContainer → net.minecraft.client.renderer.InventoryEffectRenderer → net.minecraft.client.gui.inventory.GuiInventory

## Class signature

```java
public class GuiInventory extends InventoryEffectRenderer
```

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `static void drawEntityOnScreen(int posX, int posY, int scale, float mouseX, float mouseY, EntityLivingBase ent)` — Draws the entity to the screen.
- `protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)` — Args : renderPartialTicks, mouseX, mouseY
- `protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)` — Draw the foreground layer for the GuiContainer (everything in front of the items).
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `GuiInventory`