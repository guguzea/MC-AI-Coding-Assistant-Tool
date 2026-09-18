---
title: "GuiListExtended"
description: "public abstract class GuiListExtended extends GuiSlot"
package: "net/minecraft/client/gui"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/gui/GuiListExtended.html"
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
- `protected void drawSlot(int entryID, int insideLeft, int yPos, int insideSlotHeight, int mouseXIn, int mouseYIn)`
- `protected void updateItemPos(int entryID, int insideLeft, int yPos)`
- `public boolean mouseClicked(int mouseX, int mouseY, int mouseEvent)`
- `public boolean mouseReleased(int p_148181_1_, int p_148181_2_, int p_148181_3_)`
- `public abstract GuiListExtended.IGuiListEntry getListEntry(int index)`
