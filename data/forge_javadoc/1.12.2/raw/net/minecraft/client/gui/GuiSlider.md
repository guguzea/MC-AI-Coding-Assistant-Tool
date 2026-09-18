---
title: "GuiSlider"
description: "public class GuiSlider extends GuiButton"
package: "net/minecraft/client/gui"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/GuiSlider.html"
sourceType: javadoc
---

# GuiSlider

## Class signature

```java
public class GuiSlider extends GuiButton
```

## Constructors

- `public GuiSlider( GuiPageButtonList.GuiResponder guiResponder, int idIn, int x, int y, java.lang.String nameIn, float minIn, float maxIn, float defaultValue, GuiSlider.FormatHelper formatter)`

## Methods

- `public float getSliderValue()`
- `public void setSliderValue(float value, boolean notifyResponder)`
- `public float getSliderPosition()`
- `protected int getHoverState(boolean mouseOver)`
- `protected void mouseDragged( Minecraft mc, int mouseX, int mouseY)`
- `public void setSliderPosition(float position)`
- `public boolean mousePressed( Minecraft mc, int mouseX, int mouseY)`
- `public void mouseReleased(int mouseX, int mouseY)`
