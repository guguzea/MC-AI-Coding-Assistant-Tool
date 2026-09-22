---
title: "GuiSelectStringEntries.ListEntry"
description: "public static class GuiSelectStringEntries.ListEntry extends java.lang.Object implements GuiSelectStringEntries.IGuiSelectStringListEntry"
package: "net/minecraftforge/fml/client/config"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/client/config/GuiSelectStringEntries.ListEntry.html"
sourceType: javadoc
---

# GuiSelectStringEntries.ListEntry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.config.GuiSelectStringEntries.ListEntry

## Class signature

```java
public static class GuiSelectStringEntries.ListEntry extends java.lang.Object implements GuiSelectStringEntries.IGuiSelectStringListEntry
```

## Constructors

- `ListEntry(GuiSelectStringEntries owningList, java.util.Map.Entry<java.lang.Object, java.lang.String> value)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `java.lang.Object getValue()`
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)` — Returns true if the mouse has been pressed on this control.
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)` — Fired when the mouse button is released.
- `void setSelected(int p_178011_1_, int p_178011_2_, int p_178011_3_)`

## Fields

- `protected GuiSelectStringEntries owningList`
- `protected java.util.Map.Entry<java.lang.Object, java.lang.String> value`
