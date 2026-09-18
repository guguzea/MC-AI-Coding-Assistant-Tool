---
title: "GuiButton"
description: "The string displayed on this control."
package: "net/minecraft/client/gui"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiButton.html"
sourceType: javadoc
---

# GuiButton

## Class signature

```java
public class GuiButton extends Gui
```

## Constructors

- `public GuiButton(int buttonId, int x, int y, java.lang.String buttonText)`
- `public GuiButton(int buttonId, int x, int y, int widthIn, int heightIn, java.lang.String buttonText)`

## Methods

- `protected int getHoverState(boolean mouseOver)`
- `public void drawButton( Minecraft mc, int mouseX, int mouseY)`
- `protected void mouseDragged( Minecraft mc, int mouseX, int mouseY)`
- `public void mouseReleased(int mouseX, int mouseY)`
- `public boolean mousePressed( Minecraft mc, int mouseX, int mouseY)`
- `public boolean isMouseOver()`
- `public void drawButtonForegroundLayer(int mouseX, int mouseY)`
- `public void playPressSound( SoundHandler soundHandlerIn)`
- `public int getButtonWidth()`
- `public void setWidth(int width)`

## Description

The string displayed on this control.
