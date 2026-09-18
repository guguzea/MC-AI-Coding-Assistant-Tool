---
title: "GuiScreenEvent.BackgroundDrawnEvent"
description: "This event fires at the end of GuiScreen.drawDefaultBackground() and before the rest of the Gui draws. This allows drawing next to Guis, above the background but below any tooltips."
package: "net/minecraftforge/client/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/event/GuiScreenEvent.BackgroundDrawnEvent.html"
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
