---
title: "GuiConfigEntries.StringEntry"
description: "public static class GuiConfigEntries.StringEntry extends GuiConfigEntries.ListEntryBase"
package: "net/minecraftforge/fml/client/config"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/client/config/GuiConfigEntries.StringEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.StringEntry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.config.GuiConfigEntries.ListEntryBase → net.minecraftforge.fml.client.config.GuiConfigEntries.StringEntry

## Class signature

```java
public static class GuiConfigEntries.StringEntry extends GuiConfigEntries.ListEntryBase
```

## Constructors

- `StringEntry(GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `java.lang.Object getCurrentValue()` — Gets the current value of this entry.
- `java.lang.Object[] getCurrentValues()` — Gets the current values of this list entry.
- `boolean isChanged()` — Has the value of this entry changed?
- `boolean isDefault()` — Is this entry's value equal to the default value?
- `void keyTyped(char eventChar, int eventKey)` — Handles user keystrokes for any GuiTextField objects in this entry.
- `void mouseClicked(int x, int y, int mouseEvent)` — Call GuiTextField.mouseClicked(int, int, int) for and GuiTextField objects in this entry.
- `boolean saveConfigElement()` — Handles saving any changes that have been made to this entry back to the underlying object.
- `void setToDefault()` — Sets this entry's value to the default value.
- `void undoChanges()` — Handles reverting any changes that have occurred to this entry.
- `void updateCursorCounter()` — Call GuiTextField.updateCursorCounter() for any GuiTextField objects in this entry.

## Fields

- `protected java.lang.String beforeValue`
- `protected GuiTextField textFieldValue`
