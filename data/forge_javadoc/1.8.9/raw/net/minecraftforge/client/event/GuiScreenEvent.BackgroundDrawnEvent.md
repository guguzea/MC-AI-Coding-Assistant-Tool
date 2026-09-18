---
title: "GuiScreenEvent.BackgroundDrawnEvent"
description: "This event fires at the end of GuiScreen.drawDefaultBackground() and before the rest of the Gui draws. This allows drawing next to Guis, above the background but below any tooltips."
package: "net/minecraftforge/client/event"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/event/GuiScreenEvent.BackgroundDrawnEvent.html"
sourceType: javadoc
---

# GuiScreenEvent.BackgroundDrawnEvent

## Constructors

- `public BackgroundDrawnEvent( GuiScreen gui)`

## Methods

- `public int getMouseX()`
- `public int getMouseY()`

## Description

This event fires at the end of GuiScreen.drawDefaultBackground() and before the rest of the Gui draws. This allows drawing next to Guis, above the background but below any tooltips.
