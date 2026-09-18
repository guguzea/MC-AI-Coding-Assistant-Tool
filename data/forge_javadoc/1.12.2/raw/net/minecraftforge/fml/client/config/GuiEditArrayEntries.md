---
title: "GuiEditArrayEntries"
description: "This class implements the scrolling list functionality of the GuiEditList screen. It also provides all the default controls for editing array-type properties."
package: "net/minecraftforge/fml/client/config"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/client/config/GuiEditArrayEntries.html"
sourceType: javadoc
---

# GuiEditArrayEntries

## Class signature

```java
public class GuiEditArrayEntries extends GuiListExtended
```

## Constructors

- `public GuiEditArrayEntries( GuiEditArray parent, Minecraft mc, IConfigElement configElement, java.lang.Object[] beforeValues, java.lang.Object[] currentValues)`

## Methods

- `protected int getScrollBarX()`
- `public int getListWidth()`
- `public GuiEditArrayEntries.IArrayEntry getListEntry(int index)`
- `protected int getSize()`
- `public void addNewEntry(int index)`
- `public void removeEntry(int index)`
- `public boolean isChanged()`
- `public boolean isDefault()`
- `public void recalculateState()`
- `protected void keyTyped(char eventChar, int eventKey)`
- `protected void updateScreen()`
- `protected void mouseClickedPassThru(int x, int y, int mouseEvent)`
- `protected boolean isListSavable()`
- `protected void saveListChanges()`
- `protected void drawScreenPost(int mouseX, int mouseY, float f)`
- `public Minecraft getMC()`

## Description

This class implements the scrolling list functionality of the GuiEditList screen. It also provides all the default controls for editing array-type properties.
