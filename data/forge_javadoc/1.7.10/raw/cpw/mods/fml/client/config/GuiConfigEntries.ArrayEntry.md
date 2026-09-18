---
title: "GuiConfigEntries.ArrayEntry"
description: "ArrayEntry Provides a GuiButton with the list contents as the displayString. Clicking the button navigates to a screen where the list can be edited."
package: "cpw/mods/fml/client/config"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/GuiConfigEntries.ArrayEntry.html"
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
