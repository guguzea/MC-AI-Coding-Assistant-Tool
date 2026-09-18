---
title: "GuiConfigEntries"
description: "This class implements the scrolling list functionality of the config GUI screens. It also provides all the default control handlers for the various property types."
package: "cpw/mods/fml/client/config"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/GuiConfigEntries.html"
sourceType: javadoc
---

# GuiConfigEntries

## Class signature

```java
public class GuiConfigEntries extends GuiListExtended
```

## Constructors

- `public GuiConfigEntries( GuiConfig parent, Minecraft mc)`

## Methods

- `protected void initGui()`
- `public int getSize()`
- `public GuiConfigEntries.IConfigEntry getListEntry(int index)`
- `public int getScrollBarX()`
- `public int getListWidth()`
- `public void keyTyped(char eventChar, int eventKey)`
- `public void updateScreen()`
- `public void mouseClicked(int mouseX, int mouseY, int mouseEvent)`
- `public void onGuiClosed()`
- `public boolean saveConfigElements()`
- `public boolean areAllEntriesDefault(boolean includeChildren)`
- `public void setAllToDefault(boolean includeChildren)`
- `public boolean hasChangedEntry(boolean includeChildren)`
- `public boolean areAnyEntriesEnabled(boolean includeChildren)`
- `public void undoAllChanges(boolean includeChildren)`
- `public void drawScreenPost(int mouseX, int mouseY, float partialTicks)`

## Description

This class implements the scrolling list functionality of the config GUI screens. It also provides all the default control handlers for the various property types.
