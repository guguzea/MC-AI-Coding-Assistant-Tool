---
title: "GuiButton"
description: "public class GuiButton extends Gui"
package: "net/minecraft/client/gui"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/GuiButton.html"
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
- `public void drawButton( Minecraft mc, int mouseX, int mouseY, float partialTicks)`
- `protected void mouseDragged( Minecraft mc, int mouseX, int mouseY)`
- `public void mouseReleased(int mouseX, int mouseY)`
- `public boolean mousePressed( Minecraft mc, int mouseX, int mouseY)`
- `public boolean isMouseOver()`
- `public void drawButtonForegroundLayer(int mouseX, int mouseY)`
- `public void playPressSound( SoundHandler soundHandlerIn)`
- `public int getButtonWidth()`
- `public void setWidth(int width)`
