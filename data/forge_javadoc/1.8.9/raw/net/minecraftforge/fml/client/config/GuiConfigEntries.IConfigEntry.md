---
title: "GuiConfigEntries.IConfigEntry"
description: "Provides an interface for defining GuiConfigEntry.listEntry objects."
package: "net/minecraftforge/fml/client/config"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/client/config/GuiConfigEntries.IConfigEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.IConfigEntry

## Methods

- `IConfigElement getConfigElement()`
- `java.lang.String getName()`
- `java.lang.Object getCurrentValue()`
- `java.lang.Object[] getCurrentValues()`
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

Provides an interface for defining GuiConfigEntry.listEntry objects.
