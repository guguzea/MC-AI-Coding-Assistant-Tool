---
title: "GuiSlot"
description: "public abstract class GuiSlot extends java.lang.Object"
package: "net/minecraft/client/gui"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/gui/GuiSlot.html"
sourceType: javadoc
---

# GuiSlot

**Inheritance:** java.lang.Object → net.minecraft.client.gui.GuiSlot

## Class signature

```java
public abstract class GuiSlot extends java.lang.Object
```

## Constructors

- `GuiSlot(Minecraft mcIn, int width, int height, int topIn, int bottomIn, int slotHeightIn)`

## Methods

- `void actionPerformed(GuiButton button)`
- `protected void bindAmountScrolled()`
- `protected void clickedHeader(int p_148132_1_, int p_148132_2_)`
- `protected abstract void drawBackground()`
- `protected void drawContainerBackground(Tessellator tessellator)`
- `protected void drawListHeader(int insideLeft, int insideTop, Tessellator tessellatorIn)`
- `void drawScreen(int mouseXIn, int mouseYIn, float partialTicks)`
- `protected void drawSelectionBox(int insideLeft, int insideTop, int mouseXIn, int mouseYIn)`
- `protected abstract void drawSlot(int entryID, int insideLeft, int yPos, int insideSlotHeight, int mouseXIn, int mouseYIn)`
- `protected abstract void elementClicked(int slotIndex, boolean isDoubleClick, int mouseX, int mouseY)`
- `int getAmountScrolled()`
- `protected int getContentHeight()`
- `boolean getEnabled()`
- `int getListWidth()`
- `int getMaxScroll()`
- `protected int getScrollBarX()`
- `protected abstract int getSize()`
- `int getSlotHeight()`
- `int getSlotIndexFromScreenCoords(int posX, int posY)`
- `void handleMouseInput()`
- `boolean isMouseYWithinSlotBounds(int p_148141_1_)`
- `protected abstract boolean isSelected(int slotIndex)`
- `protected void overlayBackground(int startY, int endY, int startAlpha, int endAlpha)`
- `void registerScrollButtons(int scrollUpButtonIDIn, int scrollDownButtonIDIn)`
- `protected void renderDecorations(int mouseXIn, int mouseYIn)`
- `void scrollBy(int amount)`
- `void setDimensions(int widthIn, int heightIn, int topIn, int bottomIn)`
- `void setEnabled(boolean enabledIn)`
- `protected void setHasListHeader(boolean hasListHeaderIn, int headerPaddingIn)`
- `void setShowSelectionBox(boolean showSelectionBoxIn)`
- `void setSlotXBoundsFromLeft(int leftIn)`
- `protected void updateItemPos(int entryID, int insideLeft, int yPos)`

## Fields

- `protected float amountScrolled`
- `int bottom`
- `protected boolean centerListVertically`
- `protected boolean hasListHeader`
- `int headerPadding`
- `int height`
- `protected int initialClickY`
- `protected long lastClicked`
- `int left`
- `protected Minecraft mc`
- `protected int mouseX`
- `protected int mouseY`
- `int right`
- `protected float scrollMultiplier`
- `protected int selectedElement`
- `protected boolean showSelectionBox`
- `int slotHeight`
- `int top`
- `protected boolean visible`
- `int width`
