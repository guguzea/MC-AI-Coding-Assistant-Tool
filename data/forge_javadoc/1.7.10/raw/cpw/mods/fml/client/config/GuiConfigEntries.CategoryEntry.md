---
title: "GuiConfigEntries.CategoryEntry"
description: "public static class GuiConfigEntries.CategoryEntry extends GuiConfigEntries.ListEntryBase"
package: "cpw/mods/fml/client/config"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/GuiConfigEntries.CategoryEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.CategoryEntry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.GuiConfigEntries.ListEntryBase → cpw.mods.fml.client.config.GuiConfigEntries.CategoryEntry

## Class signature

```java
public static class GuiConfigEntries.CategoryEntry extends GuiConfigEntries.ListEntryBase
```

## Constructors

- `CategoryEntry(GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement)`

## Methods

- `protected GuiScreen buildChildScreen()` — This method is called in the constructor and is used to set the childScreen field.
- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, Tessellator tessellator, int mouseX, int mouseY, boolean isSelected)`
- `void drawToolTip(int mouseX, int mouseY)` — Handles drawing any tooltips that apply to this entry.
- `boolean enabled()` — Is this list entry enabled?
- `java.lang.String getCurrentValue()` — Gets the current value of this entry as a String.
- `java.lang.String[] getCurrentValues()` — Gets the current values of this list entry as a String[].
- `int getEntryRightBound()` — Gets this entry's right-hand x boundary.
- `int getLabelWidth()` — Gets this entry's label width.
- `boolean isChanged()` — Has the value of this entry changed?
- `boolean isDefault()` — Is this entry's value equal to the default value?
- `void keyTyped(char eventChar, int eventKey)` — Handles user keystrokes for any GuiTextField objects in this entry.
- `void mouseClicked(int x, int y, int mouseEvent)` — Call GuiTextField.mouseClicked() for and GuiTextField objects in this entry.
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `boolean saveConfigElement()` — Handles saving any changes that have been made to this entry back to the underlying object.
- `void setToDefault()` — Sets this entry's value to the default value.
- `void undoChanges()` — Handles reverting any changes that have occurred to this entry.
- `void updateCursorCounter()` — Call GuiTextField.updateCursorCounter() for any GuiTextField objects in this entry.

## Fields

- `protected GuiButtonExt btnSelectCategory`
- `protected GuiScreen childScreen`
