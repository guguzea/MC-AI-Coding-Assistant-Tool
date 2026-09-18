---
title: "GuiConfigEntries.ArrayEntry"
description: "ArrayEntry Provides a GuiButton with the list contents as the displayString. Clicking the button navigates to a screen where the list can be edited."
package: "net/minecraftforge/fml/client/config"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/client/config/GuiConfigEntries.ArrayEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.ArrayEntry

## Constructors

- `public ArrayEntry( GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement)`

## Methods

- `public void updateValueButtonText()`
- `public void valueButtonPressed(int slotIndex)`
- `public void setListFromChildScreen(java.lang.Object[] newList)`
- `public boolean isDefault()`
- `public void setToDefault()`
- `public boolean isChanged()`
- `public void undoChanges()`
- `public boolean saveConfigElement()`
- `public java.lang.Object getCurrentValue()`
- `public java.lang.Object[] getCurrentValues()`

## Description

ArrayEntry Provides a GuiButton with the list contents as the displayString. Clicking the button navigates to a screen where the list can be edited.
