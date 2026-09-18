# GuiConfigEntries.DoubleEntry

## Constructors

- `public DoubleEntry( GuiConfig owningScreen, GuiConfigEntries owningEntryList, IConfigElement configElement)`

## Methods

- `public void keyTyped(char eventChar, int eventKey)`
- `public boolean isChanged()`
- `public void undoChanges()`
- `public boolean saveConfigElement()`

## Description

DoubleEntry Provides a GuiTextField for user input. Input is restricted to ensure the value can be parsed using Double.parseDouble().