# GuiConfigEntries.IntegerEntry

## Constructors

- `public IntegerEntry( GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement)`

## Methods

- `public void keyTyped(char eventChar, int eventKey)`
- `public boolean isChanged()`
- `public void undoChanges()`
- `public boolean saveConfigElement()`

## Description

IntegerEntry Provides a GuiTextField for user input. Input is restricted to ensure the value can be parsed using Integer.parseInteger().