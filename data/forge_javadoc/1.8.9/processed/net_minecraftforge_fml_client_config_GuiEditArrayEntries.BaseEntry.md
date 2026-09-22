# GuiEditArrayEntries.BaseEntry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.config.GuiEditArrayEntries.BaseEntry

## Class signature

```java
public static class GuiEditArrayEntries.BaseEntry extends java.lang.Object implements GuiEditArrayEntries.IArrayEntry
```

## Constructors

- `BaseEntry(GuiEditArray owningScreen, GuiEditArrayEntries owningEntryList, IConfigElement configElement)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `void drawToolTip(int mouseX, int mouseY)`
- `java.lang.Object getValue()`
- `boolean isValueSavable()`
- `void keyTyped(char eventChar, int eventKey)`
- `void mouseClicked(int x, int y, int mouseEvent)`
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)` — Returns true if the mouse has been pressed on this control.
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)` — Fired when the mouse button is released.
- `void setSelected(int p_178011_1_, int p_178011_2_, int p_178011_3_)`
- `void updateCursorCounter()`

## Fields

- `protected GuiButtonExt btnAddNewEntryAbove`
- `protected GuiButtonExt btnRemoveEntry`
- `protected IConfigElement configElement`
- `protected boolean isValidated`
- `protected boolean isValidValue`
- `protected GuiEditArrayEntries owningEntryList`
- `protected GuiEditArray owningScreen`