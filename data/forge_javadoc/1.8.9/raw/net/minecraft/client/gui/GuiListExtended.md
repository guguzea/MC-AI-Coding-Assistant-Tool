---
title: "GuiListExtended"
description: "The element in the slot that was clicked, boolean for whether it was double clicked or not"
package: "net/minecraft/client/gui"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiListExtended.html"
sourceType: javadoc
---

# GuiListExtended

## Class signature

```java
public abstract class GuiListExtended extends GuiSlot
```

## Constructors

- `public GuiListExtended( Minecraft mcIn, int widthIn, int heightIn, int topIn, int bottomIn, int slotHeightIn)`

## Methods

- `protected void elementClicked(int slotIndex, boolean isDoubleClick, int mouseX, int mouseY)`
- `protected boolean isSelected(int slotIndex)`
- `protected void drawBackground()`
- `protected void drawSlot(int entryID, int p_180791_2_, int p_180791_3_, int p_180791_4_, int mouseXIn, int mouseYIn)`
- `protected void func_178040_a(int p_178040_1_, int p_178040_2_, int p_178040_3_)`
- `public boolean mouseClicked(int mouseX, int mouseY, int mouseEvent)`
- `public boolean mouseReleased(int p_148181_1_, int p_148181_2_, int p_148181_3_)`
- `public abstract GuiListExtended.IGuiListEntry getListEntry(int index)`

## Description

The element in the slot that was clicked, boolean for whether it was double clicked or not
