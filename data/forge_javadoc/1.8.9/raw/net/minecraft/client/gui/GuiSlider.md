---
title: "GuiSlider"
description: "Returns 0 if the button is disabled, 1 if the mouse is NOT hovering over this button and 2 if it IS hovering over this button."
package: "net/minecraft/client/gui"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiSlider.html"
sourceType: javadoc
---

# GuiSlider

## Class signature

```java
public class GuiSlider extends GuiButton
```

## Constructors

- `public GuiSlider( GuiPageButtonList.GuiResponder guiResponder, int idIn, int x, int y, java.lang.String name, float min, float max, float defaultValue, GuiSlider.FormatHelper formatter)`

## Methods

- `public float func_175220_c()`
- `public void func_175218_a(float p_175218_1_, boolean p_175218_2_)`
- `public float func_175217_d()`
- `protected int getHoverState(boolean mouseOver)`
- `protected void mouseDragged( Minecraft mc, int mouseX, int mouseY)`
- `public void func_175219_a(float p_175219_1_)`
- `public boolean mousePressed( Minecraft mc, int mouseX, int mouseY)`
- `public void mouseReleased(int mouseX, int mouseY)`

## Description

Returns 0 if the button is disabled, 1 if the mouse is NOT hovering over this button and 2 if it IS hovering over this button.
