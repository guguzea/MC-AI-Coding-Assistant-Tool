# GuiContainer

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.inventory.GuiContainer

## Class signature

```java
public abstract class GuiContainer extends GuiScreen
```

## Constructors

- `GuiContainer(Container inventorySlotsIn)`

## Methods

- `protected boolean checkHotbarKeys(int keyCode)` — This function is what controls the hotbar shortcut check when you press a number key when hovering a stack.
- `boolean doesGuiPauseGame()` — Returns true if this GUI should pause the game when it is displayed in single-player
- `protected abstract void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)` — Args : renderPartialTicks, mouseX, mouseY
- `protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)` — Draw the foreground layer for the GuiContainer (everything in front of the items).
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `Slot getSlotUnderMouse()` — Returns the slot that is currently displayed under the mouse.
- `protected void handleMouseClick(Slot slotIn, int slotId, int clickedButton, int clickType)` — Called when the mouse is clicked over a slot or outside the gui.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected boolean isPointInRegion(int left, int top, int right, int bottom, int pointX, int pointY)` — Test if the 2D point is in a rectangle (relative to the GUI).
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `protected void mouseClickMove(int mouseX, int mouseY, int clickedMouseButton, long timeSinceLastClick)` — Called when a mouse button is pressed and the mouse is moved around.
- `protected void mouseReleased(int mouseX, int mouseY, int state)` — Called when a mouse button is released.
- `void onGuiClosed()` — Called when the screen is unloaded.
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `protected boolean dragSplitting`
- `protected java.util.Set<Slot> dragSplittingSlots`
- `protected int guiLeft` — Starting X position for the Gui.
- `protected int guiTop` — Starting Y position for the Gui.
- `protected static ResourceLocation inventoryBackground` — The location of the inventory background texture
- `Container inventorySlots` — A list of the players inventory slots
- `protected int xSize` — The X size of the inventory window in pixels.
- `protected int ySize` — The Y size of the inventory window in pixels.