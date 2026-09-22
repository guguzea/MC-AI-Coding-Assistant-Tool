# GuiConfigEntries.ListEntryBase

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.config.GuiConfigEntries.ListEntryBase

## Class signature

```java
public abstract static class GuiConfigEntries.ListEntryBase extends java.lang.Object implements GuiConfigEntries.IConfigEntry
```

## Constructors

- `ListEntryBase(GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `void drawToolTip(int mouseX, int mouseY)` — Handles drawing any tooltips that apply to this entry.
- `boolean enabled()` — Is this list entry enabled?
- `IConfigElement getConfigElement()` — Gets the IConfigElement object owned by this entry.
- `abstract java.lang.Object getCurrentValue()` — Gets the current value of this entry.
- `abstract java.lang.Object[] getCurrentValues()` — Gets the current values of this list entry.
- `int getEntryRightBound()` — Gets this entry's right-hand x boundary.
- `int getLabelWidth()` — Gets this entry's label width.
- `java.lang.String getName()` — Gets the name of the ConfigElement owned by this entry.
- `abstract boolean isChanged()` — Has the value of this entry changed?
- `abstract boolean isDefault()` — Is this entry's value equal to the default value?
- `abstract void keyTyped(char eventChar, int eventKey)` — Handles user keystrokes for any GuiTextField objects in this entry.
- `abstract void mouseClicked(int x, int y, int mouseEvent)` — Call GuiTextField.mouseClicked(int, int, int) for and GuiTextField objects in this entry.
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void onGuiClosed()` — This method is called when the parent GUI is closed.
- `abstract boolean saveConfigElement()` — Handles saving any changes that have been made to this entry back to the underlying object.
- `void setSelected(int p_178011_1_, int p_178011_2_, int p_178011_3_)`
- `abstract void setToDefault()` — Sets this entry's value to the default value.
- `abstract void undoChanges()` — Handles reverting any changes that have occurred to this entry.
- `abstract void updateCursorCounter()` — Call GuiTextField.updateCursorCounter() for any GuiTextField objects in this entry.

## Fields

- `protected GuiButtonExt btnDefault`
- `protected GuiButtonExt btnUndoChanges`
- `protected IConfigElement configElement`
- `protected HoverChecker defaultHoverChecker`
- `protected java.util.List<java.lang.String> defaultToolTip`
- `protected boolean drawLabel`
- `protected boolean isValidValue`
- `protected Minecraft mc`
- `protected java.lang.String name`
- `protected GuiConfigEntries owningEntryList`
- `protected GuiConfig owningScreen`
- `protected java.util.List<java.lang.String> toolTip`
- `protected HoverChecker tooltipHoverChecker`
- `protected HoverChecker undoHoverChecker`
- `protected java.util.List<java.lang.String> undoToolTip`