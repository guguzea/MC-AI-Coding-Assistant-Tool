# GuiConfigEntries.ButtonEntry

## Constructors

- `public ButtonEntry( GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement)`
- `public ButtonEntry( GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement, GuiButtonExt button)`

## Methods

- `public abstract void updateValueButtonText()`
- `public abstract void valueButtonPressed(int slotIndex)`
- `public void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `public boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public void keyTyped(char eventChar, int eventKey)`
- `public void updateCursorCounter()`
- `public void mouseClicked(int x, int y, int mouseEvent)`

## Description

ButtonEntry Provides a basic GuiButton entry to be used as a base for other entries that require a button for the value.