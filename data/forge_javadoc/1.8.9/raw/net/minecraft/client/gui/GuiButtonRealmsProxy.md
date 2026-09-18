---
title: "GuiButtonRealmsProxy"
description: "Returns 0 if the button is disabled, 1 if the mouse is NOT hovering over this button and 2 if it IS hovering over this button."
package: "net/minecraft/client/gui"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiButtonRealmsProxy.html"
sourceType: javadoc
---

# GuiButtonRealmsProxy

## Class signature

```java
public class GuiButtonRealmsProxy extends GuiButton
```

## Constructors

- `public GuiButtonRealmsProxy( RealmsButton realmsButtonIn, int buttonId, int x, int y, java.lang.String text)`
- `public GuiButtonRealmsProxy( RealmsButton realmsButtonIn, int buttonId, int x, int y, java.lang.String text, int widthIn, int heightIn)`

## Methods

- `public int getId()`
- `public boolean getEnabled()`
- `public void setEnabled(boolean isEnabled)`
- `public void setText(java.lang.String text)`
- `public int getButtonWidth()`
- `public int getPositionY()`
- `public boolean mousePressed( Minecraft mc, int mouseX, int mouseY)`
- `public void mouseReleased(int mouseX, int mouseY)`
- `public void mouseDragged( Minecraft mc, int mouseX, int mouseY)`
- `public RealmsButton getRealmsButton()`
- `public int getHoverState(boolean mouseOver)`
- `public int func_154312_c(boolean p_154312_1_)`
- `public int getHeight()`

## Description

Returns 0 if the button is disabled, 1 if the mouse is NOT hovering over this button and 2 if it IS hovering over this button.
