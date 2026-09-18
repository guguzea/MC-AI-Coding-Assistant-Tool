# GuiContainerEvent.DrawForeground

## Constructors

- `public DrawForeground( GuiContainer guiContainer, int mouseX, int mouseY)`

## Methods

- `public int getMouseX()`
- `public int getMouseY()`

## Description

This event is fired directly after the GuiContainer has draw any foreground elements, But before the "dragged" stack, and before any tooltips. This is useful for any slot / item specific overlays. Thi