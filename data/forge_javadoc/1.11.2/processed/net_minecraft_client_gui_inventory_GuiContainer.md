# GuiContainer

## Class signature

```java
public abstract class GuiContainer extends GuiScreen
```

## Constructors

- `public GuiContainer( Container inventorySlotsIn)`

## Methods

- `public void initGui()`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)`
- `protected abstract void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `protected void mouseClickMove(int mouseX, int mouseY, int clickedMouseButton, long timeSinceLastClick)`
- `protected void mouseReleased(int mouseX, int mouseY, int state)`
- `protected boolean isPointInRegion(int rectX, int rectY, int rectWidth, int rectHeight, int pointX, int pointY)`
- `protected void handleMouseClick( Slot slotIn, int slotId, int mouseButton, ClickType type)`
- `protected void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `protected boolean checkHotbarKeys(int keyCode)`
- `public void onGuiClosed()`
- `public boolean doesGuiPauseGame()`
- `public void updateScreen()`
- `@Nullable public Slot getSlotUnderMouse()`
- `public int getGuiLeft()`
- `public int getGuiTop()`
- `public int getXSize()`
- `public int getYSize()`

## Description

Returns the slot that is currently displayed under the mouse.