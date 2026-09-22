---
title: "GuiSelectStringEntries.ListEntry"
description: "public static class GuiSelectStringEntries.ListEntry extends java.lang.Object implements GuiSelectStringEntries.IGuiSelectStringListEntry"
package: "net/minecraftforge/fml/client/config"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/client/config/GuiSelectStringEntries.ListEntry.html"
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
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void setSelected(int p_178011_1_, int p_178011_2_, int p_178011_3_)`

## Fields

- `protected GuiSelectStringEntries owningList`
- `protected java.util.Map.Entry<java.lang.Object, java.lang.String> value`
