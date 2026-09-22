---
title: "GuiConfigEntries.IntegerEntry"
description: "public static class GuiConfigEntries.IntegerEntry extends GuiConfigEntries.StringEntry"
package: "cpw/mods/fml/client/config"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/GuiConfigEntries.IntegerEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.IntegerEntry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.GuiConfigEntries.ListEntryBase → cpw.mods.fml.client.config.GuiConfigEntries.StringEntry → cpw.mods.fml.client.config.GuiConfigEntries.IntegerEntry

## Class signature

```java
public static class GuiConfigEntries.IntegerEntry extends GuiConfigEntries.StringEntry
```

## Constructors

- `IntegerEntry(GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement)`

## Methods

- `boolean isChanged()` — Has the value of this entry changed?
- `void keyTyped(char eventChar, int eventKey)` — Handles user keystrokes for any GuiTextField objects in this entry.
- `boolean saveConfigElement()` — Handles saving any changes that have been made to this entry back to the underlying object.
- `void undoChanges()` — Handles reverting any changes that have occurred to this entry.

## Fields

- `protected int beforeValue`
