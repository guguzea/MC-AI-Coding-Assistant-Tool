# GuiConfigEntries.StringEntry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.GuiConfigEntries.ListEntryBase → cpw.mods.fml.client.config.GuiConfigEntries.StringEntry

## Class signature

```java
public static class GuiConfigEntries.StringEntry extends GuiConfigEntries.ListEntryBase
```

## Constructors

- `StringEntry(GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement<?> configElement)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, Tessellator tessellator, int mouseX, int mouseY, boolean isSelected)`
- `java.lang.Object getCurrentValue()` — Gets the current value of this entry as a String.
- `java.lang.Object[] getCurrentValues()` — Gets the current values of this list entry as a String[].
- `boolean isChanged()` — Has the value of this entry changed?
- `boolean isDefault()` — Is this entry's value equal to the default value?
- `void keyTyped(char eventChar, int eventKey)` — Handles user keystrokes for any GuiTextField objects in this entry.
- `void mouseClicked(int x, int y, int mouseEvent)` — Call GuiTextField.mouseClicked() for and GuiTextField objects in this entry.
- `boolean saveConfigElement()` — Handles saving any changes that have been made to this entry back to the underlying object.
- `void setToDefault()` — Sets this entry's value to the default value.
- `void undoChanges()` — Handles reverting any changes that have occurred to this entry.
- `void updateCursorCounter()` — Call GuiTextField.updateCursorCounter() for any GuiTextField objects in this entry.

## Fields

- `protected java.lang.String beforeValue`
- `protected GuiTextField textFieldValue`