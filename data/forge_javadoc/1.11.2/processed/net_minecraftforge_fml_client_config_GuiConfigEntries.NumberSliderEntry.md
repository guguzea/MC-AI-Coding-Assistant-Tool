# GuiConfigEntries.NumberSliderEntry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.config.GuiConfigEntries.ListEntryBase → net.minecraftforge.fml.client.config.GuiConfigEntries.ButtonEntry → net.minecraftforge.fml.client.config.GuiConfigEntries.NumberSliderEntry

## Class signature

```java
public static class GuiConfigEntries.NumberSliderEntry extends GuiConfigEntries.ButtonEntry
```

## Constructors

- `NumberSliderEntry(GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement)`

## Methods

- `java.lang.Object getCurrentValue()` — Gets the current value of this entry.
- `java.lang.Object[] getCurrentValues()` — Gets the current values of this list entry.
- `boolean isChanged()` — Has the value of this entry changed?
- `boolean isDefault()` — Is this entry's value equal to the default value?
- `boolean saveConfigElement()` — Handles saving any changes that have been made to this entry back to the underlying object.
- `void setToDefault()` — Sets this entry's value to the default value.
- `void undoChanges()` — Handles reverting any changes that have occurred to this entry.
- `void updateValueButtonText()` — Updates the displayString of the value button.
- `void valueButtonPressed(int slotIndex)` — Called when the value button has been clicked.

## Fields

- `protected double beforeValue`