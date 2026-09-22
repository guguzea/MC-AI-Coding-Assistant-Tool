# GuiConfigEntries.BooleanEntry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.GuiConfigEntries.ListEntryBase → cpw.mods.fml.client.config.GuiConfigEntries.ButtonEntry → cpw.mods.fml.client.config.GuiConfigEntries.BooleanEntry

## Class signature

```java
public static class GuiConfigEntries.BooleanEntry extends GuiConfigEntries.ButtonEntry
```

## Methods

- `java.lang.Boolean getCurrentValue()` — Gets the current value of this entry as a String.
- `java.lang.Boolean[] getCurrentValues()` — Gets the current values of this list entry as a String[].
- `boolean isChanged()` — Has the value of this entry changed?
- `boolean isDefault()` — Is this entry's value equal to the default value?
- `boolean saveConfigElement()` — Handles saving any changes that have been made to this entry back to the underlying object.
- `void setToDefault()` — Sets this entry's value to the default value.
- `void undoChanges()` — Handles reverting any changes that have occurred to this entry.
- `void updateValueButtonText()` — Updates the displayString of the value button.
- `void valueButtonPressed(int slotIndex)` — Called when the value button has been clicked.

## Fields

- `protected boolean beforeValue`
- `protected boolean currentValue`