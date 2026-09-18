---
title: "GuiEditArrayEntries.BaseEntry"
description: ""
package: "cpw/mods/fml/client/config"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/GuiEditArrayEntries.BaseEntry.html"
sourceType: javadoc
---

# GuiEditArrayEntries.BaseEntry

## Constructors

- `public BaseEntry( GuiEditArray owningScreen, GuiEditArrayEntries owningEntryList, IConfigElement configElement)`

## Methods

- `public void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, Tessellator tessellator, int mouseX, int mouseY, boolean isSelected)`
- `public void drawToolTip(int mouseX, int mouseY)`
- `public boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public void keyTyped(char eventChar, int eventKey)`
- `public void updateCursorCounter()`
- `public void mouseClicked(int x, int y, int mouseEvent)`
- `public boolean isValueSavable()`
- `public java.lang.Object getValue()`
