---
title: "GuiEditArrayEntries.BaseEntry"
description: "public static class GuiEditArrayEntries.BaseEntry extends java.lang.Object implements GuiEditArrayEntries.IArrayEntry"
package: "net/minecraftforge/fml/client/config"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/client/config/GuiEditArrayEntries.BaseEntry.html"
sourceType: javadoc
---

# GuiEditArrayEntries.BaseEntry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.config.GuiEditArrayEntries.BaseEntry

## Class signature

```java
public static class GuiEditArrayEntries.BaseEntry extends java.lang.Object implements GuiEditArrayEntries.IArrayEntry
```

## Constructors

- `BaseEntry(GuiEditArray owningScreen, GuiEditArrayEntries owningEntryList, IConfigElement configElement)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `void drawToolTip(int mouseX, int mouseY)`
- `java.lang.Object getValue()`
- `boolean isValueSavable()`
- `void keyTyped(char eventChar, int eventKey)`
- `void mouseClicked(int x, int y, int mouseEvent)`
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void setSelected(int p_178011_1_, int p_178011_2_, int p_178011_3_)`
- `void updateCursorCounter()`

## Fields

- `protected GuiButtonExt btnAddNewEntryAbove`
- `protected GuiButtonExt btnRemoveEntry`
- `protected IConfigElement configElement`
- `protected boolean isValidated`
- `protected boolean isValidValue`
- `protected GuiEditArrayEntries owningEntryList`
- `protected GuiEditArray owningScreen`
