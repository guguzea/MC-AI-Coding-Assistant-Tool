---
title: "GuiEditArrayEntries.BaseEntry"
description: "public static class GuiEditArrayEntries.BaseEntry extends java.lang.Object implements GuiEditArrayEntries.IArrayEntry"
package: "cpw/mods/fml/client/config"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/GuiEditArrayEntries.BaseEntry.html"
sourceType: javadoc
---

# GuiEditArrayEntries.BaseEntry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.GuiEditArrayEntries.BaseEntry

## Class signature

```java
public static class GuiEditArrayEntries.BaseEntry extends java.lang.Object implements GuiEditArrayEntries.IArrayEntry
```

## Constructors

- `BaseEntry(GuiEditArray owningScreen, GuiEditArrayEntries owningEntryList, IConfigElement configElement)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, Tessellator tessellator, int mouseX, int mouseY, boolean isSelected)`
- `void drawToolTip(int mouseX, int mouseY)`
- `java.lang.Object getValue()`
- `boolean isValueSavable()`
- `void keyTyped(char eventChar, int eventKey)`
- `void mouseClicked(int x, int y, int mouseEvent)`
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void updateCursorCounter()`

## Fields

- `protected GuiButtonExt btnAddNewEntryAbove`
- `protected GuiButtonExt btnRemoveEntry`
- `protected IConfigElement configElement`
- `protected boolean isValidated`
- `protected boolean isValidValue`
- `protected GuiEditArrayEntries owningEntryList`
- `protected GuiEditArray owningScreen`
