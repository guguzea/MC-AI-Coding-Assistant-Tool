---
title: "GuiContainer"
description: "public abstract class GuiContainer extends GuiScreen"
package: "net/minecraft/client/gui/inventory"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/gui/inventory/GuiContainer.html"
sourceType: javadoc
---

# GuiContainer

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.inventory.GuiContainer

## Class signature

```java
public abstract class GuiContainer extends GuiScreen
```

## Constructors

- `GuiContainer(Container inventorySlotsIn)`

## Methods

- `protected boolean checkHotbarKeys(int keyCode)`
- `boolean doesGuiPauseGame()`
- `protected abstract void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)`
- `protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `Slot getSlotUnderMouse()` — Returns the slot that is currently displayed under the mouse.
- `protected void handleMouseClick(Slot slotIn, int slotId, int mouseButton, ClickType type)`
- `void initGui()`
- `protected boolean isPointInRegion(int rectX, int rectY, int rectWidth, int rectHeight, int pointX, int pointY)`
- `protected void keyTyped(char typedChar, int keyCode)`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)`
- `protected void mouseClickMove(int mouseX, int mouseY, int clickedMouseButton, long timeSinceLastClick)`
- `protected void mouseReleased(int mouseX, int mouseY, int state)`
- `void onGuiClosed()`
- `void updateScreen()`

## Fields

- `protected boolean dragSplitting`
- `protected java.util.Set<Slot> dragSplittingSlots`
- `protected int guiLeft`
- `protected int guiTop`
- `static ResourceLocation INVENTORY_BACKGROUND`
- `Container inventorySlots`
- `protected int xSize`
- `protected int ySize`
