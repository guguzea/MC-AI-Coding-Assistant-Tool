---
title: "GuiConfigEntries.BooleanEntry"
description: "public static class GuiConfigEntries.BooleanEntry extends GuiConfigEntries.ButtonEntry"
package: "net/minecraftforge/fml/client/config"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/client/config/GuiConfigEntries.BooleanEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.BooleanEntry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.config.GuiConfigEntries.ListEntryBase → net.minecraftforge.fml.client.config.GuiConfigEntries.ButtonEntry → net.minecraftforge.fml.client.config.GuiConfigEntries.BooleanEntry

## Class signature

```java
public static class GuiConfigEntries.BooleanEntry extends GuiConfigEntries.ButtonEntry
```

## Methods

- `java.lang.Boolean getCurrentValue()` — Gets the current value of this entry.
- `java.lang.Boolean[] getCurrentValues()` — Gets the current values of this list entry.
- `boolean isChanged()` — Has the value of this entry changed?
- `boolean isDefault()` — Is this entry's value equal to the default value?
- `boolean saveConfigElement()` — Handles saving any changes that have been made to this entry back to the underlying object.
- `void setToDefault()` — Sets this entry's value to the default value.
- `void undoChanges()` — Handles reverting any changes that have occurred to this entry.
- `void updateValueButtonText()` — Updates the displayString of the value button.
- `void valueButtonPressed(int slotIndex)` — Called when the value button has been clicked.

## Fields

- `protected boolean beforeValue`
- `protected boolean currentValue`
