---
title: "GuiSlot"
description: "public abstract class GuiSlot extends java.lang.Object"
package: "net/minecraft/client/gui"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/gui/GuiSlot.html"
sourceType: javadoc
---

# GuiSlot

## Class signature

```java
public abstract class GuiSlot extends java.lang.Object
```

## Constructors

- `public GuiSlot( Minecraft mcIn, int width, int height, int topIn, int bottomIn, int slotHeightIn)`

## Methods

- `public void setDimensions(int widthIn, int heightIn, int topIn, int bottomIn)`
- `public void setShowSelectionBox(boolean showSelectionBoxIn)`
- `protected void setHasListHeader(boolean hasListHeaderIn, int headerPaddingIn)`
- `protected abstract int getSize()`
- `protected abstract void elementClicked(int slotIndex, boolean isDoubleClick, int mouseX, int mouseY)`
- `protected abstract boolean isSelected(int slotIndex)`
- `protected int getContentHeight()`
- `protected abstract void drawBackground()`
- `protected void updateItemPos(int entryID, int insideLeft, int yPos)`
- `protected abstract void drawSlot(int entryID, int insideLeft, int yPos, int insideSlotHeight, int mouseXIn, int mouseYIn)`
- `protected void drawListHeader(int insideLeft, int insideTop, Tessellator tessellatorIn)`
- `protected void clickedHeader(int p_148132_1_, int p_148132_2_)`
- `protected void renderDecorations(int mouseXIn, int mouseYIn)`
- `public int getSlotIndexFromScreenCoords(int posX, int posY)`
- `public void registerScrollButtons(int scrollUpButtonIDIn, int scrollDownButtonIDIn)`
- `protected void bindAmountScrolled()`
- `public int getMaxScroll()`
- `public int getAmountScrolled()`
- `public boolean isMouseYWithinSlotBounds(int p_148141_1_)`
- `public void scrollBy(int amount)`
- `public void actionPerformed( GuiButton button)`
- `public void drawScreen(int mouseXIn, int mouseYIn, float partialTicks)`
- `public void handleMouseInput()`
- `public void setEnabled(boolean enabledIn)`
- `public boolean getEnabled()`
- `public int getListWidth()`
- `protected void drawSelectionBox(int insideLeft, int insideTop, int mouseXIn, int mouseYIn)`
- `protected int getScrollBarX()`
- `protected void overlayBackground(int startY, int endY, int startAlpha, int endAlpha)`
- `public void setSlotXBoundsFromLeft(int leftIn)`
- `public int getSlotHeight()`
- `protected void drawContainerBackground( Tessellator tessellator)`
