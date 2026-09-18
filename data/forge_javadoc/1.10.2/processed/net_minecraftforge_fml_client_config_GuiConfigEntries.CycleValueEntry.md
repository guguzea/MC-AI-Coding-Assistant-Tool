# GuiConfigEntries.CycleValueEntry

## Methods

- `public void updateValueButtonText()`
- `public void valueButtonPressed(int slotIndex)`
- `public boolean isDefault()`
- `public void setToDefault()`
- `public boolean isChanged()`
- `public void undoChanges()`
- `public boolean saveConfigElement()`
- `public java.lang.String getCurrentValue()`
- `public java.lang.String[] getCurrentValues()`

## Description

CycleValueEntry Provides a GuiButton that cycles through the prop's validValues array. If the current prop value is not a valid value, the first entry replaces the current value.