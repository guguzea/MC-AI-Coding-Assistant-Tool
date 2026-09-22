---
title: "GuiConfigEntries.ButtonEntry"
description: "public abstract static class GuiConfigEntries.ButtonEntry extends GuiConfigEntries.ListEntryBase"
package: "net/minecraftforge/fml/client/config"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/client/config/GuiConfigEntries.ButtonEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.ButtonEntry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.config.GuiConfigEntries.ListEntryBase → net.minecraftforge.fml.client.config.GuiConfigEntries.ButtonEntry

## Class signature

```java
public abstract static class GuiConfigEntries.ButtonEntry extends GuiConfigEntries.ListEntryBase
```

## Constructors

- `ButtonEntry(GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement)`
- `ButtonEntry(GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement, GuiButtonExt button)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `void keyTyped(char eventChar, int eventKey)` — Handles user keystrokes for any GuiTextField objects in this entry.
- `void mouseClicked(int x, int y, int mouseEvent)` — Call GuiTextField.mouseClicked(int, int, int) for and GuiTextField objects in this entry.
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)` — Returns true if the mouse has been pressed on this control.
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)` — Fired when the mouse button is released.
- `void updateCursorCounter()` — Call GuiTextField.updateCursorCounter() for any GuiTextField objects in this entry.
- `abstract void updateValueButtonText()` — Updates the displayString of the value button.
- `abstract void valueButtonPressed(int slotIndex)` — Called when the value button has been clicked.

## Fields

- `protected GuiButtonExt btnValue`
