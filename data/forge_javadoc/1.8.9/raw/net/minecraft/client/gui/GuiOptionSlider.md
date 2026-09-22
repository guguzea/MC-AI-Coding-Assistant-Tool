---
title: "GuiOptionSlider"
description: "public class GuiOptionSlider extends GuiButton"
package: "net/minecraft/client/gui"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiOptionSlider.html"
sourceType: javadoc
---

# GuiOptionSlider

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiButton → net.minecraft.client.gui.GuiOptionSlider

## Class signature

```java
public class GuiOptionSlider extends GuiButton
```

## Constructors

- `GuiOptionSlider(int p_i45016_1_, int p_i45016_2_, int p_i45016_3_, GameSettings.Options p_i45016_4_)`
- `GuiOptionSlider(int p_i45017_1_, int p_i45017_2_, int p_i45017_3_, GameSettings.Options p_i45017_4_, float p_i45017_5_, float p_i45017_6_)`

## Methods

- `protected int getHoverState(boolean mouseOver)` — Returns 0 if the button is disabled, 1 if the mouse is NOT hovering over this button and 2 if it IS hovering over this button.
- `protected void mouseDragged(Minecraft mc, int mouseX, int mouseY)` — Fired when the mouse button is dragged.
- `boolean mousePressed(Minecraft mc, int mouseX, int mouseY)` — Returns true if the mouse has been pressed on this control.
- `void mouseReleased(int mouseX, int mouseY)` — Fired when the mouse button is released.

## Fields

- `boolean dragging`
