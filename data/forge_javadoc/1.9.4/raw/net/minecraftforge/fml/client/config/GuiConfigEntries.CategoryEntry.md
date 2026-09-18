---
title: "GuiConfigEntries.CategoryEntry"
description: "CategoryEntry Provides an entry that consists of a GuiButton for navigating to the child category GuiConfig screen."
package: "net/minecraftforge/fml/client/config"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/client/config/GuiConfigEntries.CategoryEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.CategoryEntry

## Constructors

- `public CategoryEntry( GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement)`

## Methods

- `protected GuiScreen buildChildScreen()`
- `public void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `public void drawToolTip(int mouseX, int mouseY)`
- `public boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public boolean isDefault()`
- `public void setToDefault()`
- `public void keyTyped(char eventChar, int eventKey)`
- `public void updateCursorCounter()`
- `public void mouseClicked(int x, int y, int mouseEvent)`
- `public boolean saveConfigElement()`
- `public boolean isChanged()`
- `public void undoChanges()`
- `public boolean enabled()`
- `public int getLabelWidth()`
- `public int getEntryRightBound()`
- `public java.lang.String getCurrentValue()`
- `public java.lang.String[] getCurrentValues()`

## Description

CategoryEntry Provides an entry that consists of a GuiButton for navigating to the child category GuiConfig screen.
