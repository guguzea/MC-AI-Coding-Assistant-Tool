---
title: "GuiConfigEntries.ButtonEntry"
description: "public abstract static class GuiConfigEntries.ButtonEntry extends GuiConfigEntries.ListEntryBase"
package: "cpw/mods/fml/client/config"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/GuiConfigEntries.ButtonEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.ButtonEntry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.GuiConfigEntries.ListEntryBase → cpw.mods.fml.client.config.GuiConfigEntries.ButtonEntry

## Class signature

```java
public abstract static class GuiConfigEntries.ButtonEntry extends GuiConfigEntries.ListEntryBase
```

## Constructors

- `ButtonEntry(GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement<?> configElement)`
- `ButtonEntry(GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement<?> configElement, GuiButtonExt button)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, Tessellator tessellator, int mouseX, int mouseY, boolean isSelected)`
- `void keyTyped(char eventChar, int eventKey)` — Handles user keystrokes for any GuiTextField objects in this entry.
- `void mouseClicked(int x, int y, int mouseEvent)` — Call GuiTextField.mouseClicked() for and GuiTextField objects in this entry.
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)` — Returns true if the mouse has been pressed on this control.
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)` — Fired when the mouse button is released.
- `void updateCursorCounter()` — Call GuiTextField.updateCursorCounter() for any GuiTextField objects in this entry.
- `abstract void updateValueButtonText()` — Updates the displayString of the value button.
- `abstract void valueButtonPressed(int slotIndex)` — Called when the value button has been clicked.

## Fields

- `protected GuiButtonExt btnValue`
