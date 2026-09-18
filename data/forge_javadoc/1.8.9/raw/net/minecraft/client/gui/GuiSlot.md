---
title: "GuiSlot"
description: "How far down this slot has been scrolled"
package: "net/minecraft/client/gui"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiSlot.html"
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
- `protected void func_178040_a(int p_178040_1_, int p_178040_2_, int p_178040_3_)`
- `protected abstract void drawSlot(int entryID, int p_180791_2_, int p_180791_3_, int p_180791_4_, int mouseXIn, int mouseYIn)`
- `protected void drawListHeader(int p_148129_1_, int p_148129_2_, Tessellator p_148129_3_)`
- `protected void func_148132_a(int p_148132_1_, int p_148132_2_)`
- `protected void func_148142_b(int p_148142_1_, int p_148142_2_)`
- `public int getSlotIndexFromScreenCoords(int p_148124_1_, int p_148124_2_)`
- `public void registerScrollButtons(int scrollUpButtonIDIn, int scrollDownButtonIDIn)`
- `protected void bindAmountScrolled()`
- `public int func_148135_f()`
- `public int getAmountScrolled()`
- `public boolean isMouseYWithinSlotBounds(int p_148141_1_)`
- `public void scrollBy(int amount)`
- `public void actionPerformed( GuiButton button)`
- `public void drawScreen(int mouseXIn, int mouseYIn, float p_148128_3_)`
- `public void handleMouseInput()`
- `public void setEnabled(boolean enabledIn)`
- `public boolean getEnabled()`
- `public int getListWidth()`
- `protected void drawSelectionBox(int p_148120_1_, int p_148120_2_, int mouseXIn, int mouseYIn)`
- `protected int getScrollBarX()`
- `protected void overlayBackground(int startY, int endY, int startAlpha, int endAlpha)`
- `public void setSlotXBoundsFromLeft(int leftIn)`
- `public int getSlotHeight()`
- `protected void drawContainerBackground( Tessellator tessellator)`

## Description

How far down this slot has been scrolled
