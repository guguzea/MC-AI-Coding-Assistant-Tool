---
title: "GuiEditArrayEntries"
description: "public class GuiEditArrayEntries extends GuiListExtended"
package: "cpw/mods/fml/client/config"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/GuiEditArrayEntries.html"
sourceType: javadoc
---

# GuiEditArrayEntries

**Inheritance:** java.lang.Object → net.minecraft.client.gui.GuiSlot → net.minecraft.client.gui.GuiListExtended → cpw.mods.fml.client.config.GuiEditArrayEntries

## Class signature

```java
public class GuiEditArrayEntries extends GuiListExtended
```

## Constructors

- `GuiEditArrayEntries(GuiEditArray parent, Minecraft mc, IConfigElement configElement, java.lang.Object[] beforeValues, java.lang.Object[] currentValues)`

## Methods

- `void addNewEntry(int index)`
- `protected void drawScreenPost(int mouseX, int mouseY, float f)`
- `GuiEditArrayEntries.IArrayEntry getListEntry(int index)`
- `int getListWidth()` — Gets the width of the list
- `protected int getScrollBarX()`
- `protected int getSize()`
- `boolean isChanged()`
- `boolean isDefault()`
- `protected boolean isListSavable()`
- `protected void keyTyped(char eventChar, int eventKey)`
- `protected void mouseClicked(int x, int y, int mouseEvent)`
- `void recalculateState()`
- `void removeEntry(int index)`
- `protected void saveListChanges()`
- `protected void updateScreen()`

## Fields

- `java.lang.Object[] beforeValues`
- `boolean canAddMoreEntries`
- `IConfigElement configElement`
- `int controlWidth`
- `java.lang.Object[] currentValues`
- `boolean isChanged`
- `boolean isDefault`
- `java.util.List<GuiEditArrayEntries.IArrayEntry> listEntries`
- `Minecraft mc`
