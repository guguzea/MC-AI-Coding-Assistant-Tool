---
title: "GuiConfigEntries.CycleValueEntry"
description: "public static class GuiConfigEntries.CycleValueEntry extends GuiConfigEntries.ButtonEntry"
package: "cpw/mods/fml/client/config"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/GuiConfigEntries.CycleValueEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.CycleValueEntry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.GuiConfigEntries.ListEntryBase → cpw.mods.fml.client.config.GuiConfigEntries.ButtonEntry → cpw.mods.fml.client.config.GuiConfigEntries.CycleValueEntry

## Class signature

```java
public static class GuiConfigEntries.CycleValueEntry extends GuiConfigEntries.ButtonEntry
```

## Methods

- `java.lang.String getCurrentValue()` — Gets the current value of this entry as a String.
- `java.lang.String[] getCurrentValues()` — Gets the current values of this list entry as a String[].
- `boolean isChanged()` — Has the value of this entry changed?
- `boolean isDefault()` — Is this entry's value equal to the default value?
- `boolean saveConfigElement()` — Handles saving any changes that have been made to this entry back to the underlying object.
- `void setToDefault()` — Sets this entry's value to the default value.
- `void undoChanges()` — Handles reverting any changes that have occurred to this entry.
- `void updateValueButtonText()` — Updates the displayString of the value button.
- `void valueButtonPressed(int slotIndex)` — Called when the value button has been clicked.

## Fields

- `protected int beforeIndex`
- `protected int currentIndex`
- `protected int defaultIndex`
