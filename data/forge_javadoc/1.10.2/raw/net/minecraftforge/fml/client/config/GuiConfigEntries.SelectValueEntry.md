---
title: "GuiConfigEntries.SelectValueEntry"
description: "SelectValueEntry Provides a GuiButton with the current value as the displayString. Accepts a Map of selectable values with the signature where the key is the Object to be selected and the value is the"
package: "net/minecraftforge/fml/client/config"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/client/config/GuiConfigEntries.SelectValueEntry.html"
sourceType: javadoc
---

# GuiConfigEntries.SelectValueEntry

## Constructors

- `public SelectValueEntry( GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement, java.util.Map<java.lang.Object,java.lang.String> selectableValues)`

## Methods

- `public void updateValueButtonText()`
- `public void valueButtonPressed(int slotIndex)`
- `public void setValueFromChildScreen(java.lang.Object newValue)`
- `public boolean isDefault()`
- `public void setToDefault()`
- `public boolean isChanged()`
- `public void undoChanges()`
- `public boolean saveConfigElement()`
- `public java.lang.String getCurrentValue()`
- `public java.lang.String[] getCurrentValues()`

## Description

SelectValueEntry Provides a GuiButton with the current value as the displayString. Accepts a Map of selectable values with the signature where the key is the Object to be selected and the value is the
