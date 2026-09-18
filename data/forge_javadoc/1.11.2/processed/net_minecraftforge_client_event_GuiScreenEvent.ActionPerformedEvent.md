# GuiScreenEvent.ActionPerformedEvent

## Constructors

- `public ActionPerformedEvent( GuiScreen gui, GuiButton button, java.util.List< GuiButton > buttonList)`

## Methods

- `public GuiButton getButton()`
- `public void setButton( GuiButton button)`
- `public java.util.List< GuiButton > getButtonList()`
- `public void setButtonList(java.util.List< GuiButton > buttonList)`

## Description

This event fires after GuiScreen.actionPerformed(GuiButton) provided that the active screen has not been changed as a result of GuiScreen.actionPerformed(GuiButton) .