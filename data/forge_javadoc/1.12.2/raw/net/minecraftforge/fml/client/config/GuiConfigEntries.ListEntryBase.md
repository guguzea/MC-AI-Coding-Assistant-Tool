---
title: "GuiConfigEntries.ListEntryBase"
description: "ListEntryBase Provides a base entry for others to extend. Handles drawing the prop label (if drawLabel == true) and the Undo/Default buttons."
package: "net/minecraftforge/fml/client/config"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/client/config/GuiConfigEntries.ListEntryBase.html"
sourceType: javadoc
---

# GuiConfigEntries.ListEntryBase

## Constructors

- `public ListEntryBase( GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement)`

## Methods

- `public void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected, float partial)`
- `public void drawToolTip(int mouseX, int mouseY)`
- `public boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public abstract boolean isDefault()`
- `public abstract void setToDefault()`
- `public abstract void keyTyped(char eventChar, int eventKey)`
- `public abstract void updateCursorCounter()`
- `public abstract void mouseClicked(int x, int y, int mouseEvent)`
- `public abstract boolean isChanged()`
- `public abstract void undoChanges()`
- `public abstract boolean saveConfigElement()`
- `public void updatePosition(int p_178011_1_, int p_178011_2_, int p_178011_3_, float partial)`
- `public boolean enabled()`
- `public int getLabelWidth()`
- `public int getEntryRightBound()`
- `public IConfigElement getConfigElement()`
- `public java.lang.String getName()`
- `public abstract java.lang.Object getCurrentValue()`
- `public abstract java.lang.Object[] getCurrentValues()`
- `public void onGuiClosed()`

## Description

ListEntryBase Provides a base entry for others to extend. Handles drawing the prop label (if drawLabel == true) and the Undo/Default buttons.
