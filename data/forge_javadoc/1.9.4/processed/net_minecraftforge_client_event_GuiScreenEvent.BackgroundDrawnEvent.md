# GuiScreenEvent.BackgroundDrawnEvent

## Constructors

- `public BackgroundDrawnEvent( GuiScreen gui)`

## Methods

- `public int getMouseX()`
- `public int getMouseY()`

## Description

This event fires at the end of GuiScreen.drawDefaultBackground() and before the rest of the Gui draws. This allows drawing next to Guis, above the background but below any tooltips.