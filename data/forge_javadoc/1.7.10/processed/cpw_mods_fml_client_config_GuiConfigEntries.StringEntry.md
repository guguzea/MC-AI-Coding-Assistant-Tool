# GuiConfigEntries.StringEntry

## Constructors

- `public StringEntry( GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement <?> configElement)`

## Methods

- `public void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, Tessellator tessellator, int mouseX, int mouseY, boolean isSelected)`
- `public void keyTyped(char eventChar, int eventKey)`
- `public void updateCursorCounter()`
- `public void mouseClicked(int x, int y, int mouseEvent)`
- `public boolean isDefault()`
- `public void setToDefault()`
- `public boolean isChanged()`
- `public void undoChanges()`
- `public boolean saveConfigElement()`
- `public java.lang.Object getCurrentValue()`
- `public java.lang.Object[] getCurrentValues()`

## Description

StringEntry Provides a GuiTextField for user input.