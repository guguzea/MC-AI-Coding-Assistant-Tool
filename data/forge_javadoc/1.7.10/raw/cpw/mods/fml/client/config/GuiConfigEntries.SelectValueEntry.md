---
title: "GuiConfigEntries.SelectValueEntry"
description: "public static class GuiConfigEntries.SelectValueEntry extends GuiConfigEntries.ButtonEntry"
package: "cpw/mods/fml/client/config"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/GuiConfigEntries.SelectValueEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.SelectValueEntry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.GuiConfigEntries.ListEntryBase → cpw.mods.fml.client.config.GuiConfigEntries.ButtonEntry → cpw.mods.fml.client.config.GuiConfigEntries.SelectValueEntry

## Class signature

```java
public static class GuiConfigEntries.SelectValueEntry extends GuiConfigEntries.ButtonEntry
```

## Constructors

- `SelectValueEntry(GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement<java.lang.String> configElement, java.util.Map<java.lang.Object, java.lang.String> selectableValues)`

## Methods

- `java.lang.String getCurrentValue()` — Gets the current value of this entry as a String.
- `java.lang.String[] getCurrentValues()` — Gets the current values of this list entry as a String[].
- `boolean isChanged()` — Has the value of this entry changed?
- `boolean isDefault()` — Is this entry's value equal to the default value?
- `boolean saveConfigElement()` — Handles saving any changes that have been made to this entry back to the underlying object.
- `void setToDefault()` — Sets this entry's value to the default value.
- `void setValueFromChildScreen(java.lang.Object newValue)`
- `void undoChanges()` — Handles reverting any changes that have occurred to this entry.
- `void updateValueButtonText()` — Updates the displayString of the value button.
- `void valueButtonPressed(int slotIndex)` — Called when the value button has been clicked.

## Fields

- `protected java.lang.String beforeValue`
- `protected java.lang.Object currentValue`
- `protected java.util.Map<java.lang.Object, java.lang.String> selectableValues`
