---
title: "GuiConfigEntries.IConfigEntry"
description: "public static interface GuiConfigEntries.IConfigEntry extends GuiListExtended.IGuiListEntry"
package: "net/minecraftforge/fml/client/config"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/client/config/GuiConfigEntries.IConfigEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.IConfigEntry

## Class signature

```java
public static interface GuiConfigEntries.IConfigEntry extends GuiListExtended.IGuiListEntry
```

## Methods

- `void drawToolTip(int mouseX, int mouseY)` — Handles drawing any tooltips that apply to this entry.
- `boolean enabled()` — Is this list entry enabled?
- `IConfigElement getConfigElement()` — Gets the IConfigElement object owned by this entry.
- `java.lang.Object getCurrentValue()` — Gets the current value of this entry.
- `java.lang.Object[] getCurrentValues()` — Gets the current values of this list entry.
- `int getEntryRightBound()` — Gets this entry's right-hand x boundary.
- `int getLabelWidth()` — Gets this entry's label width.
- `java.lang.String getName()` — Gets the name of the ConfigElement owned by this entry.
- `boolean isChanged()` — Has the value of this entry changed?
- `boolean isDefault()` — Is this entry's value equal to the default value?
- `void keyTyped(char eventChar, int eventKey)` — Handles user keystrokes for any GuiTextField objects in this entry.
- `void mouseClicked(int x, int y, int mouseEvent)` — Call GuiTextField.mouseClicked() for and GuiTextField objects in this entry.
- `void onGuiClosed()` — This method is called when the parent GUI is closed.
- `boolean saveConfigElement()` — Handles saving any changes that have been made to this entry back to the underlying object.
- `void setToDefault()` — Sets this entry's value to the default value.
- `void undoChanges()` — Handles reverting any changes that have occurred to this entry.
- `void updateCursorCounter()` — Call GuiTextField.updateCursorCounter() for any GuiTextField objects in this entry.
