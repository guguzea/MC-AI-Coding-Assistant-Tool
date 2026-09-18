---
title: "GuiEditArrayEntries.BaseEntry"
description: ""
package: "net/minecraftforge/fml/client/config"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/client/config/GuiEditArrayEntries.BaseEntry.html"
sourceType: javadoc
---

# GuiEditArrayEntries.BaseEntry

## Constructors

- `public BaseEntry( GuiEditArray owningScreen, GuiEditArrayEntries owningEntryList, IConfigElement configElement)`

## Methods

- `public void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `public void drawToolTip(int mouseX, int mouseY)`
- `public boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public void keyTyped(char eventChar, int eventKey)`
- `public void updateCursorCounter()`
- `public void mouseClicked(int x, int y, int mouseEvent)`
- `public boolean isValueSavable()`
- `public java.lang.Object getValue()`
- `public void setSelected(int p_178011_1_, int p_178011_2_, int p_178011_3_)`
