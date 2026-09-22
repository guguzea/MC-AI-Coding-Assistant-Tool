# GuiContainerCreative

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.inventory.GuiContainer → net.minecraft.client.renderer.InventoryEffectRenderer → net.minecraft.client.gui.inventory.GuiContainerCreative

## Class signature

```java
public class GuiContainerCreative extends InventoryEffectRenderer
```

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)` — Args : renderPartialTicks, mouseX, mouseY
- `protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)` — Draw the foreground layer for the GuiContainer (everything in front of the items).
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `protected boolean func_147049_a(CreativeTabs p_147049_1_, int p_147049_2_, int p_147049_3_)`
- `protected void func_147051_a(CreativeTabs p_147051_1_)`
- `int getSelectedTabIndex()`
- `protected void handleMouseClick(Slot slotIn, int slotId, int clickedButton, int clickType)` — Called when the mouse is clicked over a slot or outside the gui.
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `protected void mouseReleased(int mouseX, int mouseY, int state)` — Called when a mouse button is released.
- `void onGuiClosed()` — Called when the screen is unloaded.
- `protected boolean renderCreativeInventoryHoveringText(CreativeTabs p_147052_1_, int p_147052_2_, int p_147052_3_)` — Renders the creative inventory hovering text if mouse is over it.
- `protected void renderToolTip(ItemStack stack, int x, int y)`
- `protected void updateActivePotionEffects()`
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `GuiContainerCreative`