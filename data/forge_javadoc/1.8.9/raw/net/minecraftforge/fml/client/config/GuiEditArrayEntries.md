---
title: "GuiEditArrayEntries"
description: "public class GuiEditArrayEntries extends GuiListExtended"
package: "net/minecraftforge/fml/client/config"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/client/config/GuiEditArrayEntries.html"
sourceType: javadoc
---

# GuiEditArrayEntries

**Inheritance:** java.lang.Object → net.minecraft.client.gui.GuiSlot → net.minecraft.client.gui.GuiListExtended → net.minecraftforge.fml.client.config.GuiEditArrayEntries

## Class signature

```java
public class GuiEditArrayEntries extends GuiListExtended
```

## Constructors

- `GuiEditArrayEntries(GuiEditArray parent, Minecraft mc, IConfigElement configElement, java.lang.Object[] beforeValues, java.lang.Object[] currentValues)`

## Methods

- `void addNewEntry(int index)`
- `protected void drawScreenPost(int mouseX, int mouseY, float f)`
- `GuiEditArrayEntries.IArrayEntry getListEntry(int index)` — Gets the IGuiListEntry object for the given index
- `int getListWidth()` — Gets the width of the list
- `protected int getScrollBarX()`
- `protected int getSize()`
- `boolean isChanged()`
- `boolean isDefault()`
- `protected boolean isListSavable()`
- `protected void keyTyped(char eventChar, int eventKey)`
- `protected void mouseClickedPassThru(int x, int y, int mouseEvent)`
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
- `protected GuiEditArray owningGui`
