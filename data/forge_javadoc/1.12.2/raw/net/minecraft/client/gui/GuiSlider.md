---
title: "GuiSlider"
description: "public class GuiSlider extends GuiButton"
package: "net/minecraft/client/gui"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/GuiSlider.html"
sourceType: javadoc
---

# GuiSlider

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiButton → net.minecraft.client.gui.GuiSlider

## Class signature

```java
public class GuiSlider extends GuiButton
```

## Constructors

- `GuiSlider(GuiPageButtonList.GuiResponder guiResponder, int idIn, int x, int y, java.lang.String nameIn, float minIn, float maxIn, float defaultValue, GuiSlider.FormatHelper formatter)`

## Methods

- `protected int getHoverState(boolean mouseOver)`
- `float getSliderPosition()`
- `float getSliderValue()`
- `protected void mouseDragged(Minecraft mc, int mouseX, int mouseY)`
- `boolean mousePressed(Minecraft mc, int mouseX, int mouseY)`
- `void mouseReleased(int mouseX, int mouseY)`
- `void setSliderPosition(float position)`
- `void setSliderValue(float value, boolean notifyResponder)`

## Fields

- `boolean isMouseDown`
