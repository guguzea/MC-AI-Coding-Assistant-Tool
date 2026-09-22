---
title: "GuiSlider"
description: "public class GuiSlider extends GuiButtonExt"
package: "net/minecraftforge/fml/client/config"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/client/config/GuiSlider.html"
sourceType: javadoc
---

# GuiSlider

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiButton → net.minecraftforge.fml.client.config.GuiButtonExt → net.minecraftforge.fml.client.config.GuiSlider

## Class signature

```java
public class GuiSlider extends GuiButtonExt
```

## Constructors

- `GuiSlider(int id, int xPos, int yPos, int width, int height, java.lang.String prefix, java.lang.String suf, double minVal, double maxVal, double currentVal, boolean showDec, boolean drawStr)`
- `GuiSlider(int id, int xPos, int yPos, int width, int height, java.lang.String prefix, java.lang.String suf, double minVal, double maxVal, double currentVal, boolean showDec, boolean drawStr, GuiSlider.ISlider par)`
- `GuiSlider(int id, int xPos, int yPos, java.lang.String displayStr, double minVal, double maxVal, double currentVal, GuiSlider.ISlider par)`

## Methods

- `int getHoverState(boolean par1)` — Returns 0 if the button is disabled, 1 if the mouse is NOT hovering over this button and 2 if it IS hovering over this button.
- `double getValue()`
- `int getValueInt()`
- `protected void mouseDragged(Minecraft par1Minecraft, int par2, int par3)` — Fired when the mouse button is dragged.
- `boolean mousePressed(Minecraft par1Minecraft, int par2, int par3)` — Returns true if the mouse has been pressed on this control.
- `void mouseReleased(int par1, int par2)` — Fired when the mouse button is released.
- `void setValue(double d)`
- `void updateSlider()`

## Fields

- `java.lang.String dispString`
- `boolean dragging` — Is this slider control being dragged.
- `boolean drawString`
- `double maxValue`
- `double minValue`
- `GuiSlider.ISlider parent`
- `int precision`
- `boolean showDecimal`
- `double sliderValue` — The value of this slider control.
- `java.lang.String suffix`
