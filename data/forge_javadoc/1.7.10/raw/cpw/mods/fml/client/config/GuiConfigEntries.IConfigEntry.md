---
title: "GuiConfigEntries.IConfigEntry"
description: "Provides an interface for defining GuiPropertyList.listEntry objects."
package: "cpw/mods/fml/client/config"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/GuiConfigEntries.IConfigEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.IConfigEntry

## Methods

- `IConfigElement getConfigElement()`
- `java.lang.String getName()`
- `T getCurrentValue()`
- `T [] getCurrentValues()`
- `boolean enabled()`
- `void keyTyped(char eventChar, int eventKey)`
- `void updateCursorCounter()`
- `void mouseClicked(int x, int y, int mouseEvent)`
- `boolean isDefault()`
- `void setToDefault()`
- `void undoChanges()`
- `boolean isChanged()`
- `boolean saveConfigElement()`
- `void drawToolTip(int mouseX, int mouseY)`
- `int getLabelWidth()`
- `int getEntryRightBound()`
- `void onGuiClosed()`

## Description

Provides an interface for defining GuiPropertyList.listEntry objects.
